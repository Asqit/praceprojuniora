export type Listing = {
  id: number
  title: string
  company: string
  link: string
  status: string
  location: string
  expiresAt: string
  createdAt: string
  updatedAt?: string | null
  clicks: number
  manuallyAdded?: boolean
  source: 'manual' | string
  description?: string | null

  // Enrichment
  isDevRole?: boolean | null
  relevanceScore?: number | null
  tags?: string | null // JSON string → string[]
  salaryMin?: number | null
  salaryMax?: number | null
  workType?: 'remote' | 'hybrid' | 'onsite' | 'unknown' | null
  enrichmentStatus?: 'pending' | 'done' | 'failed' | 'skipped'
  enrichedAt?: string | null
}

export type NewListing = Omit<Listing, 'id'>

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
