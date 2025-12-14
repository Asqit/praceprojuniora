import { createMiddleware } from "hono/factory";

export function trafficLogger() {
  return createMiddleware(async (c, next) => {
    const startDelta = performance.now();
    await next();
    const duration = performance.now() - startDelta;
    console.info({
      method: c.req.method,
      url: c.req.url,
      status: c.res.status,
      duration: `${duration.toFixed(2)}ms`,
      userAgent: c.req.header("User-Agent"),
      contentLength: c.res.headers.get("Content-Length"),
      ip: c.req.header("x-forwarded-for") || c.req.header("x-real-ip"),
    });
  });
}
