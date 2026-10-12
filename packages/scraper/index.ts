import { inworkcz } from './providers/inwork-cz'
import { jobscz } from './providers/jobs-cz'
import { pracecz } from './providers/prace-cz'
import type { ListingSource, ProviderScrapeResult } from '@ppj/types'

const PROVIDERS = {
  'inwork.cz': inworkcz,
  'jobs.cz': jobscz,
  'prace.cz': pracecz,
} as const

type ProviderName = keyof typeof PROVIDERS

const KEYWORDS = [
  // EN
  'junior',
  'entry',
  'entry-level',
  'graduate',
  'graduate program',
  'graduate programme',
  'fresher',
  'trainee',
  'intern',
  'internship',
  'apprentice',
  'associate',
  'campus',
  'early career',
  'career start',
  'no experience',
  'without experience',

  // CZ/SK
  'juniorní',
  'začátečník',
  'absolvent',
  'absolventy',
  'pro absolventy',
  'vhodné pro absolventy',
  'bez praxe',
  'bez zkušeností',
  'i bez praxe',
  'vhodné i pro juniory',
  'kariérní start',
  'start kariéry',
  'junior pozice',
  'juniorní pozice',
  'praxe při škole',
  'student',
  'studenty',
  'part-time junior',
  'nástup možný ihned',
  'zaučíme',
  'zaškolení',
  'mentor',
  'mentoring',
  'adaptace',

  // časté hiring formulace
  '0-2 roky zkušeností',
  '0–2 years',
  '1 rok zkušeností',
  '1+ year',
  '1-2 years',
]

const EXCLUSION_KEYWORDS = [
  // seniorita
  'senior',
  'medior',
  'staff engineer',
  'principal',
  'expert',
  'specialist',
  'specialista',
  'architect',
  'solution architect',
  'tech lead',
  'team lead',
  'lead developer',
  'lead engineer',

  // management
  'manager',
  'head of',
  'director',
  'vp',
  'cto',
  'vedoucí',
  'manažer',
  'ředitel',

  // zkušenost
  '5+ let',
  '5 years',
  '7+ years',
  'commercial experience',
  'pokročilý',
  'zkušený',
  'highly experienced',
  'expert level',

  // hiring bullshit
  'seniority: senior',
  'strong experience',
  'extensive experience',
]

function isJuniorJob(title: string): boolean {
  const lower = title.toLowerCase()
  if (EXCLUSION_KEYWORDS.some((kw) => lower.includes(kw))) return false

  return KEYWORDS.some((kw) => lower.includes(kw))
}

export async function fetchListings(providers: 'all' | ProviderName[] = 'all') {
  const selected: [ListingSource, (typeof PROVIDERS)[ProviderName]][] =
    providers === 'all'
      ? Object.entries(PROVIDERS) as [ListingSource, (typeof PROVIDERS)[ProviderName]][]
      : providers.map((name) => [name, PROVIDERS[name]])

  console.log(`[scraper] Running providers: ${providers === 'all' ? 'all' : providers.join(', ')}`)

  const results: ProviderScrapeResult[] = await Promise.all(
    selected.map(async ([source, scrape]) => {
      try {
        return await scrape()
      } catch (error) {
        console.error(`[scraper] ${source} failed:`, error)
        return { source, listings: [], complete: false }
      }
    })
  )

  const filteredResults = results.map((result) => {
    const seen = new Set<string>()
    const listings = result.listings.filter((job) => {
      if (!isJuniorJob(job.title) || seen.has(job.link)) return false
      seen.add(job.link)
      return true
    })
    return { ...result, listings }
  })

  const total = filteredResults.reduce((count, result) => count + result.listings.length, 0)
  console.log(`Fetched ${total} junior jobs across ${filteredResults.length} provider(s)`)
  return filteredResults
}
