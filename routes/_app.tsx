import { type PageProps } from "$fresh/server.ts";
import { asset } from "$fresh/runtime.ts";

export default function App({ Component }: PageProps) {
  const title = "Práce Pro Juniora – Práce pro juniory v IT";
  const description =
    "Najděte si práci vhodnou pro juniory v IT oboru – aktuální nabídky juniorních pozic, frontend, backend a další vývojářské role.";
  const url = "https://praceprojuniora.cz";
  const image = `${url}/preview-image.png`;

  return (
    <html lang="cs">
      <head>
        <meta charSet="utf-8" />
        {/* Responsive viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Title with branding + keywords */}
        <title>{title}</title>

        {/* Meta description - concise and unique */}
        <meta name="description" content={description} />

        {/* Canonical URL */}
        <link rel="canonical" href={url} />

        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        <meta property="og:image:alt" content="Práce Pro Juniora - Logo" />
        <meta property="og:locale" content="cs_CZ" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:image:alt" content="Práce Pro Juniora - Logo" />

        {/* Favicons */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={asset("/apple-touch-icon.png")}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={asset("/favicon-32x32.png")}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={asset("/favicon-16x16.png")}
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#282828" />

        {/* Stylesheet */}
        <link rel="stylesheet" href={asset("/styles.css")} />

        {/* Analytics script only in production */}
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
