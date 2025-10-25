import type { PageProps } from "$fresh/server.ts";
import { ANALYTICS_LINK, ANALYTICS_UUID } from "../lib/server-variables.ts";
import { asset } from "$fresh/runtime.ts";
import { Navbar } from "../components/navbar/navbar.tsx";
import { Footer } from "../components/footer/footer.tsx";
import CursorGlow from "../islands/cursor-glow.tsx";
import CelebrationEffect from "../islands/celebration-effect.tsx";

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
          sizes="32x32"
          href={asset("/favicon.ico")}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href={asset("/favicon-96x96.png")}
        />
        <link rel="manifest" href="/manifest.manifest" />
        <meta name="theme-color" content="#282828" />

        {/* Stylesheet */}
        <link rel="stylesheet" href={asset("/styles.css")} />

        {/* Analytics script only in production */}
        {Deno.env.get("ENV") === "production" && (
          <script
            defer
            src={ANALYTICS_LINK}
            data-website-id={ANALYTICS_UUID}
          />
        )}
      </head>
      <body class="bg-white text-black dark:bg-black dark:text-white">
        <Navbar />
        <CursorGlow />
        <CelebrationEffect />
        <Component />
        <Footer />
      </body>
    </html>
  );
}
