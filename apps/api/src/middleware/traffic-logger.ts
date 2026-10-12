import { createMiddleware } from 'hono/factory'
import { getConnInfo } from 'hono/bun'

export function trafficLogger() {
  return createMiddleware(async (c, next) => {
    const startDelta = performance.now()
    const remoteIp = getConnInfo(c).remote.address ?? 'unknown'
    const forwardedFor = c.req.header('x-forwarded-for') ?? '-'
    const realIp = c.req.header('x-real-ip') ?? '-'

    console.log(
      `[${new Date().toISOString()}] "${c.req.method}" ${c.req.url} - remoteIp=${remoteIp} xForwardedFor=${forwardedFor} xRealIp=${realIp}`
    )
    await next()
    console.log(
      `[${new Date().toISOString()}] "${c.req.method}" ${c.req.url} - ${c.res.status} - ${(performance.now() - startDelta).toFixed(2)}ms`
    )
  })
}
