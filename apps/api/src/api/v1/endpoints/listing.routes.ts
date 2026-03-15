import { Hono } from "hono";
import { db } from "../../../db/connection";
import { jobs } from "../../../db/schema";
import { zValidator } from "@hono/zod-validator";
import { bulkJson, getAllQuery } from "../validators/listing.validators";
import { withCursorPagination } from "../../../db/helpers";
import { match } from "ts-pattern";
import { inArray } from "drizzle-orm";

const router = new Hono()
  // ----------------------------------- GET ALL LISTINGS
  .get("/", zValidator("query", getAllQuery), async (c) => {
    const { cursor, limit, sortBy } = c.req.valid("query");

    const query = db
      .select()
      .from(jobs)
      .orderBy(
        match(sortBy)
          .with("newest", () => jobs.expiresAt)
          .with("expiration", () => jobs.expiresAt)
          .with("popularity", () => jobs.clicks)
          .with(undefined, () => jobs.createdAt)
          .exhaustive(),
      );
    const rows = await withCursorPagination(query.$dynamic(), cursor, limit);
    const hasNextPage = rows.length > limit;
    const data = hasNextPage ? rows.slice(0, -1) : rows;

    return c.json({
      data,
      nextCursor: hasNextPage ? data.at(-1)?.id : null,
    });
  })
  // ----------------------------------- BULK
  .post("/bulk", zValidator("json", bulkJson), async (c) => {
    const { ids } = c.req.valid("json");
    const rows = await db.select().from(jobs).where(inArray(jobs.id, ids));
    return c.json({
      data: rows,
    });
  });
export default router;
