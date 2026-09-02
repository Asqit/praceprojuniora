import type { ScrapeJob } from '@ppj/types'
import { BunCache } from 'bun-cache'

const cache = new BunCache()
const JOB_TTL_MS = 30 * 60 * 1000

export const jobStore = {
  create(id: string, providers: string): ScrapeJob {
    const job: ScrapeJob = {
      id,
      status: 'running',
      providers,
      startedAt: new Date().toISOString(),
    }
    cache.put(id, job, JOB_TTL_MS)
    return job
  },

  update(id: string, patch: Partial<Omit<ScrapeJob, 'id'>>): void {
    const existing: ScrapeJob | null = cache.get(id)
    if (existing) cache.put(id, { ...existing, ...patch }, JOB_TTL_MS)
  },

  get(id: string): ScrapeJob | undefined {
    const existing = cache.get(id)
    if (existing === null || existing === true) {
      return undefined
    }

    return existing as ScrapeJob
  },
}
