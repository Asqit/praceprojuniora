# Junior Job Listings

A Fresh-based web application that automatically scrapes and displays junior developer job listings from Czech job boards.

## Features

- **Automated Job Scraping**: Daily crawling of jobs.cz for junior IT positions
- **Smart Duplicate Detection**: Prevents duplicate listings by URL and title
- **Status Tracking**: Jobs are categorized as new, stale, expiring, or expired
- **Search & Filter**: Real-time filtering by title, company, and location
- **Click Tracking**: Monitors job listing engagement
- **Responsive Design**: Mobile-friendly interface with Gruvbox color scheme

## Tech Stack

- **Framework**: Fresh (Deno)
- **Database**: Deno KV
- **Styling**: Tailwind CSS
- **Scraping**: Cheerio + HTTP client with proxy support
- **Deployment**: Deno Deploy ready

## Architecture

- **Cron Jobs**: Daily scraping, status updates, and cleanup
- **API Routes**: RESTful endpoints for listings
- **Islands**: Interactive components for search and filtering
- **Controller**: Centralized listing management with duplicate prevention

## Getting Started

```bash
deno task start
```

The application will:
1. Fetch initial job listings if none exist
2. Start the web server on port 8000
3. Schedule daily cron jobs for updates

## Environment

Requires Deno with KV database support. Proxy configuration available for scraping reliability.