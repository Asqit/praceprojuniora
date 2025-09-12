import { useState } from "preact/hooks";

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
        [ menu ]
      </button>

      {/* Desktop navigation */}
      <div className="hidden md:flex gap-6">
        <a
          href="/"
          className="text-gruvbox-fg hover:text-gruvbox-yellow transition-colors"
        >
          [ práce ]
        </a>
        <a
          href="/favorites"
          className="text-gruvbox-fg hover:text-gruvbox-yellow transition-colors"
        >
          [ oblíbené ]
        </a>
        <a
          href="/about"
          className="text-gruvbox-fg hover:text-gruvbox-yellow transition-colors"
        >
          [ o nás ]
        </a>
      </div>

      {/* Mobile sheet overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile navigation sheet */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gruvbox-bg border-l border-gruvbox-bg1 z-50 transform transition-transform duration-300 md:hidden ${
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
              [x]
            </button>
          </div>

          <nav className="space-y-4">
            <a
              href="/"
              className="block text-gruvbox-fg hover:text-gruvbox-yellow transition-colors font-mono"
              onClick={() => setIsOpen(false)}
            >
              [ práce ]
            </a>
            <a
              href="/favorites"
              className="block text-gruvbox-fg hover:text-gruvbox-yellow transition-colors font-mono"
              onClick={() => setIsOpen(false)}
            >
              [ oblíbené ]
            </a>
            <a
              href="/about"
              className="block text-gruvbox-fg hover:text-gruvbox-yellow transition-colors font-mono"
              onClick={() => setIsOpen(false)}
            >
              [ o nás ]
            </a>
          </nav>
        </div>
      </div>
    </>
  );
}
