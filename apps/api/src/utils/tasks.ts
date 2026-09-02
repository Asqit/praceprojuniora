import { fetchListings } from '@ppj/scraper'
import { enrichListing } from '@ppj/enrichment'
import { db } from '../db/connection'
import { jobs } from '../db/schema'
import { eq, lte, sql, desc, inArray, and, lt, isNotNull, or } from 'drizzle-orm'
import { getExpiresAt } from './listing-expiry'

async function fetchNew(): Promise<void> {
  console.log('Fetching new listings...')
  const lastJob = await db.select().from(jobs).orderBy(desc(jobs.createdAt)).limit(1)
  const lastScrape = lastJob[0]?.createdAt
  if (lastScrape && Date.now() - new Date(lastScrape).getTime() < 1000 * 60 * 60) {
    console.log('Data fresh, skipping scrape')
    return
  }

  const listings = await fetchListings()
  const withExpiry = listings.map((listing) => ({
    ...listing,
    expiresAt: getExpiresAt(listing.status ?? ''),
  }))

  await db
    .insert(jobs)
    .values(withExpiry)
    .onConflictDoUpdate({
      target: jobs.link,
      set: {
        status: sql`excluded.status`,
        expiresAt: sql`excluded."expiresAt"`,
        updatedAt: new Date().toISOString(),
      },
    })

  console.log(`Upserted ${withExpiry.length}/${listings.length} listings`)
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

async function deleteExpired(): Promise<void> {
  console.log('Deleting expired listings...')

  const result = await db.delete(jobs).where(lte(jobs.expiresAt, new Date().toISOString()))

  console.log(`Deleted ${result.rowsAffected} expired listings`)
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
  deleteExpired,
  pruneIrrelevant,
}
