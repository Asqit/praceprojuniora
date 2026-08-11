import { normalizeItScore, normalizeJuniorScore } from './normalize'
import {
  applySignals,
  JUNIOR_POSITIVE,
  NON_IT,
  SENIOR_SIGNALS,
  STRONG_IT,
  WEAK_IT,
} from './signals'
import { Seniority } from './types'
import { clamp } from './utils'

export function scoreItRelevance(title: string, description: string): ScoreResult {
  const titleResult = applySignals(title, [...STRONG_IT, ...WEAK_IT, ...NON_IT])

  const descriptionResult = applySignals(description, [...STRONG_IT, ...WEAK_IT, ...NON_IT])

  return {
    // Title is much stronger evidence than arbitrary description text.
    score: titleResult.score * 2 + descriptionResult.score,

    reasons: [
      ...titleResult.reasons.map((r) => `title: ${r}`),
      ...descriptionResult.reasons.map((r) => `description: ${r}`),
    ],
  }
}

export type ScoreResult = {
  score: number
  reasons: string[]
}

export function scoreJuniorRelevance(input: {
  title: string
  text: string
  seniority: Seniority
  experienceMinYears: number | null
}): ScoreResult {
  let rawScore = 0
  const reasons: string[] = []

  if (input.seniority === 'junior') {
    rawScore += 30
    reasons.push('+30 explicit junior')
  }

  if (input.seniority === 'intern') {
    rawScore += 25
    reasons.push('+25 internship')
  }

  if (input.seniority === 'senior') {
    rawScore -= 50
    reasons.push('-50 senior')
  }

  if (input.experienceMinYears === 0) {
    rawScore += 25
    reasons.push('+25 no experience')
  }

  if (input.experienceMinYears === 1) {
    rawScore += 15
    reasons.push('+15 1 year experience')
  }

  if (input.experienceMinYears === 2) {
    rawScore += 5
    reasons.push('+5 2 years experience')
  }

  if (input.experienceMinYears !== null && input.experienceMinYears >= 3) {
    rawScore -= 25
    reasons.push('-25 3+ years experience')
  }

  const positive = applySignals(input.text, JUNIOR_POSITIVE)

  const negative = applySignals(input.text, SENIOR_SIGNALS)

  rawScore += positive.score
  rawScore += negative.score

  reasons.push(...positive.reasons)
  reasons.push(...negative.reasons)

  return {
    score: normalizeJuniorScore(rawScore),
    reasons,
  }
}

export function calculateRelevanceScore(input: { itScore: number; juniorScore: number }): number {
  const it = normalizeItScore(input.itScore)
  const junior = clamp(input.juniorScore, 0, 100)

  return Math.round(it * 0.4 + junior * 0.6)
}
