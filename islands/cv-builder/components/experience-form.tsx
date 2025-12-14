import { Plus } from "lucide-preact";

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface ExperienceFormProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

export default function ExperienceForm({ experiences, onChange }: ExperienceFormProps) {
  const addExperience = () => {
    onChange([
      ...experiences,
      {
        id: crypto.randomUUID(),
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ]);
  };

  const removeExperience = (id: string) => {
    onChange(experiences.filter((exp) => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange(experiences.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Pracovní zkušenosti</h2>
        <button
          onClick={addExperience}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Přidat
        </button>
      </div>

      {experiences.map((exp, index) => (
        <div
          key={exp.id}
          className="border border-zinc-200 dark:border-zinc-800 p-4 rounded mb-4"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold">Zkušenost #{index + 1}</h3>
            <button
              onClick={() => removeExperience(exp.id)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Odstranit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Firma"
              value={exp.company}
              onInput={(e) => updateExperience(exp.id, "company", (e.target as HTMLInputElement).value)}
              className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Pozice"
              value={exp.position}
              onInput={(e) => updateExperience(exp.id, "position", (e.target as HTMLInputElement).value)}
              className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 rounded"
            />
            <input
              type="month"
              placeholder="Od"
              value={exp.startDate}
              onInput={(e) => updateExperience(exp.id, "startDate", (e.target as HTMLInputElement).value)}
              className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 rounded"
            />
            <div className="flex gap-2">
              <input
                type="month"
                placeholder="Do"
                value={exp.endDate}
                disabled={exp.current}
                onInput={(e) => updateExperience(exp.id, "endDate", (e.target as HTMLInputElement).value)}
                className="flex-1 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 rounded disabled:opacity-50"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, "current", (e.target as HTMLInputElement).checked)}
                />
                Současnost
              </label>
            </div>
          </div>

          <textarea
            placeholder="Popis práce"
            value={exp.description}
            onInput={(e) => updateExperience(exp.id, "description", (e.target as HTMLTextAreaElement).value)}
            className="w-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 rounded h-20 resize-none"
          />
        </div>
      ))}
    </div>
  );
}