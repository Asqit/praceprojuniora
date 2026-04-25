import { ThemeToggle } from "@/components/theme-toggler"
import { Button } from "@/components/ui/button"
import { Brand } from "../brand"
import Link from "next/link"
import { Menu } from "lucide-react"
import {
  BubbleMenu,
  BubbleMenuList,
  BubblePillItem,
  BubbleTrigger,
} from "./components/bubble-menu"

const publicMap = [
  { href: "/", renderName: "Nabídky", rotate: -2 },
  { href: "/about", renderName: "O Nás", rotate: 1 },
  { href: "/bookmarks", renderName: "Záložky", rotate: -1 },
]

export function Navbar() {
  return (
    <header className="sticky top-0 left-0 z-40 w-full border-b bg-background/50 backdrop-blur-lg">
      <BubbleMenu>
        <nav className="max-w-8xl container mx-auto flex justify-between p-4 py-6">
          <Brand />
          <BubbleTrigger asChild className="md:hidden">
            <Button>
              <Menu />
            </Button>
          </BubbleTrigger>
          <div className="hidden items-center gap-2 md:flex">
            <ul className="flex items-center gap-2">
              {publicMap.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <Button variant={"link"}>{link.renderName}</Button>
                  </Link>
                </li>
              ))}
            </ul>
            <ThemeToggle />
          </div>
        </nav>
        <BubbleMenuList>
          {publicMap.map((link) => (
            <BubblePillItem
              key={link.href}
              href={link.href}
              variant="default"
              rotate={link.rotate}
            >
              {link.renderName}
            </BubblePillItem>
          ))}
        </BubbleMenuList>
      </BubbleMenu>
    </header>
  )
}
