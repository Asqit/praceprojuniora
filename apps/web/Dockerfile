# apps/web/Dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock turbo.json ./
COPY packages/types ./packages/types
COPY apps/web ./apps/web

RUN bun install --frozen-lockfile

WORKDIR /app/apps/web
RUN bun run build



EXPOSE 3000
CMD ["bun", "run", "start"]
