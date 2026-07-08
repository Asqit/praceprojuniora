import { jobs } from '../../../db/schema'
import { count, gte } from 'drizzle-orm'
import { db } from '../../../db/connection'

export class StatsService {
  static async fetchStats() {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    return await Promise.all([
      db.select({ count: count() }).from(jobs),
      db.select({ count: count() }).from(jobs).where(gte(jobs.createdAt, todayStart.toISOString())),
      db.select({ source: jobs.source, count: count() }).from(jobs).groupBy(jobs.source),
    ])
  }
}
