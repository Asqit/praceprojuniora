import { FreshContext } from "$fresh/server.ts";
import { initDb } from "../../../lib/db/index.ts";
import { ListingController } from "../../../lib/listing-controller.ts";

export async function handler(req: Request, _: FreshContext) {
  if (req.method !== "POST") {
    return new Response(null, {
      status: 405,
      headers: { "Allow": "POST" },
    });
  }

  try {
    const { ids } = await req.json();
    
    if (!Array.isArray(ids)) {
      return new Response(
        JSON.stringify({ error: "ids must be an array" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const db = await initDb();
    const controller = new ListingController(db);
    const allListings = await controller.list();
    
    const filteredListings = allListings.filter(listing => 
      ids.includes(listing.id)
    );

    return new Response(JSON.stringify({ data: filteredListings }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}