import type { HTypes } from './types'
import { Hono } from 'hono'
import { applicationOnListen } from './utils/misc'
import { v1 } from './api/v1/router'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { trafficLogger } from './middleware/traffic-logger'
import { errorHandler } from './middleware/error-handler'
import { validateEnvironment } from './utils/env'
import { listingTasks } from './utils/tasks'
import cron from 'node-cron'
import { db } from './db/connection'
import { jobs } from './db/schema'
import { count } from 'drizzle-orm'

export class Application {
  private app!: Hono<HTypes>
  private server!: ReturnType<typeof Bun.serve>
  private env!: Exclude<Awaited<ReturnType<typeof validateEnvironment>>, undefined>

  public async init(): Promise<void> {
    this.app = new Hono<HTypes>()
    const environment = await validateEnvironment(true)
    if (!environment) {
      console.error('failed to parse environmental variables!')
      process.exit(1)
    }

    this.env = environment
    await this.initCron()
    this.initMiddleware()
    this.initRoutes()
  }

  private initMiddleware(): void {
    const { app } = this
    app.use(compress())
    app.use(secureHeaders())
    app.use(cors())
    app.use(trafficLogger())
    app.onError(errorHandler())
  }

  private initRoutes(): void {
    const { app } = this
    app.route('/api/v1', v1)
  }

  private async initCron(): Promise<void> {
    const { env } = this

    if (env.NODE_ENV === 'PRODUCTION') {
      // fetch only when no data!
      const [{ count: rowCount }] = await db.select({ count: count() }).from(jobs)
      if (rowCount === 0) await listingTasks.fetchNew()
    }

    // every day 6AM
    cron.schedule('0 6 * * *', async () => {
      await listingTasks.fetchNew()
      // TODO: Implement!
      //await listingTasks.enrichPending();
    })

    // every hour
    cron.schedule('0 * * * *', async () => {
      await listingTasks.deleteExpired()
    })
  }

  public listen(): void {
    const { app, env } = this
    this.server = Bun.serve({
      port: env.PORT,
      fetch: app.fetch,
    })
    applicationOnListen(env.PORT)
  }

  public async close(): Promise<void> {
    const { server } = this
    try {
      server.stop(true)
      console.info(`Closing the application, bye!`)
      process.exit(0)
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  }
}
