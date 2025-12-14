import { Code } from "lucide-preact";

interface ProEditorProps {
  markdownContent: string;
  onChange: (content: string) => void;
}

export default function ProEditor({ markdownContent, onChange }: ProEditorProps) {
  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Code className="w-5 h-5 text-purple-600" />
          PRO Mode - Markdown Editor
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Editujte markdown přímo. Změny se neprojeví zpět do formuláře.
        </p>
      </div>
      <textarea
        value={markdownContent}
        onInput={(e) => onChange((e.target as HTMLTextAreaElement).value)}
        className="w-full h-96 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-zinc-100 px-4 py-3 rounded font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        placeholder="# Vaše jméno\n\n**Kontakt:**\n- Email: vas@email.cz\n\n## Profil\n\nVáš popis...\n\n## Pracovní zkušenosti\n\n### Pozice - Firma\n*2023 - současnost*\n\nPopis práce..."
      />
    </div>
  );
}