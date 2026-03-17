# apps/api/Dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

# copy root workspace files
COPY package.json bun.lockb turbo.json ./

# copy packages
COPY packages/types ./packages/types
COPY packages/scraper ./packages/scraper

# copy app
COPY apps/api ./apps/api

# install deps
RUN bun install --frozen-lockfile

WORKDIR /app/apps/api
RUN bun run db:migrate

EXPOSE 8080
CMD ["bun", "run", "src/index.ts"]
