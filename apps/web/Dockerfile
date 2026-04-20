# apps/web/Dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock turbo.json ./
COPY packages/types ./packages/types
COPY apps/web ./apps/web

RUN bun install

WORKDIR /app/apps/web

ARG NEXT_PUBLIC_ANALYTICS_URL
ARG NEXT_PUBLIC_ANALYTICS_UUID
ARG NEXT_PUBLIC_API_URL

ENV NEXT_PUBLIC_ANALYTICS_URL=$NEXT_PUBLIC_ANALYTICS_URL
ENV NEXT_PUBLIC_ANALYTICS_UUID=$NEXT_PUBLIC_ANALYTICS_UUID
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "start"]
