import { fetchListings } from '@ppj/scraper'
import { db } from '../../../db/connection'
import { jobs } from '../../../db/schema'
import { inArray, sql } from 'drizzle-orm'
import { getExpiresAt } from '../../../utils/listing-expiry'
import { jobStore } from '../../../utils/job-store'

type ProviderName = 'inwork.cz' | 'jobs.cz' | 'prace.cz'

export class ScraperService {
  static async runScrape(jobId: string, providers: 'all' | ProviderName[]) {
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
}
