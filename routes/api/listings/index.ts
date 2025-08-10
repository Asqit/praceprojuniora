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

  const db = await initDb();
  const controller = new ListingController(db);
  const listings = await controller.list();

  if (listings.length === 0) {
    return new Response(
      JSON.stringify({ data: [], message: "No listings available." }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  return new Response(JSON.stringify({ data: listings }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
