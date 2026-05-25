import { fetchListings } from '@ppj/scraper'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { rateLimiter } from 'hono-rate-limiter'
import { z } from 'zod'
import { getExpiresAt } from '../../../utils/listing-expiry'
import { db } from '../../../db/connection'
import { jobs } from '../../../db/schema'
import { inArray, sql } from 'drizzle-orm'
import { securityToken } from '../middlewares/security'
import { jobStore } from '../../../utils/job-store'

const providersEnum = z.enum(['inwork.cz', 'jobs.cz', 'prace.cz'])
const providersArray = z.array(providersEnum)

type ProviderName = z.infer<typeof providersEnum>

const scrapeRequest = z.object({
  providers: z.union([z.literal('all'), providersArray]),
})

async function runScrape(jobId: string, providers: 'all' | ProviderName[]): Promise<void> {
  try {
    const data = await fetchListings(providers)

    const withExpiry = data.map((listing) => ({
      ...listing,
      expiresAt: getExpiresAt(listing.status ?? ''),
    }))

    const existingTitles = await db
      .select({ title: jobs.title })
      .from(jobs)
      .where(
        inArray(
          jobs.title,
          withExpiry.map((l) => l.title)
        )
      )

    const existingTitleSet = new Set(existingTitles.map((j) => j.title))
    const toInsert = withExpiry.filter((j) => !existingTitleSet.has(j.title))

    if (toInsert.length > 0) {
      await db
        .insert(jobs)
        .values(toInsert)
        .onConflictDoUpdate({
          target: jobs.link,
          set: {
            status: sql`excluded.status`,
            expiresAt: sql`excluded."expiresAt"`,
            updatedAt: new Date().toISOString(),
          },
        })
    }

    jobStore.update(jobId, {
      status: 'done',
      finishedAt: new Date().toISOString(),
      result: { inserted: toInsert.length, total: data.length },
    })
  } catch (err) {
    jobStore.update(jobId, {
      status: 'failed',
      finishedAt: new Date().toISOString(),
      error: err instanceof Error ? err.message : String(err),
    })
  }
}

const router = new Hono()
  .use(securityToken())
  .use(
    rateLimiter({
      windowMs: 5 * 60 * 1000,
      limit: 1,
      keyGenerator: (c) => c.req.header('x-forwarded-for') ?? '',
    })
  )
  .get('/test', async (c) => {
    return c.json({ message: 'ok' }, 200)
  })
  // ---------------------------------------- START SCRAPE (fire-and-forget)
  .post('/scrape', zValidator('json', scrapeRequest), async (c) => {
    const { providers } = c.req.valid('json')
    const jobId = crypto.randomUUID()

    jobStore.create(jobId, typeof providers === 'string' ? providers : providers.join(', '))
    void runScrape(jobId, providers)

    return c.json({ jobId }, 202)
  })
  // ---------------------------------------- JOB STATUS
  .get('/scrape/:jobId/status', async (c) => {
    const job = jobStore.get(c.req.param('jobId'))
    if (!job) return c.json({ error: 'job not found' }, 404)
    return c.json(job)
  })

export default router
