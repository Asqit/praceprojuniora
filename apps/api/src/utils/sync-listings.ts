import type { ProviderScrapeResult } from '@ppj/types'
import { and, eq, inArray, isNull, lt, or, sql } from 'drizzle-orm'
import { db } from '../db/connection'
import { jobs } from '../db/schema'
import { getCreatedAt, getExpiresAt } from './listing-expiry'

const MISSING_RUNS_TO_DEACTIVATE = 2
const UPDATE_BATCH_SIZE = 500
const UPSERT_BATCH_SIZE = 25

export async function syncProviderListings(
  results: ProviderScrapeResult[],
  runAt = new Date().toISOString()
): Promise<{ inserted: number; total: number; incomplete: string[] }> {
  const queued = syncQueue.then(() => runSync(results, runAt))
  syncQueue = queued.catch(() => undefined)
  return queued
}

let syncQueue: Promise<unknown> = Promise.resolve()

async function runSync(
  results: ProviderScrapeResult[],
  runAt: string
): Promise<{ inserted: number; total: number; incomplete: string[] }> {
  let inserted = 0
  let total = 0
  const incomplete: string[] = []
  const utcDayStart = `${runAt.slice(0, 10)}T00:00:00.000Z`

  for (const result of results) {
    total += result.listings.length
    const seenLinks = new Set(result.listings.map((listing) => listing.link))
    const listings = result.listings.map((listing) => {
      const createdAt = getCreatedAt(listing.status ?? '', listing.createdAt)
      return {
        ...listing,
        createdAt,
        expiresAt: getExpiresAt(listing.status ?? '', createdAt),
        lastSeenAt: runAt,
        missingRuns: 0,
        isActive: true,
      }
    })

    if (listings.length > 0) {
      const existingLinks = await db
        .select({ link: jobs.link })
        .from(jobs)
        .where(inArray(jobs.link, listings.map((listing) => listing.link)))
      const existingLinkSet = new Set(existingLinks.map((listing) => listing.link))
      const newListings = listings.filter((listing) => !existingLinkSet.has(listing.link))
      const existingListings = listings.filter((listing) => existingLinkSet.has(listing.link))
      inserted += newListings.length

      for (let index = 0; index < existingListings.length; index += UPSERT_BATCH_SIZE) {
        const batch = existingListings.slice(index, index + UPSERT_BATCH_SIZE)
        await Promise.all(
          batch.map((listing) =>
            db
              .update(jobs)
              .set({
                status: listing.status,
                expiresAt: sql`MIN(${jobs.expiresAt}, ${listing.expiresAt})`,
                lastSeenAt: runAt,
                missingRuns: 0,
                isActive: true,
                updatedAt: runAt,
              })
              .where(eq(jobs.link, listing.link))
          )
        )
      }

      if (newListings.length > 0) {
        await db.insert(jobs).values(newListings)
      }
    }

    if (!result.complete) {
      incomplete.push(result.source)
      continue
    }

    const existingListings = await db
      .select({ id: jobs.id, link: jobs.link, missingCheckedAt: jobs.missingCheckedAt })
      .from(jobs)
      .where(and(eq(jobs.source, result.source), eq(jobs.manuallyAdded, false)))

    const missingIds = existingListings
      .filter(
        (listing) =>
          !seenLinks.has(listing.link) &&
          (!listing.missingCheckedAt || listing.missingCheckedAt < utcDayStart)
      )
      .map((listing) => listing.id)

    for (let index = 0; index < missingIds.length; index += UPDATE_BATCH_SIZE) {
      const batch = missingIds.slice(index, index + UPDATE_BATCH_SIZE)
      await db
        .update(jobs)
        .set({
          missingRuns: sql`${jobs.missingRuns} + 1`,
          isActive: sql`CASE WHEN ${jobs.missingRuns} + 1 >= ${MISSING_RUNS_TO_DEACTIVATE} THEN 0 ELSE 1 END`,
          missingCheckedAt: runAt,
          updatedAt: runAt,
        })
        .where(
          and(
            inArray(jobs.id, batch),
            lt(jobs.lastSeenAt, runAt),
            or(isNull(jobs.missingCheckedAt), lt(jobs.missingCheckedAt, utcDayStart))
          )
        )
    }
  }

  return { inserted, total, incomplete }
}