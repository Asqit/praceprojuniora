import { signPayload, verifyPayload } from '@ppj/cv-auth'
import {
  type CvSession,
  type CvTemplate,
  getCvSession,
  putCvSession,
} from '../../../utils/cv-session'
import { enqueueJob } from '../../../utils/pdf-queue'

interface SessionTokenPayload {
  kind: 'cv_session'
  iat: number
  exp: number
  ver: number
}

const SESSION_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

export class CvService {
  static createSession(
    data: unknown,
    template: CvTemplate
  ): {
    sessionToken: string
    session: CvSession
  } {
    const now = Date.now()
    const payload = {
      kind: 'cv_session',
      iat: now,
      exp: now + SESSION_TOKEN_TTL_MS,
      ver: 1,
    } satisfies SessionTokenPayload

    const sessionToken = signPayload(payload)
    const session = putCvSession(sessionToken, {
      data,
      template,
      updatedAt: now,
      version: 1,
    })

    return { sessionToken, session }
  }

  static getSession(token: string): CvSession | null {
    if (!this.isValidSessionToken(token)) return null

    const session = getCvSession(token)
    return session ?? null
  }

  static updateSession(token: string, data: unknown, template: CvTemplate): CvSession | null {
    if (!this.isValidSessionToken(token)) return null

    const previous = getCvSession(token)
    if (!previous) return null

    const session = putCvSession(token, {
      data,
      template,
      updatedAt: Date.now(),
      version: previous.version + 1,
    })

    return session
  }

  static async createPdfJobFromSession(token: string): Promise<string | null> {
    if (!this.isValidSessionToken(token)) return null

    const session = getCvSession(token)
    if (!session) return null

    const now = Date.now()
    const jobToken = signPayload({
      kind: 'cv_export',
      iat: now,
      exp: now + 60_000,
      ver: 1,
      nonce: crypto.randomUUID(),
      sessionToken: token,
      data: session.data,
      template: session.template,
    })
    await enqueueJob(jobToken)

    return jobToken
  }

  private static isValidSessionToken(token: string): boolean {
    const payload = verifyPayload(token) as SessionTokenPayload | null
    if (!payload) return false

    return payload.kind === 'cv_session'
  }
}
