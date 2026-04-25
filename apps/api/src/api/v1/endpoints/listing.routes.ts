import { Hono } from 'hono'
import { db } from '../../../db/connection'
import { jobs } from '../../../db/schema'
import { zValidator } from '@hono/zod-validator'
import { bulkJson, clickCounterParam, getAllQuery } from '../validators/listing.validators'
import { withPagination } from '../../../db/helpers'
import { match } from 'ts-pattern'
import { and, count, desc, inArray, like, or, eq, sql } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import { rateLimiter } from 'hono-rate-limiter'

const router = new Hono()
  .use(
    rateLimiter({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      keyGenerator: (c) => c.req.header('x-forwarded-for') ?? '',
    })
  )
  // ----------------------------------- GET ALL LISTINGS
  .get('/', zValidator('query', getAllQuery), async (c) => {
    const { page, limit, sortBy, search, location } = c.req.valid('query')

    const filters = and(
      location ? like(jobs.location, `%${location}%`) : undefined,
      search
        ? or(
            like(jobs.title, `%${search}%`),
            like(jobs.location, `%${search}%`),
            like(jobs.company, `%${search}%`),
            like(jobs.description, `%${search}%`)
          )
        : undefined
    )

    const sortCol = match(sortBy)
      .with('newest', () => desc(jobs.createdAt))
      .with('expiration', () => desc(jobs.expiresAt))
      .with('popularity', () => desc(jobs.clicks))
      .with(undefined, () => desc(jobs.createdAt))
      .exhaustive()

    const [rows, [{ count: totalRows }]] = await Promise.all([
      withPagination(
        db.select().from(jobs).where(filters).orderBy(sortCol).$dynamic(),
        page,
        limit
      ),
      db.select({ count: count() }).from(jobs).where(filters),
    ])

    return c.json({
      data: rows,
      totalRows,
      page,
      totalPages: Math.ceil(totalRows / limit),
    })
  })
  // ----------------------------------- BULK
  .post('/bulk', zValidator('json', bulkJson), async (c) => {
    const { ids } = c.req.valid('json')
    const rows = await db.select().from(jobs).where(inArray(jobs.id, ids))
    return c.json({
      data: rows,
    })
  })
  // ----------------------------------- CLICK
  .post('/click-counter/:id', zValidator('param', clickCounterParam), async (c) => {
    const { id } = c.req.valid('param')
    const [updated] = await db
      .update(jobs)
      .set({ clicks: sql`${jobs.clicks} + 1` })
      .where(eq(jobs.id, id))
      .returning()

    if (!updated) {
      throw new HTTPException(404, { message: 'not found!' })
    }

    return c.json(updated)
  })
export default router
