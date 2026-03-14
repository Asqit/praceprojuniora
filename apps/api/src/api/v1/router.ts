import { Hono } from "hono";
import listingRoutes from "./endpoints/listing.routes";

export const v1 = new Hono()
  .route("/listing", listingRoutes)
  .get("/health", async (c) => {
    return c.json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: Date.now(),
    });
  });

export type AppType = typeof v1;
