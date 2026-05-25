import type { HTypes } from '../../../types'
import { Hono, type Context } from 'hono'
import { compare } from 'bcrypt'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { db } from '../../../db/connection'
import { opaqueTokens, users } from '../../../db/schema'
import { eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import { generateOpaqueToken, AUTH_COOKIE_NAME } from '../../../utils/misc'
import { setCookie } from 'hono/cookie'
import { securityToken } from '../middlewares/security'

async function issueOpaqueToken(c: Context, userId: number): Promise<string> {
  const { expiresAt, raw, hash } = generateOpaqueToken()
  await db.insert(opaqueTokens).values({ userId, expiresAt, tokenHash: hash })
  setCookie(c, AUTH_COOKIE_NAME, raw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    path: '/api/v1',
    maxAge: 1 * 24 * 60 * 60, // 1 day worth of seconds
  })
  return raw
}

const signinRequest = z.object({
  email: z.email(),
  password: z.string(),
})

const router = new Hono<HTypes>()
  // ------------------------------------------------ SIGNIN
  .post('/', zValidator('json', signinRequest), async (c) => {
    const { email, password } = c.req.valid('json')
    const rows = await db
      .select({ id: users.id, email: users.email, password: users.password })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (!rows.length) {
      throw new HTTPException(404, { message: 'invalid credentials' })
    }

    if (!(await compare(password, rows[0].password))) {
      throw new HTTPException(401, { message: 'invalid credentials' })
    }

    const token = await issueOpaqueToken(c, rows[0].id)
    return c.json({ user: rows[0].email, token })
  })
  // ------------------------------------------------ SIGN-OFF
  .post('/revoke', securityToken(), async (c) => {
    const id = c.get('userId')
    if (!id) throw new HTTPException(401)

    await db.update(opaqueTokens).set({ revokedAt: new Date() }).where(eq(opaqueTokens.userId, id))
    return c.json({ message: 'ok' }, 200)
  })

export default router
