import { db } from '../../../db/connection'
import { sql } from 'drizzle-orm'

export class HealthService {
  static async getHealthStatus() {
    let dbLatency = 0
    const uptime = process.uptime()

    try {
      const initDelta = Date.now()
      await db.run(sql`select 1`)
      dbLatency = Date.now() - initDelta
    } catch (error) {
      console.error('Database health check failed:', error)
      return {
        status: 'database-error',
        uptime,
      }
    }

    return {
      status: 'ok',
      uptime,
    }
  }
}
