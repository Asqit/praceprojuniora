import type { NewListing, ProviderScrapeResult } from '@ppj/types'
import { fetchWithTimeout } from '../utils/fetch'
import { randomDelay } from '../utils/random-sleep'
import * as cheerio from 'cheerio'

const DOMAIN = 'https://www.jobs.cz'
const BASE_URL = `${DOMAIN}/prace/is-it-vyvoj-aplikaci-a-systemu/`
const MAX_PAGES = 100
const MAX_JOBS = 300

function parseJobCards(html: string, sourceUrl: string): { listings: NewListing[]; complete: boolean } {
  const $ = cheerio.load(html)
  const cards = $('article.SearchResultCard')
  const jobs: NewListing[] = []
  let skipped = 0

  cards.each((_, el) => {
    const title = $(el).find('.SearchResultCard__titleLink').text().trim()
    const link = $(el).find('.SearchResultCard__titleLink').attr('href') ?? ''
    const status = $(el).find('.SearchResultCard__status').text().trim()
    const company = $(el).find('.SearchResultCard__footerItem').first().text().trim()
    const location = $(el).find('li[data-test="serp-locality"]').text().trim()

    if (!title || !link) {
      skipped++
      console.warn(
        `[jobs.cz] Skipping listing with missing fields — title: "${title}", link: "${link}" (from ${sourceUrl})`
      )
      return
    }

    const rawLink = link.startsWith('http') ? link : `${DOMAIN}${link}`
    const cleanLink = rawLink.split('?')[0] ?? rawLink

    jobs.push({
      title,
      status,
      location,
      company,
      link: cleanLink,
      createdAt: new Date().toISOString(),
      clicks: 0,
      source: 'jobs.cz',
      expiresAt: '',
    })
  })

  if (jobs.length === 0 && skipped === 0) {
    console.warn(`[jobs.cz] No listings found on page — selectors may have drifted (${sourceUrl})`)
  } else {
    console.log(
      `[jobs.cz] Parsed ${jobs.length} listing(s)${skipped > 0 ? `, skipped ${skipped} invalid` : ''} from ${sourceUrl}`
    )
  }

  return { listings: jobs, complete: cards.length > 0 && skipped === 0 }
}

function getPaginationUrls(html: string): string[] {
  const $ = cheerio.load(html)
  const urls: string[] = []

  $('.Pagination__link').each((_, el) => {
    const href = $(el).attr('href')
    const isNextBtn = $(el).hasClass('Pagination__button--next')

    if (!isNextBtn && href) {
      urls.push(href.startsWith('http') ? href : `${DOMAIN}${href}`)
    }
  })

  return urls
}

async function crawlJobsCZ(): Promise<ProviderScrapeResult> {
  const queue = new Set<string>([BASE_URL])
  const visited = new Set<string>()
  const results: NewListing[] = []
  let pageCount = 0
  let complete = true

  while (queue.size > 0) {
    const url = queue.values().next().value
    if (!url) continue
    queue.delete(url)

    if (visited.has(url)) continue

    if (pageCount >= MAX_PAGES) {
      console.warn(`[jobs.cz] Reached page limit (${MAX_PAGES}), stopping crawl early`)
      complete = false
      break
    }

    try {
      console.log(`[jobs.cz] Fetching page ${pageCount + 1}: ${url}`)
      await randomDelay(1_000, 5_000)
      const res = await fetchWithTimeout(url)

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`)
      }

      const html = await res.text()

      const paginationUrls = getPaginationUrls(html)
      if (paginationUrls.length > MAX_PAGES) complete = false
      const newPages = paginationUrls.slice(0, MAX_PAGES)
      newPages.forEach((p) => queue.add(p))

      const parsed = parseJobCards(html, url)
      if (!parsed.complete || parsed.listings.length > MAX_JOBS) complete = false
      const jobs = parsed.listings.slice(0, MAX_JOBS)
      let added = 0
      for (const job of jobs) {
        const isDuplicate = results.some((existing) => existing.link === job.link)
        if (!isDuplicate) {
          results.push(job)
          added++
        }
      }

      if (jobs.length > added) {
        console.log(`[jobs.cz] Skipped ${jobs.length - added} duplicate(s) on this page`)
      }

      visited.add(url)
      pageCount++
    } catch (err) {
      complete = false
      const message = err instanceof Error ? err.message : String(err)
      const isTimeout = err instanceof Error && err.name === 'AbortError'
      console.error(
        `[jobs.cz] ❌ Failed to fetch ${url}: ${isTimeout ? 'request timed out' : message}`
      )
      visited.add(url) // prevent retrying the same failed URL
    }
  }

  console.log(
    `[jobs.cz] Crawl complete — ${results.length} total listing(s) across ${pageCount} page(s)`
  )
  return { source: 'jobs.cz', listings: results, complete }
}

export function jobscz(): Promise<ProviderScrapeResult> {
  return crawlJobsCZ()
}
