import { Download, Eye, Code, FileText } from "lucide-preact";

interface ToolbarProps {
  mode: "form" | "preview" | "pro";
  onModeChange: (mode: "form" | "preview" | "pro") => void;
  onDownloadMarkdown: () => void;
  onDownloadPDF: () => void;
  onSwitchToPro: () => void;
}

export default function Toolbar({ mode, onModeChange, onDownloadMarkdown, onDownloadPDF, onSwitchToPro }: ToolbarProps) {
  return (
    <div className="sticky top-20 w-full z-40 mt-8">
      <div className="bg-white/40 dark:bg-zinc-950/40 backdrop-blur-lg border border-zinc-200 dark:border-zinc-800 rounded-lg px-6 py-4">
        <div className="container mx-auto">
          <div className="flex gap-4">
            {mode !== "form" && (
              <button
                onClick={() => onModeChange("form")}
                className="bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Formulář
              </button>
            )}
            {mode !== "preview" && (
              <button
                onClick={() => onModeChange("preview")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Náhled
              </button>
            )}
            {mode !== "pro" && (
              <button
                onClick={onSwitchToPro}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Code className="w-4 h-4" />
                PRO Mode
              </button>
            )}
            {mode !== "form" && (
              <>
                <button
                  onClick={onDownloadMarkdown}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Markdown
                </button>
                <button
                  onClick={onDownloadPDF}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors relative"
                >
                  <Download className="w-4 h-4" />
                  PDF
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs px-1 rounded text-[10px] font-bold">EXP</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}