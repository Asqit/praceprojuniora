import { ThemeToggle } from "@/components/theme-toggler"
import { Button } from "@/components/ui/button"
import { Brand } from "../brand"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"
import { Menu } from "lucide-react"

const publicMap = [
  { href: "/", renderName: "Nabídky" },
  { href: "/about", renderName: "O Nás" },
  { href: "/bookmarks", renderName: "Záložky" },
]

export function Navbar() {
  return (
    <header className="sticky top-0 left-0 z-40 w-full border-b bg-background/50 backdrop-blur-lg">
      <nav className="max-w-8xl container mx-auto flex justify-between p-4 py-6">
        <Brand />
        <Sheet>
          <SheetTrigger asChild>
            <Button className="md:hidden">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="hidden" />
            <ul className="mt-4 ml-4 space-y-4">
              {publicMap.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <Button className="text-xl" variant={"link"}>
                      {link.renderName}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
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
    </header>
  )
}
