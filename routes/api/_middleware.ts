import { MiddlewareHandlerContext } from "$fresh/server.ts";

const ALLOWED_DOMAIN = "praceprojuniora.cz";

function isAllowedOrigin(origin: string): boolean {
  try {
    const hostname = new URL(origin).hostname;
    return hostname === ALLOWED_DOMAIN ||
      hostname.endsWith(`.${ALLOWED_DOMAIN}`);
  } catch {
    return false;
  }
}

export async function handler(req: Request, ctx: MiddlewareHandlerContext) {
  if (Deno.env.get("ENV") !== "production") {
    return await ctx.next();
  }

  const referer = req.headers.get("referer") || "";
  const origin = req.headers.get("origin") || "";

  if (req.url.includes("/api/") && req.method !== "OPTIONS") {
    if (
      !isAllowedOrigin(origin) &&
      !isAllowedOrigin(referer)
    ) {
      console.warn(`invalid referer/origin: ${origin}, ${referer}`);
      return new Response("Forbidden", { status: 403 });
    }
  }

  return await ctx.next();
}
