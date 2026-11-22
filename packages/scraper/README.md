# Scraper

## Tests

Run the scraper provider tests with:

```sh
bun run --filter @ppj/scraper test
```

## Export all listings to CSV

Run all providers without filtering listings by junior-title keywords:

```sh
bun run --filter @ppj/scraper export:csv
```

The output is written to `listings-YYYY-MM-DD.csv` in the current directory. Pass a path after `--` to choose another destination:

```sh
bun run --filter @ppj/scraper export:csv -- ./all-listings.csv
```
