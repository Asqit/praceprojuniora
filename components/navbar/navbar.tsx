export function Navbar() {
  return (
    <header className="border-b border-gruvbox-bg1 bg-gruvbox-bg p-8 w-full z-50">
      <h1>Vítejte na job boardu</h1>
      <h2 className="text-2xl">
        Práce pro{" "}
        <span className="animate-text-color-cycle font-black">JUNIORA</span>
      </h2>
      <h3 className="text-xs text-gruvbox-gray italic">
        Seznam je aktualizován každý den v 9AM času UTC
      </h3>
    </header>
  );
}
