import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import { hashToken, AUTH_COOKIE_NAME } from '../../../utils/misc'
import { db } from '../../../db/connection'
import { opaqueTokens } from '../../../db/schema'
import { and, eq, gt, isNull } from 'drizzle-orm'

export function securityToken() {
  return createMiddleware(async (c, next) => {
    // Accept token from cookie (browser requests) or
    // Authorization header (server-to-server requests from Next.js actions)
    const raw =
      getCookie(c, AUTH_COOKIE_NAME) ?? c.req.header('Authorization')?.replace(/^Bearer\s+/, '')

    if (!raw) throw new HTTPException(401, { message: 'no token' })

    const tokenHash = hashToken(raw)
    const [existing] = await db
      .select()
      .from(opaqueTokens)
      .where(
        and(
          eq(opaqueTokens.tokenHash, tokenHash),
          isNull(opaqueTokens.revokedAt),
          gt(opaqueTokens.expiresAt, new Date())
        )
      )
      .limit(1)

    if (!existing) {
      throw new HTTPException(401, { message: 'invalid or expired token' })
    }

    c.set('userId', existing.userId)
    await next()
  })
}
