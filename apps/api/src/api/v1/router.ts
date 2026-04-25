import listingRoutes from './endpoints/listing.routes'
import { Hono } from 'hono'
import { db } from '../../db/connection'
import { jobs } from '../../db/schema'
import { count, gte, sql } from 'drizzle-orm'

export const v1 = new Hono()
  .route('/listing', listingRoutes)

  .get('/stats', async (c) => {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const [totalResult, todayResult, sourcesResult] = await Promise.all([
      db.select({ count: count() }).from(jobs),
      db.select({ count: count() }).from(jobs).where(gte(jobs.createdAt, todayStart.toISOString())),
      db.select({ source: jobs.source, count: count() }).from(jobs).groupBy(jobs.source),
    ])

    return c.json({
      total: totalResult[0].count,
      addedToday: todayResult[0].count,
      sources: sourcesResult.map((r) => ({ name: r.source, count: r.count })),
    })
  })

  .get('/health', async (c) => {
    let dbLatency = 0
    const uptime = process.uptime()

    try {
      const initDelta = Date.now()
      await db.run(sql`select 1`)
      dbLatency = Date.now() - initDelta
    } catch (error) {
      console.error('Database health check failed:', error)
      return c.json(
        {
          status: 'database-error',
          uptime,
        },
        503
      )
    }

    return c.json({
      status: 'ok',
      uptime,
    })
  })

export type AppType = typeof v1
