import type { HTypes } from '../../../types'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { HTTPException } from 'hono/http-exception'
import { setCookie } from 'hono/cookie'
import { AUTH_COOKIE_NAME } from '../../../utils/misc'
import { securityToken } from '../middlewares/security'
import { UserService } from '../services/user.service'

const signinRequest = z.object({
  email: z.email(),
  password: z.string(),
})

const router = new Hono<HTypes>()
  // ------------------------------------------------ SIGNIN
  .post('/', zValidator('json', signinRequest), async (c) => {
    const { email, password } = c.req.valid('json')
    const user = await UserService.signIn(email, password)

    if (!user) {
      throw new HTTPException(401, { message: 'invalid credentials' })
    }

    const token = await UserService.issueOpaqueToken(user.id)
    setCookie(c, AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/api/v1',
      maxAge: 1 * 24 * 60 * 60,
    })

    return c.json({ user: user.email, token })
  })
  // ------------------------------------------------ SIGN-OFF
  .post('/revoke', securityToken(), async (c) => {
    const id = c.get('userId')
    if (!id) throw new HTTPException(401)

    await UserService.revokeTokens(id)
    return c.json({ message: 'ok' }, 200)
  })

export default router
