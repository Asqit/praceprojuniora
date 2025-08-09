/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import "$std/dotenv/load.ts";

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";
import { initDb } from "./lib/db/index.ts";
import { fetchListings } from "./lib/scraping/index.ts";
import { Listing } from "./lib/scraping/types.ts";

Deno.cron("fetch job listings", { hour: { start: 9, end: 17 } }, async () => {
  console.log('- starting CRON job "fetch job listings"');
  const jobs = await fetchListings();
  const kv = await initDb();
  for (const job of jobs as Listing[]) {
    await kv.set(["listing", job.link], job);
  }
  console.log('- finished CRON job "fetch job listings"');
});

await start(manifest, config);
