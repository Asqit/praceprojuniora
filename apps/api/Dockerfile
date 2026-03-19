FROM oven/bun:1 AS base
WORKDIR /app
COPY package.json bun.lock turbo.json ./
COPY packages/types ./packages/types
COPY packages/scraper ./packages/scraper
COPY apps/api ./apps/api
RUN bun install
WORKDIR /app/apps/api
ARG DB_FILENAME=file:/app/data/db.sqlite
ENV DB_FILENAME=${DB_FILENAME}
EXPOSE 8080
CMD ["sh", "-c", "bun run db:migrate && bun run src/index.ts"]
