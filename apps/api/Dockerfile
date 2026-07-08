FROM oven/bun:1 AS base
WORKDIR /app

ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

RUN apt-get update && apt-get install -y --no-install-recommends chromium && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lock turbo.json ./
COPY packages/types ./packages/types
COPY packages/cv-auth ./packages/cv-auth
COPY packages/scraper ./packages/scraper
COPY apps/api ./apps/api
RUN bun install
WORKDIR /app/apps/api
EXPOSE 8000
CMD ["sh", "-c", "bun run db:push && bun run src/index.ts"]
