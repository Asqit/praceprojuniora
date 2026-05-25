export type JobStatus = 'running' | 'done' | 'failed'

export interface ScrapeJob {
  id: string
  status: JobStatus
  providers: string
  startedAt: string
  finishedAt?: string
  result?: { inserted: number; total: number }
  error?: string
}

const store = new Map<string, ScrapeJob>()

export const jobStore = {
  create(id: string, providers: string): ScrapeJob {
    const job: ScrapeJob = {
      id,
      status: 'running',
      providers,
      startedAt: new Date().toISOString(),
    }
    store.set(id, job)
    return job
  },

  update(id: string, patch: Partial<Omit<ScrapeJob, 'id'>>): void {
    const existing = store.get(id)
    if (existing) store.set(id, { ...existing, ...patch })
  },

  get(id: string): ScrapeJob | undefined {
    return store.get(id)
  },
}
