import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import { initDb } from "../../../lib/db/index.ts";

const router = new Hono();

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  email?: string;
  timestamp: number;
}

// ------------------------------------------------------------------------------ Get entries
const getSchema = z.object({
  limit: z.string().optional().transform(val => Math.min(parseInt(val || "10"), 50)),
  offset: z.string().optional().transform(val => parseInt(val || "0")),
});

router.get("/", zValidator("query", getSchema), async (c) => {
  const { limit, offset } = c.req.valid("query");
  const db = await initDb();

  const entries = [];
  const iter: Deno.KvListIterator<GuestbookEntry> = db.list({
    prefix: ["guestbook"],
  });

  for await (const entry of iter) {
    entries.push(entry.value);
  }

  entries.sort((a, b) => b.timestamp - a.timestamp);
  const total = entries.length;
  const paginatedEntries = entries.slice(offset, offset + Math.min(limit, 50));

  return c.json({
    entries: paginatedEntries,
    total,
    hasMore: offset + limit < total,
  });
});

// ------------------------------------------------------------------------------ Create entry
const createSchema = z.object({
  name: z.string().min(1).max(50),
  message: z.string().min(1).max(500),
});

router.post("/", zValidator("json", createSchema), async (c) => {
  const { name, message } = c.req.valid("json");
  const db = await initDb();

  const entry: GuestbookEntry = {
    id: crypto.randomUUID(),
    name: name.trim(),
    message: message.trim(),
    timestamp: Date.now(),
  };

  await db.set(["guestbook", entry.id], entry);

  c.status(201);
  return c.json({ success: true, entry });
});

export default router;
