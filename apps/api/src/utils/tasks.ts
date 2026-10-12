import { fetchListings } from '@ppj/scraper'
import { enrichListing } from '@ppj/enrichment'
import { db } from '../db/connection'
import { jobs } from '../db/schema'
import { eq, lte, sql, desc, inArray, and, lt, isNotNull, or } from 'drizzle-orm'
import { syncProviderListings } from './sync-listings'

async function fetchNew(): Promise<void> {
  console.log('Fetching new listings...')
  const lastJob = await db
    .select({ lastSeenAt: jobs.lastSeenAt })
    .from(jobs)
    .orderBy(desc(jobs.lastSeenAt))
    .limit(1)
  const lastScrape = lastJob[0]?.lastSeenAt
  if (lastScrape && Date.now() - new Date(lastScrape).getTime() < 1000 * 60 * 60) {
    console.log('Data fresh, skipping scrape')
    return
  }

  const result = await syncProviderListings(await fetchListings())
  console.log(
    `Upserted ${result.inserted}/${result.total} listings; incomplete providers: ${result.incomplete.join(', ') || 'none'}`
  )
}

async function enrichPending(): Promise<void> {
  console.log('Enriching pending listings...')

  const BATCH_SIZE = 50
  let totalEnriched = 0

  while (true) {
    const batch = await db
      .select()
      .from(jobs)
      .where(eq(jobs.enrichmentStatus, 'pending'))
      .limit(BATCH_SIZE)

    if (batch.length === 0) break

    console.log(`Processing batch of ${batch.length}`)

    for (const job of batch) {
      try {
        const enrichment = enrichListing(job)

        await db
          .update(jobs)
          .set({
            relevanceScore: enrichment.relevanceScore,
            workType: enrichment.workType,
            tags: JSON.stringify(enrichment.tags),
            enrichmentStatus: 'done',
            enrichedAt: new Date().toISOString(),
          })
          .where(eq(jobs.id, job.id))
      } catch {
        await db.update(jobs).set({ enrichmentStatus: 'failed' }).where(eq(jobs.id, job.id))
      }
    }

    totalEnriched += batch.length
  }

  console.log(`Enriched ${totalEnriched} listings`)
}

async function pruneIrrelevant(): Promise<void> {
  console.log('Pruning irrelevant listings...')

  const cutoff = new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString()

  const result = await db
    .delete(jobs)
    .where(
      and(
        or(
          and(isNotNull(jobs.relevanceScore), lt(jobs.relevanceScore, 35)),
          eq(jobs.enrichmentStatus, 'failed')
        ),
        lte(jobs.createdAt, cutoff),
        eq(jobs.manuallyAdded, false)
      )
    )

  console.log(`Pruned ${result.rowsAffected} irrelevant listings`)
}

export const listingTasks = {
  fetchNew,
  enrichPending,
  pruneIrrelevant,
}
