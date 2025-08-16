export function Footer() {
  return (
    <footer className="bg-gruvbox-bg1">
      <div className="grid grid-cols-3 w-full h-[5px]">
        <div className="bg-gruvbox-red" />
        <div className="bg-gruvbox-green" />
        <div className="bg-gruvbox-blue" />
      </div>

      <div className="flex flex-col items-center justify-center p-8">
        <p>
          <span className={"text-gruvbox-purple"}>{"{"}</span>
          <span className={"text-gruvbox-blue"}>url</span>
          <span className={"text-gruvbox-gray"}>:</span>{" "}
          <span className={"underline text-gruvbox-green"}>
            "praceprojuniora.cz"
          </span>
          <span className={"text-gruvbox-purple"}>{"}"}</span>
        </p>
        <p>A passion project</p>
        <p>
          Made with{" "}
          <a
            className="text-gruvbox-aqua"
            href="https://fresh.deno.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fresh.js
          </a>
        </p>
        <p>&copy; 2025</p>
      </div>
    </footer>
  );
}
