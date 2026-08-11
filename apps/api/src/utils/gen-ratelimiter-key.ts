import { Context } from 'hono'
import { getConnInfo } from 'hono/bun'

function getClientIp(c: Context): string | undefined {
  return getConnInfo(c).remote.address
}

function getRequestFingerprint(c: Context): string | undefined {
  const userAgent = c.req.header('User-Agent')
  const accept = c.req.header('Accept')
  const language = c.req.header('Accept-Language')

  if (!userAgent || !accept || !language) {
    return undefined
  }

  return `${userAgent}:${accept}:${language}`
}

export function generateRatelimiterKey(c: Context): string {
  const ip = getClientIp(c)

  if (ip) {
    return `ip:${ip}`
  }

  const fingerprint = getRequestFingerprint(c)

  if (fingerprint) {
    return `fp:${fingerprint}`
  }

  return 'unknown'
}
