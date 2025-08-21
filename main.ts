/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import "$std/dotenv/load.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";
import { start } from "$fresh/server.ts";
import { initDb } from "./lib/db/index.ts";
import { fetchListings } from "./lib/scraping/index.ts";
import { ListingController } from "./lib/listing-controller.ts";

Deno.cron("fetch job listings", "0 6 * * *", async () => {
  console.log('- starting CRON job "fetch job listings"');
  const db = await initDb();
  const controller = new ListingController(db);
  const jobs = await fetchListings();

  for (const job of jobs) {
    await controller.create(job);
  }
  console.log('- finished CRON job "fetch job listings"');
});

Deno.cron("delete old postings", "0 * * * *", async () => {
  console.log('- starting CRON job "delete old postings"');
  const db = await initDb();
  const controller = new ListingController(db);
  const deletedCount = await controller.deleteOldListings();
  console.log(`- Deleted ${deletedCount} expired listings`);
});

Deno.cron("update listing status meta", "0 6,18 * * *", async () => {
  console.log('- starting CRON job "update listing status meta"');
  const db = await initDb();
  const controller = new ListingController(db);

  let updatedCount = 0;
  const listings = await controller.list();

  for (const listing of listings) {
    const newStatusMeta = controller.getStatusMeta(
      listing.createdAt,
      listing.status,
    );

    if (listing.statusMeta !== newStatusMeta) {
      const updatedListing = {
        ...listing,
        statusMeta: newStatusMeta,
        updatedAt: new Date().toISOString(),
      };
      await db.set(["listings", listing.id], updatedListing);
      updatedCount++;
    }
  }

  console.log(`- Updated statusMeta for ${updatedCount} listings`);
});

const fetchInitials = async () => {
  const db = await initDb();
  const controller = new ListingController(db);
  const existing = await controller.list();
  if (existing.length > 0) {
    console.log("Listings already exist — skipping fetch.");
    return;
  }

  console.log("No listings found — fetching...");
  try {
    const jobs = await fetchListings();
    for (const job of jobs) {
      await controller.create(job);
    }
    console.log(`Fetched and stored ${jobs.length} junior jobs.`);
  } catch (err) {
    console.error("Failed to fetch and store listings:", err);
  }
};

await Promise.all([fetchInitials(), start(manifest, config)]);
