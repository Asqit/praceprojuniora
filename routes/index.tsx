import JobList from "../islands/job-list.tsx";

export default function RootPage() {
  return (
    <article>
      <header className="border-b border-gruvbox-bg1 bg-gruvbox-bg p-8 sticky top-0 left-0 w-full z-50">
        <h1>Vítejte na job boardu</h1>
        <h2 className="text-2xl">
          Práce pro{" "}
          <span className="animate-text-color-cycle font-black">JUNIORA</span>
        </h2>
        <h3 className="text-xs text-gruvbox-gray italic">
          seznam je aktualizován každý den od 9 do 17
        </h3>
      </header>
      <JobList />
      <footer className="bg-gruvbox-bg1">
        <div className="grid grid-cols-3 w-full h-[5px]">
          <div className="bg-gruvbox-red" />
          <div className="bg-gruvbox-green" />
          <div className="bg-gruvbox-blue" />
        </div>

        <div className="flex flex-col items-center justify-center p-8">
          <p>
            Made with{" "}
            <a
              className="text-gruvbox-aqua"
              href="https://fresh.deno.dev/"
              target="_blank"
            >
              Fresh.js
            </a>{" "}
            by{" "}
            <a
              className="text-gruvbox-aqua"
              href="https://asqit.space"
              target="_blank"
            >
              Asqit
            </a>
          </p>
          <p>&copy; 2025</p>
        </div>
      </footer>
    </article>
  );
}
