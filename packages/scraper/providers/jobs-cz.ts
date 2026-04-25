import * as cheerio from 'cheerio'
import { randomDelay } from '../utils/random-sleep'
import { USER_AGENT } from '../utils/ua'
import type { NewListing } from '@ppj/types'

const DOMAIN = 'https://www.jobs.cz'
const BASE_URL = `${DOMAIN}/prace/is-it-vyvoj-aplikaci-a-systemu/`

function parseJobCards(html: string): NewListing[] {
  const $ = cheerio.load(html)
  const cards = $('article.SearchResultCard')
  const jobs: NewListing[] = []

  cards.each((_, el) => {
    const title = $(el).find('.SearchResultCard__titleLink').text().trim()
    const link = $(el).find('.SearchResultCard__titleLink').attr('href') ?? ''
    const status = $(el).find('.SearchResultCard__status').text().trim()
    const company = $(el).find('.SearchResultCard__footerItem').first().text().trim()
    const location = $(el).find('li[data-test="serp-locality"]').text().trim()

    if (!title || !link) return

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

  return jobs
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

async function crawlJobsCZ(): Promise<NewListing[]> {
  const queue = new Set<string>([BASE_URL])
  const visited = new Set<string>()
  const results: NewListing[] = []

  while (queue.size > 0) {
    const url = queue.values().next().value
    if (!url) continue
    queue.delete(url)

    if (!url || visited.has(url)) continue

    try {
      await randomDelay(1000, 5000)
      console.log(`crawling: ${url}`)
      const res = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT },
      })
      const html = await res.text()
      const MAX_PAGES = 100
      const newPages = getPaginationUrls(html).slice(0, MAX_PAGES)
      newPages.forEach((p) => queue.add(p))

      const MAX_JOBS = 300
      const jobs = parseJobCards(html).slice(0, MAX_JOBS)
      for (const job of jobs) {
        const isDuplicate = results.some(
          (j) => j.link === job.link || j.title.toLowerCase() === job.title.toLowerCase()
        )
        if (!isDuplicate) results.push(job)
      }

      visited.add(url)
    } catch (err) {
      console.error(`❌ Failed to fetch ${url}:`, err)
    }
  }

  return results
}

export function jobscz(): Promise<NewListing[]> {
  return crawlJobsCZ()
}
