import { Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/share/navbar"
import Providers from "@/lib/tanstack-provider"
import CelebrationEffect from "@/components/share/celebration-effect"
import { Metadata } from "next"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "praceprojuniora.cz — IT práce bez '5 let zkušeností'",
    template: "%s | praceprojuniora.cz",
  },
  description:
    "Sbíráme nabídky, které po tobě nechtějí 3 roky zkušeností na juniorskou pozici.",
  metadataBase: new URL("https://praceprojuniora.cz"),
  openGraph: {
    title: "IT práce bez bullshitu",
    description:
      "Žádný '5 let zkušeností required'. Jen reálné nabídky pro juniory.",
    url: "https://praceprojuniora.cz",
    siteName: "praceprojuniora.cz",
    locale: "cs_CZ",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IT práce bez bullshitu",
    description:
      "Žádný '5 let zkušeností required'. Jen reálné nabídky pro juniory.",
    images: ["/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="praceprojuniora" />
        {process.env.NODE_ENV === "production" && (
          <Script
            src={process.env.NEXT_PUBLIC_ANALYTICS_URL}
            data-website-id={process.env.NEXT_PUBLIC_ANALYTICS_UUID}
            defer
          />
        )}
      </head>
      <body>
        <ThemeProvider>
          <Providers>
            <Navbar />
            {children}
            <CelebrationEffect />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
