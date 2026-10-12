import { fetchListings } from '@ppj/scraper'
import { syncProviderListings } from '../../../utils/sync-listings'
import { jobStore } from '../../../utils/job-store'

type ProviderName = 'inwork.cz' | 'jobs.cz' | 'prace.cz'

export class ScraperService {
  static async runScrape(jobId: string, providers: 'all' | ProviderName[]) {
    try {
      const result = await syncProviderListings(await fetchListings(providers))
      const status = result.incomplete.length > 0 ? 'failed' : 'done'

      jobStore.update(jobId, {
        status,
        finishedAt: new Date().toISOString(),
        result: {
          inserted: result.inserted,
          total: result.total,
          incomplete: result.incomplete,
        },
        error:
          result.incomplete.length > 0
            ? `Incomplete scrape: ${result.incomplete.join(', ')}`
            : undefined,
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
