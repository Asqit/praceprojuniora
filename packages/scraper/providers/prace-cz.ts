import type { NewListing } from '@ppj/types'
import { fetchWithTimeout } from '../utils/fetch'
import { randomDelay } from '../utils/random-sleep'
import * as cheerio from 'cheerio'

const DOMAIN = 'https://www.prace.cz'
const BASE_URL = `${DOMAIN}/nabidky/informatika/`
const MAX_PAGES = 50

function getNextPageUrl(html: string): string | null {
  const $ = cheerio.load(html)
  const nextLink = $(
    ".pager .pager__next a, .pager a[title*='Další'], .pager a:contains('>')"
  ).first()
  if (!nextLink || !nextLink.attr) return null
  const href = (nextLink.attr('href') || '').trim()
  if (!href) return null
  try {
    return new URL(href, BASE_URL).toString()
  } catch {
    return href
  }
}

function clean(s?: string) {
  return (s || '').replace(/\s+/g, ' ').trim()
}

function parseListingsFromHtml(html: string, sourceUrl: string): NewListing[] {
  const $ = cheerio.load(html)
  const out: NewListing[] = []
  let skipped = 0

  $('li.search-result__advert').each((_, li) => {
    const $li = $(li)

    const $linkEl = $li.find('h3 a.link, a[data-jd]').first()
    const href = clean($linkEl.attr('href') || '')
    const link = href
      ? (() => {
          try {
            return new URL(href, BASE_URL).toString()
          } catch {
            return href
          }
        })()
      : ''

    let id = clean($linkEl.attr('id') || $linkEl.attr('data-jd') || '')
    if (!id && link) {
      try {
        const u = new URL(link)
        const parts = u.pathname.split('/').filter(Boolean)
        id = parts[parts.length - 1] || ''
      } catch {
        id = ''
      }
    }

    const title = clean($linkEl.find('strong').first().text() || $linkEl.text())
    const company = clean(
      $li.find('.search-result__advert__box__item--company').first().text().replace('•', '')
    )
    const location = clean(
      $li.find('.search-result__advert__box__item--location strong').first().text()
    )
    const status = clean(
      $li.find('.text-label--important, .search-result__advert__supermax').first().text()
    )
    const descCandidate = clean(
      $li
        .find('.search-result__advert__box__item--description, .search-result__advert__desc, p')
        .first()
        .text()
    )
    const description = descCandidate || undefined

    if (!title || !link) {
      skipped++
      console.warn(
        `[prace.cz] Skipping listing with missing fields — title: "${title}", link: "${link}" (from ${sourceUrl})`
      )
      return
    }

    out.push({
      title,
      company,
      link,
      status,
      location,
      description,
      expiresAt: '',
      createdAt: new Date().toISOString(),
      clicks: 0,
      source: 'prace.cz',
    })
  })

  if (out.length === 0 && skipped === 0) {
    console.warn(`[prace.cz] No listings found on page — selectors may have drifted (${sourceUrl})`)
  } else {
    console.log(
      `[prace.cz] Parsed ${out.length} listing(s)${skipped > 0 ? `, skipped ${skipped} invalid` : ''} from ${sourceUrl}`
    )
  }

  return out
}

async function crawlPraceCz(): Promise<NewListing[]> {
  const results: NewListing[] = []
  const queue = new Set<string>([BASE_URL])
  const visited = new Set<string>()
  let pageCount = 0

  while (queue.size > 0) {
    const url = queue.values().next().value
    if (!url) continue
    queue.delete(url)

    if (visited.has(url)) continue

    if (pageCount >= MAX_PAGES) {
      console.warn(`[prace.cz] Reached page limit (${MAX_PAGES}), stopping crawl early`)
      break
    }

    try {
      console.log(`[prace.cz] Fetching page ${pageCount + 1}: ${url}`)
      await randomDelay(1_000, 5_000)
      const res = await fetchWithTimeout(url)

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`)
      }

      const html = await res.text()
      const nextUrl = getNextPageUrl(html)
      const jobs = parseListingsFromHtml(html, url)

      let added = 0
      for (const job of jobs) {
        const isDuplicate = results.some(
          (j) => j.link === job.link || j.title.toLowerCase() === job.title.toLowerCase()
        )
        if (!isDuplicate) {
          results.push(job)
          added++
        }
      }

      if (jobs.length > added) {
        console.log(`[prace.cz] Skipped ${jobs.length - added} duplicate(s) on this page`)
      }

      if (nextUrl) {
        queue.add(nextUrl)
      }

      visited.add(url)
      pageCount++
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const isTimeout = error instanceof Error && error.name === 'AbortError'
      console.error(
        `[prace.cz] ❌ Failed to fetch ${url}: ${isTimeout ? 'request timed out' : message}`
      )
      visited.add(url) // prevent retrying the same failed URL
    }
  }

  console.log(
    `[prace.cz] Crawl complete — ${results.length} total listing(s) across ${pageCount} page(s)`
  )
  return results
}

export function pracecz(): Promise<NewListing[]> {
  return crawlPraceCz()
}
