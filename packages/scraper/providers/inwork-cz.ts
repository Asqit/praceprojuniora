import type { NewListing } from '@ppj/types'
import { Readable } from 'stream'
import { fetchWithTimeout } from '../utils/fetch'
import { withBoundedConcurrency } from '../utils/concurrency'
import { isItRelevant } from '../utils/relevance-scoring'
import sax from 'sax'
import * as cheerio from 'cheerio'

function parseSalary(text: string): { salaryMin: number | null; salaryMax: number | null } {
  // Matches patterns like "45 000 – 65 000 Kč" or "od 50 000 Kč" or "50000-65000"
  const normalized = text.replace(/\s/g, '')
  const parts = normalized.split(/–|-|až/)
  const nums = parts
    .map((p) => parseInt(p.replace(/\D/g, ''), 10))
    .filter((n) => !isNaN(n) && n >= 1_000 && n <= 500_000)
  if (nums.length === 0) return { salaryMin: null, salaryMax: null }
  return { salaryMin: nums[0] ?? null, salaryMax: nums[1] ?? nums[0] ?? null }
}

// Scrapes a single inwork.cz job detail page.
// Expected DOM: table rows with <td><strong>Label:</strong></td><td>Value</td> pairs,
// job description in <article class="entry-content">, date in <div class="info-inzerat">.
export async function scrapeInworkDetail(url: string): Promise<NewListing | null> {
  const res = await fetchWithTimeout(url)
  if (!res.ok) return null

  const html = await res.text()
  const $ = cheerio.load(html)

  const title = $('h1.detail-hero__wrapper--title').text().trim()
  const company = $('strong:contains("Firma:")').closest('td').next().text().trim()
  const location = $('strong:contains("Pracoviště:")').closest('td').next('td').text().trim()
  const salaryText = $('strong:contains("Mzda:")').closest('td').next('td').text().trim()
  const description = $('article.entry-content').text().trim()

  const vlozenoText = $('.info-inzerat').text()
  const vlozenoMatch = vlozenoText.match(/Vloženo:\s*(\d{2}\.\d{2}\.\d{4})/)
  const createdAt = vlozenoMatch
    ? new Date(vlozenoMatch[1]!.split('.').reverse().join('-')).toISOString()
    : new Date().toISOString()

  const { salaryMin, salaryMax } = parseSalary(salaryText)

  return {
    title,
    company,
    link: url,
    location,
    description,
    salaryMin,
    salaryMax,
    createdAt,
    expiresAt: '',
    status: 'active',
    clicks: 0,
    source: 'inwork.cz',
    enrichmentStatus: 'pending',
    isDevRole: null,
    relevanceScore: null,
    tags: null,
    workType: null,
  }
}

const sitemaps = [
  'https://www.inwork.cz/static/sitemap/sitemap_iw_cz/inzeraty_detail-0.xml',
  'https://www.inwork.cz/static/sitemap/sitemap_iw_cz/inzeraty_detail-1.xml',
]

async function parseSitemap(sitemap: string): Promise<string[]> {
  console.log(`[inwork.cz] Fetching sitemap: ${sitemap}`)
  try {
    const response = await fetchWithTimeout(sitemap)

    if (!response.ok) {
      console.error(
        `[inwork.cz] ❌ Sitemap fetch failed — HTTP ${response.status} ${response.statusText}: ${sitemap}`
      )
      return []
    }
    if (!response.body) {
      console.error(`[inwork.cz] ❌ Sitemap response has no body: ${sitemap}`)
      return []
    }

    const urls: string[] = []
    let totalLocs = 0
    const parser = sax.createStream(true)
    let currentLoc = ''

    parser.on('opentag', (node) => {
      if (node.name === 'loc') currentLoc = ''
    })

    parser.on('text', (text) => {
      currentLoc += text
    })

    parser.on('closetag', (name) => {
      if (name !== 'loc') return
      totalLocs++
      if (isItRelevant(currentLoc)) {
        urls.push(currentLoc)
      }
    })

    await new Promise((resolve, reject) => {
      parser.on('end', resolve)
      parser.on('error', reject)
      Readable.fromWeb(response.body!).pipe(parser)
    })

    console.log(
      `[inwork.cz] Sitemap parsed — ${urls.length} relevant URL(s) out of ${totalLocs} total: ${sitemap}`
    )
    return urls
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const isTimeout = err instanceof Error && err.name === 'AbortError'
    console.error(
      `[inwork.cz] ❌ Failed to parse sitemap ${sitemap}: ${isTimeout ? 'request timed out' : message}`
    )
    return []
  }
}

const CONCURRENCY = 3
const RATE_LIMIT_MS = 1_000

export async function inworkcz(): Promise<NewListing[]> {
  const urlArrays = await Promise.all(sitemaps.map(parseSitemap))
  const urls = urlArrays.flat()
  console.log(
    `[inwork.cz] ${urls.length} URL(s) queued for scraping across ${sitemaps.length} sitemap(s)`
  )

  const tasks = urls.map((url) => async () => {
    try {
      const listing = await scrapeInworkDetail(url)
      if (!listing) {
        console.warn(`[inwork.cz] ⚠️ No listing returned for ${url} (HTTP error or empty page)`)
      }
      await new Promise((r) => setTimeout(r, RATE_LIMIT_MS))
      return listing
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      const isTimeout = err instanceof Error && err.name === 'AbortError'
      console.error(
        `[inwork.cz] ❌ Failed to fetch ${url}: ${isTimeout ? 'request timed out' : message}`
      )
      return null
    }
  })

  const results = await withBoundedConcurrency(tasks, CONCURRENCY)
  const listings = results.filter((r): r is NewListing => r !== null)
  console.log(
    `[inwork.cz] Scrape complete — ${listings.length} listing(s) from ${urls.length} URL(s)`
  )
  return listings
}
