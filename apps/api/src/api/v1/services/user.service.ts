import { db } from '../../../db/connection'
import { opaqueTokens, users } from '../../../db/schema'
import { compare } from 'bcrypt'
import { eq } from 'drizzle-orm'
import { generateOpaqueToken } from '../../../utils/misc'

export class UserService {
  static async signIn(email: string, password: string) {
    const rows = await db
      .select({ id: users.id, email: users.email, password: users.password })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (!rows.length) {
      return null
    }

    if (!(await compare(password, rows[0].password))) {
      return null
    }

    return rows[0]
  }

  static async revokeTokens(userId: number) {
    await db
      .update(opaqueTokens)
      .set({ revokedAt: new Date() })
      .where(eq(opaqueTokens.userId, userId))
  }

  static async issueOpaqueToken(userId: number): Promise<string> {
    const { expiresAt, raw, hash } = generateOpaqueToken()
    await db.insert(opaqueTokens).values({ userId, expiresAt, tokenHash: hash })
    return raw
  }
}
