import { Brand } from "../brand/brand.tsx";

export function Navbar() {
  return (
    <header className="border-b border-gruvbox-bg1 bg-gruvbox-bg p-8 w-full z-50">
      <nav className="flex items-center justify-between">
        <Brand />
      </nav>
    </header>
  );
}
