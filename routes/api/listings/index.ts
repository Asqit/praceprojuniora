import { FreshContext } from "$fresh/server.ts";
import { initDb } from "../../../lib/db/index.ts";
import { ListingController } from "../../../lib/listing-controller.ts";

export async function handler(req: Request, _: FreshContext) {
  if (req.method !== "GET") {
    return new Response(null, {
      status: 405,
      headers: { "Allow": "GET" },
    });
  }

  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);
  const offset = parseInt(url.searchParams.get("offset") || "0");

  const db = await initDb();
  const controller = new ListingController(db);
  const allListings = await controller.list();

  const total = allListings.length;
  const paginatedListings = allListings.slice(offset, offset + limit);

  if (total === 0) {
    return new Response(
      JSON.stringify({ data: [], total: 0, hasMore: false, message: "No listings available." }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  return new Response(JSON.stringify({ 
    data: paginatedListings, 
    total,
    hasMore: offset + limit < total 
  }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
