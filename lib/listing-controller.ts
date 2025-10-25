import { USER_AGENT } from "./server-variables.ts";
import { type Listing } from "./types.ts";

export class ListingController {
  constructor(private kv: Deno.Kv) {}

  async create(
    listingData: Partial<Listing> & {
      title: string;
      link: string;
      location: string;
      status?: string;
      description?: string;
      manuallyAdded?: boolean;
    },
  ): Promise<Listing> {
    const now = new Date().toISOString();
    const manuallyAdded = listingData.manuallyAdded ?? false;
    const source = manuallyAdded ? "manual" : listingData?.source ?? "Unknown";

    // Check for existing listing via link or title
    for await (const entry of this.kv.list<Listing>({ prefix: ["listings"] })) {
      if (
        entry.value.link === listingData.link ||
        entry.value.title.toLowerCase() === listingData.title.toLowerCase()
      ) {
        console.log(`found duplicate, updating now.`);
        const updatedListing: Listing = {
          ...entry.value,
          title: listingData.title,
          company: listingData.company ?? entry.value.company,
          location: listingData.location,
          status: listingData.status ?? entry.value.status,
          description: listingData.description ?? entry.value.description,
          manuallyAdded,
          source,
          updatedAt: now,
          statusMeta: this.getStatusMeta(
            entry.value.createdAt,
            listingData.status,
          ),
          expiredAt: this.getExpiredAt(listingData.status ?? ""),
        };

        await this.kv.set(entry.key, updatedListing);
        return updatedListing;
      }
    }

    // no duplicate, creating new
    const id = crypto.randomUUID();
    const listing: Listing = {
      id,
      title: listingData.title,
      company: listingData.company ?? "N/A",
      link: listingData.link,
      location: listingData.location,
      status: listingData.status ?? "Nové",
      description: listingData.description,
      createdAt: now,
      updatedAt: now,
      clicks: 0,
      manuallyAdded,
      source,
      statusMeta: this.getStatusMeta(now, listingData.status),
      expiredAt: this.getExpiredAt(listingData.status ?? ""),
    };

    await this.kv.set(["listings", id], listing);
    return listing;
  }

  async get(id: string): Promise<Listing | null> {
    const entry = await this.kv.get<Listing>(["listings", id]);
    return entry.value ?? null;
  }

  async list(): Promise<Listing[]> {
    const listings: Listing[] = [];

    for await (const entry of this.kv.list<Listing>({ prefix: ["listings"] })) {
      listings.push(entry.value);
    }

    return listings.filter((l) => l.statusMeta !== "expired");
  }

  async incrementClicks(id: string): Promise<void> {
    const listing = await this.get(id);
    if (!listing) return;

    listing.clicks += 1;
    listing.updatedAt = new Date().toISOString();
    await this.kv.set(["listings", id], listing);
  }

  // v ListingController.ts

  async validateListing(listing: Listing): Promise<boolean> {
    try {
      const res = await fetch(listing.link, {
        method: "GET",
        headers: {
          "User-Agent": USER_AGENT,
        },
      });

      // 404 nebo 410 → rovnou expired
      if (res.status === 404 || res.status === 410) {
        return false;
      }

      // fallback check textu
      const text = await res.text();
      if (
        text.includes("inzerát již není aktivní") ||
        text.includes("pozice již není dostupná") ||
        text.includes("job closed")
      ) {
        return false;
      }

      return true; // pořád živý
    } catch (_err) {
      // když server failne, radši necháme aktivní (aby nebylo false-positive)
      return true;
    }
  }

  async validateAll(): Promise<number> {
    const listings = await this.list();
    let expiredCount = 0;

    // listings just older than 7 days
    const now = Date.now();
    const oldListings = listings.filter((l) => {
      const ageDays = (now - new Date(l.createdAt).getTime()) /
        (1000 * 60 * 60 * 24);
      return ageDays > 7;
    });

    for (const listing of oldListings) {
      const alive = await this.validateListing(listing);
      if (!alive) {
        listing.statusMeta = "expired";
        listing.expiredAt = new Date().toISOString();
        listing.updatedAt = new Date().toISOString();
        await this.kv.set(["listings", listing.id], listing);
        expiredCount++;
      }

      // rate limit – 200ms delay mezi requesty
      await new Promise((r) => setTimeout(r, 200));
    }

    return expiredCount;
  }

  async deleteOldListings(): Promise<number> {
    const now = new Date();
    let deleted = 0;

    for await (const entry of this.kv.list<Listing>({ prefix: ["listings"] })) {
      const expiredAt = new Date(entry.value.expiredAt);
      if (now >= expiredAt) {
        await this.kv.delete(entry.key);
        deleted++;
      }
    }

    return deleted;
  }

  getStatusMeta(
    createdAt: string,
    rawStatus?: string,
  ): Listing["statusMeta"] {
    const created = new Date(createdAt);
    const now = new Date();
    const ageMs = now.getTime() - created.getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);

    if (ageDays > 30) return "expired";
    if (rawStatus?.toLowerCase().includes("končí")) return "expiring";
    if (ageDays <= 7) return "new";
    return "stale";
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private getExpiredAt(rawStatus: string): Listing["createdAt"] {
    const compare = rawStatus.toLowerCase();
    const today = new Date();

    if (compare.includes("končí")) {
      if (compare.includes("zítra")) {
        // ending in hours, remove day after tomorrow
        // (we don't have exact time of expiration so we assume whole day)
        return this.addDays(today, 2).toISOString();
      }

      // ending in N days...
      if (compare.includes("dny")) {
        const parsed = Number(
          compare.split(" ").find((word) => parseInt(word)),
        );
        const days = isNaN(parsed) ? 1 : parsed;
        return this.addDays(today, days).toISOString();
      }

      // ending in hours, remove tomorrow
      return this.addDays(today, 1).toISOString();
    }

    // otherwise remove the listing after 30 days.
    return this.addDays(today, 30).toISOString();
  }
}
