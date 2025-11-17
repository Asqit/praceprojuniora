import CVBuilder from "../islands/cv-builder/index.tsx";

export default function CVBuilderPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">CV Builder</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Vytvořte si profesionální životopis snadno a rychle
        </p>
      </div>
      <CVBuilder />
    </main>
  );
}
