import { createHash, randomBytes } from 'crypto'

// TODO: Prettify the POST message
export function applicationOnListen(port: number): void {
  console.log(
    '\u2591\u2588\u2580\u2588\u2591\u2588\u2580\u2584\u2591\u2588\u2580\u2588\u2591\u2588\u2580\u2580\u2591\u2588\u2580\u2580\u2591\u2588\u2580\u2588\u2591\u2588\u2580\u2584\u2591\u2588\u2580\u2588\u2591\u2580\u2580\u2588\u2591\u2588\u2591\u2588\u2591\u2588\u2580\u2588\u2591\u2580\u2588\u2580\u2591\u2588\u2580\u2588\u2591\u2588\u2580\u2584\u2591\u2588\u2580\u2588\r\n\u2591\u2588\u2580\u2580\u2591\u2588\u2580\u2584\u2591\u2588\u2580\u2588\u2591\u2588\u2591\u2591\u2591\u2588\u2580\u2580\u2591\u2588\u2580\u2580\u2591\u2588\u2580\u2584\u2591\u2588\u2591\u2588\u2591\u2591\u2591\u2588\u2591\u2588\u2591\u2588\u2591\u2588\u2591\u2588\u2591\u2591\u2588\u2591\u2591\u2588\u2591\u2588\u2591\u2588\u2580\u2584\u2591\u2588\u2580\u2588\r\n\u2591\u2580\u2591\u2591\u2591\u2580\u2591\u2580\u2591\u2580\u2591\u2580\u2591\u2580\u2580\u2580\u2591\u2580\u2580\u2580\u2591\u2580\u2591\u2591\u2591\u2580\u2591\u2580\u2591\u2580\u2580\u2580\u2591\u2580\u2580\u2591\u2591\u2580\u2580\u2580\u2591\u2580\u2591\u2580\u2591\u2580\u2580\u2580\u2591\u2580\u2580\u2580\u2591\u2580\u2591\u2580\u2591\u2580\u2591\u2580'
  )
  console.log('~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^')
  console.log(' The server has started')
  console.log(' it is available at:\n')
  console.log(`\thttp://127.0.0.1:${port}`)
  console.log('~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^')
}

export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? 'praceprojuniora.cz::opaque'

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

type OpaqueTokenResult = {
  raw: string
  hash: string
  expiresAt: Date
}

export function generateOpaqueToken(): OpaqueTokenResult {
  const raw = randomBytes(64).toString('hex')
  return {
    expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    hash: hashToken(raw),
    raw,
  }
}
