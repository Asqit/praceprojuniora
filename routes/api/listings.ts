import { FreshContext } from "$fresh/server.ts";
import { initDb } from "../../lib/db/index.ts";
import { Listing } from "../../lib/scraping/types.ts";

export async function handler(
  req: Request,
  _: FreshContext,
): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Bad Request", { status: 400 });
  }

  const kv = await initDb();
  const listings: Listing[] = [];
  for await (const entry of kv.list({ prefix: ["listing"] })) {
    listings.push(entry.value as Listing);
  }

  // Filter for junior positions
  const juniorListings = listings.filter(
    (job) =>
      job.title.toLowerCase().includes("junior") ||
      job.title.toLowerCase().includes("entry"),
  );

  return new Response(JSON.stringify({ data: juniorListings }), {
    headers: { "Content-Type": "application/json" },
  });
}
