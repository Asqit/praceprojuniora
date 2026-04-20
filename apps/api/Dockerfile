FROM oven/bun:1 AS base
WORKDIR /app
COPY package.json bun.lock turbo.json ./
COPY packages/types ./packages/types
COPY packages/scraper ./packages/scraper
COPY apps/api ./apps/api
RUN bun install
WORKDIR /app/apps/api
EXPOSE 8000
CMD ["sh", "-c", "bun run db:migrate && bun run src/index.ts"]
