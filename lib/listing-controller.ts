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
    const source = manuallyAdded ? "manual" : "jobs.cz";

    // Check for existing listing via link
    for await (const entry of this.kv.list<Listing>({ prefix: ["listings"] })) {
      if (entry.value.link === listingData.link) {
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
          statusMeta: this.getStatusMeta(now, listingData.status),
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

  async deleteOldListings(maxAgeDays = 90): Promise<number> {
    const now = Date.now();
    const maxAge = maxAgeDays * 24 * 60 * 60 * 1000;
    let deleted = 0;

    for await (const entry of this.kv.list<Listing>({ prefix: ["listings"] })) {
      const createdAt = new Date(entry.value.createdAt).getTime();
      if (now - createdAt > maxAge) {
        await this.kv.delete(entry.key);
        deleted++;
      }
    }

    return deleted;
  }

  private getStatusMeta(
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

  private getExpiredAt(rawStatus: string): Listing["createdAt"] {
    const compare = rawStatus.toLowerCase();
    const today = new Date();

    if (compare.includes("končí")) {
      if (compare.includes("zítra")) {
        // ending in hours, remove day after tomorrow
        // (we don't have exact time of expiration so we assume whole day)
        return new Date(today.getDate() + 2).toISOString();
      }

      // ending in hours, remove tomorrow
      return new Date(today.getDate() + 1).toISOString();
    }

    // otherwise remove the listing after 30 days.
    return new Date(today.getDate() + 30).toISOString();
  }
}
