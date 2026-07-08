import { BunCache } from 'bun-cache'

export const CV_TEMPLATES = ['default', 'aurora', 'nebula', 'cyber'] as const
export type CvTemplate = (typeof CV_TEMPLATES)[number]

export interface CvSession {
  data: unknown
  template: CvTemplate
  updatedAt: number
  version: number
}

const SESSION_TTL_MS = 24 * 60 * 60 * 1000
const cache = new BunCache()

export function isCvTemplate(value: unknown): value is CvTemplate {
  return typeof value === 'string' && CV_TEMPLATES.includes(value as CvTemplate)
}

export function getCvSession(token: string): CvSession | undefined {
  return cache.hasKey(token) ? (cache.get(token) as CvSession) : undefined
}

export function putCvSession(token: string, session: CvSession): CvSession {
  cache.put(token, session, SESSION_TTL_MS)
  return session
}
