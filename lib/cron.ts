import { initDb } from "./db/index.ts";
import { fetchListings } from "./scraping/index.ts";
import { Listing } from "./scraping/types.ts";

Deno.cron("fetch job listings", { hour: { start: 9, end: 17 } }, async () => {
  console.log('- starting CRON job "fetch job listings"');
  const jobs = await fetchListings();
  const kv = await initDb();
  for (const job of jobs as Listing[]) {
    await kv.set(["listing", job.link], job);
  }
  console.log('- finished CRON job "fetch job listings"');
});
