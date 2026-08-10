import { Listing } from '../types/src'
import { extractExperience, detectSeniority } from './experience'
import { normalize } from './normalize'
import { calculateRelevanceScore, scoreItRelevance, scoreJuniorRelevance } from './scoring'
import { extractTechnologies } from './skills'
import { Enrichment } from './types'
import { detectWorkType } from './work-type'

export function enrichListing(job: Listing): Enrichment {
  const title = normalize(job.title)
  const description = normalize(job.description ?? '')
  const text = `${title} ${description}`

  const it = scoreItRelevance(title, description)
  const experienceMinYears = extractExperience(text)

  const seniority = detectSeniority(title, text, experienceMinYears)

  const junior = scoreJuniorRelevance({
    title,
    text,
    seniority,
    experienceMinYears,
  })

  const workType = detectWorkType(text)
  const tags = extractTechnologies(text)

  const relevanceScore = calculateRelevanceScore({
    itScore: it.score,
    juniorScore: junior.score,
  })

  return {
    relevanceScore,
    juniorScore: junior.score,
    seniority,
    experienceMinYears,
    workType,
    tags,
    reasons: [...it.reasons, ...junior.reasons],
  }
}
