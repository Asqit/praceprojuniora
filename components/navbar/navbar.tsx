import { Brand } from "../brand/brand.tsx";
import MobileNav from "../../islands/mobile-nav.tsx";

export function Navbar() {
  return (
    <header className="border-b border-gruvbox-bg1 bg-gruvbox-bg p-8 w-full z-30">
      <nav className="flex items-center justify-between">
        <div>
          <Brand />
        </div>
        <MobileNav />
      </nav>
    </header>
  );
}
