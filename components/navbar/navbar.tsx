import { Brand } from "../brand/brand.tsx";
import MobileNav from "../../islands/mobile-nav.tsx";
import ThemeToggle from "../../islands/theme-toggle.tsx";

export function Navbar() {
  return (
    <header className="border-b border-border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div>
            <Brand />
          </div>
          <div class="flex items-center gap-4">
            <MobileNav />
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
