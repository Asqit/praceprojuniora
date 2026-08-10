import { normalize } from './normalize'
import type { Seniority } from './types'

const NO_EXPERIENCE_PATTERNS = [
  /\bbez praxe\b/,
  /\bbez predchozi praxe\b/,
  /\bbez predchozich zkusenosti\b/,
  /\bbez zkusenosti\b/,
  /\bpraxe neni nutna\b/,
  /\bpraxe neni podminkou\b/,
  /\bzkusenosti nejsou nutne\b/,
  /\bneni nutna praxe\b/,
  /\bneni vyzadovana praxe\b/,
]

const EXPERIENCE_PATTERNS = [
  // "3 roky praxe"
  /\b(\d+)\+?\s*(?:rok|roky|roku|let)\s*(?:praxe|zkusenosti)?\b/g,

  // "praxe 3 roky"
  /\b(?:praxe|zkusenosti)\s*(?:alespon|minimalne)?\s*(\d+)\+?\s*(?:rok|roky|roku|let)\b/g,

  // "2+ years experience"
  /\b(\d+)\+?\s*years?\s*(?:of\s*)?(?:experience|practice)\b/g,

  // "experience: 3 years"
  /\b(?:experience|practice)\s*:?\s*(\d+)\+?\s*years?\b/g,
]

function extractNumbers(matches: RegExpMatchArray[]): number[] {
  return matches.map((match) => Number.parseInt(match[1] ?? '', 10)).filter(Number.isFinite)
}

export function extractExperience(text: string): number | null {
  const normalized = normalize(text)

  if (NO_EXPERIENCE_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return 0
  }

  const matches = EXPERIENCE_PATTERNS.flatMap((pattern) => [...normalized.matchAll(pattern)])

  if (matches.length === 0) {
    return null
  }

  const numbers = extractNumbers(matches)

  if (numbers.length === 0) {
    return null
  }

  return Math.min(...numbers)
}

export function detectSeniority(
  title: string,
  text: string,
  experienceMinYears: number | null
): Seniority {
  if (/\bintern(ship)?\b|\bstaz\b/.test(title)) {
    return 'intern'
  }

  if (/\bjunior\b|\bentry[- ]level\b|\btrainee\b|\bzacatecnik\b|\babsolvent/.test(title)) {
    return 'junior'
  }

  if (/\bsenior\b|\blead\b|\bprincipal\b|\bstaff\b/.test(title)) {
    return 'senior'
  }

  if (experienceMinYears !== null) {
    if (experienceMinYears <= 1) return 'junior'
    if (experienceMinYears >= 4) return 'senior'
    if (experienceMinYears >= 2) return 'mid'
  }

  return 'unknown'
}
