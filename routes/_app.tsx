import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Práce Pro Juniora</title>
        <meta
          name="description"
          content="Najděte si práci vhodnou pro juniory v IT oboru – aktuální nabídky juniorních pozic, frontend, backend, a další vývojářské role."
        />
        <link rel="canonical" href="https://praceprojuniora.cz" />

        <meta property="og:title" content="Práce Pro Juniora" />
        <meta
          property="og:description"
          content="Najděte si práci vhodnou pro juniory v IT oboru – aktuální nabídky juniorních pozic, frontend, backend, a další vývojářské role."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://praceprojuniora.cz" />
        <meta
          property="og:image"
          content="https://praceprojuniora.cz/preview-image.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Práce Pro Juniora" />
        <meta
          name="twitter:description"
          content="Najděte si práci vhodnou pro juniory v IT oboru – aktuální nabídky juniorních pozic, frontend, backend, a další vývojářské role."
        />
        <meta
          name="twitter:image"
          content="https://praceprojuniora.cz/preview-image.png"
        />

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
          />
        )}
      </head>
      <body className="font-mono bg-gruvbox-bg text-gruvbox-fg">
        <Component />
      </body>
    </html>
  );
}
