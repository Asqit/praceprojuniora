import Link from "next/link"
import { BASE_URL } from "@/lib/http"
import { Rss } from "lucide-react"

const RSS_URL = new URL("listing/rss", BASE_URL).toString()

const publicMap = [
  { href: "/", label: "Nabídky" },
  { href: "/about", label: "O Nás" },
  { href: "/bookmarks", label: "Záložky" },
]

export function Footer() {
  return (
    <footer className="relative w-full bg-background/50 before:absolute before:top-px before:right-0 before:left-0 before:h-px before:bg-border/40 before:content-[''] after:absolute after:top-0 after:right-0 after:left-0 after:h-px after:bg-border after:content-['']">
      <div className="max-w-8xl container mx-auto flex flex-col items-center gap-6 px-6 py-10 md:flex-row md:justify-between">
        <nav>
          <ul className="flex items-center gap-6">
            {publicMap.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={RSS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Rss className="size-3.5" />
                RSS
              </Link>
            </li>
          </ul>
        </nav>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} praceprojuniora.cz
        </p>
      </div>
    </footer>
  )
}
