import { FreshContext } from "$fresh/server.ts";
import { initDb } from "../../../lib/db/index.ts";
import { ListingController } from "../../../lib/listing-controller.ts";
import { z } from "zod";

const schema = z.object({
  ids: z.array(z.string()).min(1),
});

export async function handler(req: Request, _: FreshContext) {
  if (req.method !== "POST") {
    return new Response(null, {
      status: 405,
      headers: { "Allow": "POST" },
    });
  }

  try {
    const { ids } = await schema.parseAsync(await req.json());
    const db = await initDb();
    const controller = new ListingController(db);
    const allListings = await controller.list();
    const filteredListings = allListings.filter((listing) =>
      ids.includes(listing.id)
    );

    return new Response(JSON.stringify({ data: filteredListings }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (_error) {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
}
