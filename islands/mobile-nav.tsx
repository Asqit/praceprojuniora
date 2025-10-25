import { useState } from "preact/hooks";
import { Menu, X } from "lucide-preact";

const links = [
  { href: "/", label: "Nabídky" },
  { href: "/about", label: "O nás" },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-gruvbox-fg hover:text-gruvbox-yellow transition-colors"
        aria-label="Toggle menu"
      >
        <Menu />
      </button>

      {/* Desktop navigation */}
      <div className="hidden md:flex gap-6">
        {links.map((link) => (
          <a
            key={link.href}
            class="hover:text-green-500 transition-colors font-medium"
            href={link.href}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Mobile sheet overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile navigation sheet */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-black border-l border-zinc-200 dark:border-zinc-800 z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <span className="text-gruvbox-yellow font-mono">MENU</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gruvbox-fg hover:text-gruvbox-red transition-colors"
            >
              <X />
            </button>
          </div>

          <nav className="space-y-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block hover:text-green-500 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
