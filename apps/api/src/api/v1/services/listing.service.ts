import { db } from '../../../db/connection'
import { jobs } from '../../../db/schema'
import { match } from 'ts-pattern'
import { and, desc, inArray, like, or, eq, sql } from 'drizzle-orm'
import type { Job } from '../../../db/schema'

export type ListingSortBy = 'newest' | 'expiration' | 'popularity' | undefined

type GetAllParams = {
  page: number
  limit: number
  sortBy?: ListingSortBy
  search?: string
  location?: string
}

function normalize(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9+#]+/g, ' ')
    .trim()
}

function collapseDuplicates(rows: Job[]): Job[] {
  const groups = new Map<string, Job>()

  for (const row of rows) {
    const company = normalize(row.company)
    const title = normalize(row.title)
    const key = company && title ? `${company}|${title}` : `row:${row.id}`
    const existing = groups.get(key)

    if (!existing) {
      groups.set(key, row)
      continue
    }

    const locations = new Set(
      [existing.location, row.location]
        .flatMap((location) => location.split(' · '))
        .map((location) => location.trim())
        .filter(Boolean)
    )
    groups.set(key, { ...existing, location: Array.from(locations).join(' · ') })
  }

  return Array.from(groups.values())
}

export class ListingService {
  static async getAll(params: GetAllParams) {
    const { page, limit, sortBy, search, location } = params

    const filters = and(
      eq(jobs.isActive, true),
      location ? like(jobs.location, `%${location}%`) : undefined,
      search
        ? or(
            like(jobs.title, `%${search}%`),
            like(jobs.location, `%${search}%`),
            like(jobs.company, `%${search}%`),
            like(jobs.description, `%${search}%`)
          )
        : undefined
    )

    const sortCol = match(sortBy)
      .with('newest', () => desc(jobs.createdAt))
      .with('expiration', () => desc(jobs.expiresAt))
      .with('popularity', () => desc(jobs.clicks))
      .with(undefined, () => desc(jobs.relevanceScore))
      .exhaustive()

    const matchingRows = await db.select().from(jobs).where(filters).orderBy(sortCol)
    const uniqueRows = collapseDuplicates(matchingRows)
    const totalRows = uniqueRows.length
    const rows = uniqueRows.slice((page - 1) * limit, page * limit)

    return {
      data: rows,
      totalRows,
      page,
      totalPages: Math.ceil(totalRows / limit),
    }
  }

  static async bulkGet(ids: number[]) {
    return db
      .select()
      .from(jobs)
      .where(and(inArray(jobs.id, ids), eq(jobs.isActive, true)))
  }

  static async incrementClick(id: number) {
    const [updated] = await db
      .update(jobs)
      .set({ clicks: sql`${jobs.clicks} + 1` })
      .where(and(eq(jobs.id, id), eq(jobs.isActive, true)))
      .returning()

    return updated ?? null
  }

  static async vote(id: number, direction: 'up' | 'down') {
    // Weight scales with existing vote count: each additional vote carries slightly more
    const [updated] = await db
      .update(jobs)
      .set(
        direction === 'up'
          ? {
              upvotes: sql`${jobs.upvotes} + 1`,
              relevanceScore: sql`COALESCE(${jobs.relevanceScore}, 50) + 2.0 * (1 + ${jobs.upvotes} * 0.05)`,
            }
          : {
              downvotes: sql`${jobs.downvotes} + 1`,
              relevanceScore: sql`COALESCE(${jobs.relevanceScore}, 50) - 3.0 * (1 + ${jobs.downvotes} * 0.05)`,
            }
      )
      .where(and(eq(jobs.id, id), eq(jobs.isActive, true)))
      .returning()

    return updated ?? null
  }

  static async fetchLatestRssItems() {
    const rows = await db
      .select()
      .from(jobs)
      .where(eq(jobs.isActive, true))
      .orderBy(desc(jobs.createdAt))
    return collapseDuplicates(rows).slice(0, 10)
  }

  static buildRssXml(rows: Array<Record<string, any>>) {
    const esc = (s = '') =>
      String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')

    const rfc2822 = (d: string) => new Date(d).toUTCString()

    const itemsXml = rows
      .map((r) => {
        const title = esc(r.title)
        const link = esc(r.link)
        const desc = esc(r.description || `${r.company} — ${r.location || ''}`)
        const guid = esc(String(r.id))
        const pubDate = r.createdAt ? `<pubDate>${rfc2822(r.createdAt)}</pubDate>` : ''

        return `
        <item>
          <title>${title}</title>
          <link>${link}</link>
          <description>${desc}</description>
          <guid isPermaLink="false">${guid}</guid>
          ${pubDate}
        </item>`
      })
      .join('')

    const channelTitle = esc('Jobs feed')
    const channelLink = esc('https://yourdomain.example/')
    const channelDesc = esc('Latest job listings')

    return `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>${channelTitle}</title>
      <link>${channelLink}</link>
      <description>${channelDesc}</description>
      ${itemsXml}
    </channel>
  </rss>`
  }

  static getRssLastModified(rows: Array<Record<string, any>>) {
    const rfc2822 = (d: string) => new Date(d).toUTCString()
    return rows.length ? rfc2822(rows[0].createdAt) : undefined
  }
}
