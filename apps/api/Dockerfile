FROM oven/bun:1 AS base
WORKDIR /app

# copy root workspace files
COPY package.json bun.lock turbo.json ./

# copy packages
COPY packages/types ./packages/types
COPY packages/scraper ./packages/scraper

# copy app
COPY apps/api ./apps/api

# install deps
RUN bun install

WORKDIR /app/apps/api

ARG DB_FILENAME=file:/app/data/db.sqlite
ENV DB_FILENAME=${DB_FILENAME}
RUN mkdir -p /app/data
RUN bun run db:migrate

EXPOSE 8080
CMD ["bun", "run", "src/index.ts"]
