import { createMiddleware } from "hono/factory";

export function trafficLogger() {
  return createMiddleware(async (c, next) => {
    const startDelta = performance.now();
    console.log(`[${new Date().toISOString()}] "${c.req.method}" ${c.req.url}`);
    await next();
    console.log(
      `[${new Date().toISOString()}] "${c.req.method}" ${c.req.url} - ${c.res.status} - ${(performance.now() - startDelta).toFixed(2)}ms`,
    );
  });
}
