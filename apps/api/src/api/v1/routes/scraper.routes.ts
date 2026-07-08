import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { rateLimiter } from 'hono-rate-limiter'
import { z } from 'zod'
import { securityToken } from '../middlewares/security'
import { jobStore } from '../../../utils/job-store'
import { ScraperService } from '../services/scraper.service'

const providersEnum = z.enum(['inwork.cz', 'jobs.cz', 'prace.cz'])
const providersArray = z.array(providersEnum)

type ProviderName = z.infer<typeof providersEnum>

const scrapeRequest = z.object({
  providers: z.union([z.literal('all'), providersArray]),
})

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
    void ScraperService.runScrape(jobId, providers)

    return c.json({ jobId }, 202)
  })
  // ---------------------------------------- JOB STATUS
  .get('/scrape/:jobId/status', async (c) => {
    const job = jobStore.get(c.req.param('jobId'))
    if (!job) return c.json({ error: 'job not found' }, 404)
    return c.json(job)
  })

export default router
