import { inworkcz } from './providers/inwork-cz'
import { jobscz } from './providers/jobs-cz'
import { pracecz } from './providers/prace-cz'

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
  const selected =
    providers === 'all' ? Object.values(PROVIDERS) : providers.map((name) => PROVIDERS[name])

  console.log(`[scraper] Running providers: ${providers === 'all' ? 'all' : providers.join(', ')}`)

  const listings = (await Promise.all(selected.map((fn) => fn()))).flat()
  const seen = new Set<string>()

  const juniorListings = listings.filter((job) => {
    const key = job.link
    if (seen.has(key)) return false
    seen.add(key)
    return isJuniorJob(job.title)
  })

  console.log(`Fetched ${listings.length}, returning ${juniorListings.length} junior jobs`)
  return juniorListings
}
