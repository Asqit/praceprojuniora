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
  // ----------------------------------- GET RSS FEED
  .get('/rss', async (c) => {
    const rows = await db
      .select()
      .from(jobs)
      .orderBy(desc(jobs.createdAt)) // most recent first
      .limit(10)

    const esc = (s = '') =>
      String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')

    const rfc2822 = (d: string) => new Date(d).toUTCString()

    const itemsXml = rows
      .map((r) => {
        const title = esc(r.title)
        const link = esc(r.link)
        const desc = esc(r.description || `${r.company} — ${r.location || ''}`)
        const guid = esc(String(r.id))
        const pubDate = r.createdAt ? `<pubDate>${rfc2822(r.createdAt)}</pubDate>` : ''

        return `
        <item>
          <title>${title}</title>
          <link>${link}</link>
          <description>${desc}</description>
          <guid isPermaLink="false">${guid}</guid>
          ${pubDate}
        </item>`
      })
      .join('')

    const channelTitle = esc('Jobs feed')
    const channelLink = esc('https://yourdomain.example/')
    const channelDesc = esc('Latest job listings')

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>${channelTitle}</title>
      <link>${channelLink}</link>
      <description>${channelDesc}</description>
      ${itemsXml}
    </channel>
  </rss>`

    c.res.headers.set('Content-Type', 'application/rss+xml; charset=utf-8')
    if (rows.length) c.res.headers.set('Last-Modified', rfc2822(rows[0].createdAt))
    c.res.headers.set('Cache-Control', 'public, max-age=300') // adjust as needed

    return c.text(rss, 200)
  })

export default router
