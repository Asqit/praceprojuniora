import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { initDb } from "../../../lib/db/index.ts";
import { ListingController } from "../../../lib/listing-controller.ts";
import * as z from "zod";

const router = new Hono();

//------------------------------------------------------------------------------ Click
const clickSchema = z.object({
  id: z.uuid(),
});

router.put("/click", zValidator("json", clickSchema), async (c) => {
  const { id } = c.req.valid("json");
  const db = await initDb();
  const controller = new ListingController(db);
  await controller.incrementClicks(id);
  return c.json({ status: "ok" });
});

// ------------------------------------------------------------------------------ Bulk
const bulkSchema = z.object({
  ids: z.array(z.uuid()),
});

router.post("/bulk", zValidator("json", bulkSchema), async (c) => {
  const { ids } = c.req.valid("json");
  const db = await initDb();
  const controller = new ListingController(db);
  const listings = await controller.list();
  return c.json({
    data: listings.filter((l) => ids.includes(l.id)),
  });
});

// ------------------------------------------------------------------------------ New
const newSchema = z.object({
  title: z.string(),
  link: z.url(),
  location: z.string(),
  status: z.string(),
  description: z.string().optional(),
});

router.post("/", zValidator("json", newSchema), async (c) => {
  const payload = c.req.valid("json");
  const db = await initDb();
  const controller = new ListingController(db);
  const data = await controller.create({
    ...payload,
    manuallyAdded: true,
  });

  c.status(201);
  return c.json({ id: data.id });
});

// ------------------------------------------------------------------------------ Get
const getSchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => Math.min(parseInt(val || "20"), 50)),
  offset: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "0")),
  location: z
    .string()
    .optional()
    .default("all"),
  sortBy: z
    .enum(["newest", "popular", "expiring"])
    .optional()
    .default("newest"),
});

router.get("/", zValidator("query", getSchema), async (c) => {
  const { limit, offset, location, sortBy } = c.req.valid("query");
  const db = await initDb();
  const controller = new ListingController(db);
  let allListings = await controller.list();

  // Filter by location
  if (location !== "all") {
    allListings = allListings.filter((listing) =>
      listing.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  // Sort listings
  allListings.sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "expiring") {
      return new Date(a.expiredAt).getTime() - new Date(b.expiredAt).getTime();
    }
    return b.clicks - a.clicks; // popular
  });

  const total = allListings.length;
  const paginatedListings = allListings.slice(offset, offset + limit);

  return c.json({
    data: paginatedListings,
    total,
    hasMore: offset + limit < total,
  });
});

export default router;
