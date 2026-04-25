# praceprojuniora.cz

A Czech job aggregator for junior IT positions. Scrapes listings from multiple sources and presents them in a clean, searchable interface — no registration, no ads, no fluff.

## Stack

**Monorepo** managed with Turborepo and Bun workspaces.

| Package            | Tech                                                |
| ------------------ | --------------------------------------------------- |
| `apps/api`         | Hono, Bun, Drizzle ORM, Turso (libSQL)              |
| `apps/web`         | Next.js 16, TanStack Query, Tailwind CSS, shadcn/ui |
| `packages/scraper` | Cheerio, Bun                                        |
| `packages/types`   | Shared TypeScript types                             |

## Prerequisites

- [Bun](https://bun.sh) >= 1.0
- A [Turso](https://turso.tech) database (or local SQLite for development)

## Getting started

```bash
# Install dependencies
bun install

# Copy and fill in environment variables
echo apps/api/env-sample.txt apps/api/.env
echo apps/web/env-sample.txt apps/web/.env

# Run database migrations
cd apps/api && bun run db:push

# Start all services in development mode
bun dev
```

## Environment variables

### `apps/api`

| Variable        | Description                   |
| --------------- | ----------------------------- |
| `PORT`          | Server port                   |
| `NODE_ENV`      | `DEVELOPMENT` or `PRODUCTION` |
| `DB_URL`        | Turso database URL            |
| `DB_AUTH_TOKEN` | Turso auth token              |

### `apps/web`

| Variable                     | Description                                 |
| ---------------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_API_URL`        | Public API base URL                         |
| `NEXT_PUBLIC_ANALYTICS_URL`  | Umami analytics script URL (optional)       |
| `NEXT_PUBLIC_ANALYTICS_UUID` | Umami website ID (optional)                 |
| `NEXT_PUBLIC_EMAIL`          | contact email rendered in /about (optional) |

## Scripts

Run from the repo root:

```bash
bun dev          # Start all apps in watch mode
bun build        # Build all apps
bun check-types  # TypeScript check across all packages
bun format       # Prettier format
bun release      # Bump version and generate changelog (release-it)
```

## Docker

```bash
docker compose up --build
```

The API runs on port `8080` internally, the web on `3001` externally. Both share a private `internal` network.

## Data sources

| Source   | Method                 |
| -------- | ---------------------- |
| jobs.cz  | HTML scraper (Cheerio) |
| prace.cz | HTML scraper (Cheerio) |

Scraping runs automatically via cron: new listings are fetched daily at 06:00, expired listings are pruned every hour.

## Project structure

```
apps/
  api/        Hono REST API + cron jobs
  web/        Next.js frontend
packages/
  scraper/    Scraper providers and utilities
  types/      Shared TypeScript types
```

## License

MIT
