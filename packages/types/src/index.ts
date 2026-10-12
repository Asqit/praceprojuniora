export type Listing = {
  id: number
  title: string
  company: string
  link: string
  status: string
  location: string
  expiresAt: string
  lastSeenAt?: string
  missingRuns?: number
  missingCheckedAt?: string | null
  isActive?: boolean
  createdAt: string
  updatedAt?: string | null
  clicks: number
  manuallyAdded?: boolean
  source: 'manual' | string
  description?: string | null

  // Community
  upvotes?: number
  downvotes?: number

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

export type ListingSource = 'inwork.cz' | 'jobs.cz' | 'prace.cz'

export type ProviderScrapeResult = {
  source: ListingSource
  listings: NewListing[]
  complete: boolean
}

export type JobStatus = 'running' | 'done' | 'failed'

export interface ScrapeJob {
  id: string
  status: JobStatus
  providers: string
  startedAt: string
  finishedAt?: string
  result?: { inserted: number; total: number; incomplete?: string[] }
  error?: string
}
