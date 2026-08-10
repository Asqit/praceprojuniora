import { clamp } from './utils'

export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function normalizeItScore(score: number): number {
  // Treat anything <= 0 as completely irrelevant.
  if (score <= 0) {
    return 0
  }

  // 10+ means strong IT evidence.
  if (score >= 10) {
    return 100
  }

  return Math.round((score / 10) * 100)
}

export function normalizeJuniorScore(score: number): number {
  return Math.round(clamp(score + 50, 0, 100))
}
