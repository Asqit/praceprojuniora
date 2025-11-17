interface PreviewModeProps {
  markdown: string;
}

export default function PreviewMode({ markdown }: PreviewModeProps) {
  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 rounded-lg">
      <pre className="whitespace-pre-wrap font-mono text-sm">
        {markdown}
      </pre>
    </div>
  );
}