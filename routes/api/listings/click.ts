import { FreshContext } from "$fresh/server.ts";
import { initDb } from "../../../lib/db/index.ts";
import { ListingController } from "../../../lib/listing-controller.ts";
import { z } from "zod";

const payloadSchema = z.object({
  id: z.uuid(),
});

export async function handler(req: Request, _: FreshContext) {
  try {
    if (req.method !== "PUT") {
      return new Response(null, {
        status: 405,
        headers: { "Allow": "PUT" },
      });
    }

    const { id } = await payloadSchema.parseAsync(await req.json());
    const db = await initDb();
    const controller = new ListingController(db);
    await controller.incrementClicks(id);

    return new Response(JSON.stringify({ id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: error.flatten() }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    console.error("Unexpected error in manual listing:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
