import { fetchListings } from "@ppj/scraper";
import { db } from "../db/connection";
import { jobs } from "../db/schema";
import { eq, lte, sql, desc } from "drizzle-orm";
import { getExpiresAt } from "./listing-expiry";

async function fetchNew(): Promise<void> {
  console.log("Fetching new listings...");
  const lastJob = await db
    .select()
    .from(jobs)
    .orderBy(desc(jobs.createdAt))
    .limit(1);
  const lastScrape = lastJob[0]?.createdAt;

  if (
    lastScrape &&
    Date.now() - new Date(lastScrape).getTime() < 1000 * 60 * 60
  ) {
    console.log("Data fresh, skipping scrape");
    return;
  }

  const listings = await fetchListings();
  const withExpiry = listings.map((listing) => ({
    ...listing,
    expiresAt: getExpiresAt(listing.status ?? ""),
  }));

  await db
    .insert(jobs)
    .values(withExpiry)
    .onConflictDoUpdate({
      target: jobs.link,
      set: {
        status: sql`excluded.status`,
        expiresAt: sql`excluded."expiresAt"`,
        updatedAt: new Date().toISOString(),
      },
    });

  console.log(`Fetched and upserted ${listings.length} listings`);
}

async function enrichPending(): Promise<void> {
  console.log("Enriching pending listings...");

  const pending = await db
    .select()
    .from(jobs)
    .where(eq(jobs.enrichmentStatus, "pending"));

  if (pending.length === 0) {
    console.log("No pending listings to enrich");
    return;
  }

  console.log(`Found ${pending.length} pending listings`);

  for (const _job of pending) {
    // TODO: Claude/LLM API call
  }
}

async function deleteExpired(): Promise<void> {
  console.log("Deleting expired listings...");

  const result = await db
    .delete(jobs)
    .where(lte(jobs.expiresAt, new Date().toISOString()));

  console.log(`Deleted ${result.rowsAffected} expired listings`);
}

export const listingTasks = {
  fetchNew,
  enrichPending,
  deleteExpired,
};
