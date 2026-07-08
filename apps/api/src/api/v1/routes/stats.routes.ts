import { Hono } from 'hono'
import { StatsService } from '../services/stats.service'

const router = new Hono().get('/', async (c) => {
  const [totalResult, todayResult, sourcesResult] = await StatsService.fetchStats()

  return c.json({
    total: totalResult[0].count,
    addedToday: todayResult[0].count,
    sources: sourcesResult.map((r) => ({ name: r.source, count: r.count })),
  })
})

export default router
