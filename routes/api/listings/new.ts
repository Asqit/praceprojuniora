import { FreshContext } from "$fresh/server.ts";
import { initDb } from "../../../lib/db/index.ts";
import { ListingController } from "../../../lib/listing-controller.ts";
import { z } from "zod";

const payloadSchema = z.object({
  title: z.string(),
  link: z.url(),
  location: z.string(),
  status: z.string(),
  description: z.string().optional(),
});

export async function handler(req: Request, _: FreshContext) {
  try {
    const payload = await payloadSchema.parseAsync(await req.json());
    const db = await initDb();
    const controller = new ListingController(db);
    const data = await controller.create({
      ...payload,
      manuallyAdded: true,
    });

    return new Response(JSON.stringify({ id: data.id }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
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
