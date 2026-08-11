import { enrichListing } from '@ppj/enrichment'
import { db } from '../db/connection'
import { jobs } from '../db/schema'
import { eq } from 'drizzle-orm'

function toCsvValue(value: unknown): string {
  if (value == null) return ''

  if (Array.isArray(value)) {
    return value.join('|')
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}

function escapeCsv(value: unknown): string {
  const stringValue = toCsvValue(value)

  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}

async function main() {
  const listings = await db.select().from(jobs).where(eq(jobs.enrichmentStatus, 'pending'))

  if (!listings.length) {
    throw new Error('no listings found!')
  }

  const headers = [
    'id',
    'title',
    'isDevRole',
    'relevanceScore',
    'juniorScore',
    'seniority',
    'experienceMinYears',
    'workType',
    'tags',
    'reasons',
  ]
  console.log(headers.map(escapeCsv).join(','))

  for (const job of listings) {
    const enrichment = enrichListing(job)

    const row = [
      job.id,
      job.title,
      enrichment.isDevRole,
      enrichment.relevanceScore,
      enrichment.juniorScore,
      enrichment.seniority,
      enrichment.experienceMinYears,
      enrichment.workType,
      enrichment.tags,
      enrichment.reasons,
    ]

    console.log(row.map(escapeCsv).join(','))
  }
}

if (import.meta.main) {
  await main()
}
