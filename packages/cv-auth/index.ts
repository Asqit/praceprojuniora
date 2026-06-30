import { createHmac } from 'node:crypto'

const SECRET = process.env.RENDER_SECRET ?? 'secret'

export function signPayload(payload: any) {
  const base = Buffer.from(JSON.stringify(payload)).toString('base64')
  const sig = createHmac('sha256', SECRET).update(base).digest('hex')

  return `${base}.${sig}`
}

export function verifyPayload(token: string) {
  const [base, sig] = token.split('.')

  const expected = createHmac('sha256', SECRET).update(base).digest('hex')

  if (expected !== sig) return null

  const payload = JSON.parse(Buffer.from(base, 'base64').toString())

  if (payload.exp && payload.exp < Date.now()) return null

  return payload
}
