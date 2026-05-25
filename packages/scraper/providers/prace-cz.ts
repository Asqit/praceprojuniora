import type { NewListing } from '@ppj/types'
import { fetchWithTimeout } from '../utils/fetch'
import { randomDelay } from '../utils/random-sleep'
import * as cheerio from 'cheerio'

const DOMAIN = 'https://www.prace.cz'
const BASE_URL = `${DOMAIN}/nabidky/informatika/`
const MAX_PAGES = 50

function getNextPageUrl(html: string): string | null {
  const $ = cheerio.load(html)
  const href = ($('a[rel="next"]').first().attr('href') || '').trim()
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

  $('article[id^="advert-"]').each((_, article) => {
    const $article = $(article)

    const $linkEl = $article.find('a[data-testid="advert-link"]').first()
    const href = clean($linkEl.attr('href') || '')
    const link = href
      ? (() => {
          try {
            return new URL(href, BASE_URL).toString().split('?')[0]
          } catch {
            return href
          }
        })()
      : ''

    const title = clean($linkEl.text())
    const location = clean($article.find('span.typography-body-medium-semibold').first().text())
    const company = clean($article.find('span.typography-body-medium-regular').first().text())
    const description = undefined

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
      status: '',
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
