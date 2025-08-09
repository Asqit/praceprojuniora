import { type PageProps } from "$fresh/server.ts";
import { initDb } from "../lib/db/index.ts";
import { fetchListings } from "../lib/scraping/index.ts";
import { Listing } from "../lib/scraping/types.ts";

// Every-Hour between 9-17
Deno.cron("fetch job listings", { hour: { start: 9, end: 17 } }, async () => {
  console.log('- starting CRON job "fetch job listings"');
  const jobs = await fetchListings();
  const kv = await initDb();
  for (const job of jobs as Listing[]) {
    await kv.set(["listing", job.link], job);
  }
  console.log('- finished CRON job "fetch job listings"');
});

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Práce Pro Juniora</title>
        <link rel="stylesheet" href="/styles.css" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest"></link>
        {Deno.env.get("ENV") === "production" && (
          <script
            defer
            src="https://analytics.asqit.space/script.js"
            data-website-id="996e22e8-8b4a-463a-895b-78eb212e3354"
          >
          </script>
        )}
      </head>
      <body className="font-mono bg-gruvbox-bg text-gruvbox-fg">
        <Component />
      </body>
    </html>
  );
}
