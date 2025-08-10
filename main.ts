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
import { Listing } from "./lib/scraping/types.ts";

Deno.cron("fetch job listings", "0 9 * * *", async () => {
  console.log('- starting CRON job "fetch job listings"');
  const jobs = await fetchListings();
  const kv = await initDb();
  const createdAt = new Date().toISOString();
  const juniorListings = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes("junior") ||
      job.title.toLowerCase().includes("entry"),
  );

  for (const job of juniorListings as Listing[]) {
    const jobWithDate = {
      ...job,
      createdAt, // Add creation date to the job
    };
    await kv.set(["listing", job.link], jobWithDate);
  }
  console.log('- finished CRON job "fetch job listings"');
});

await start(manifest, config);
