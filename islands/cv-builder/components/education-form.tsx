import { Plus } from "lucide-preact";

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export default function EducationForm({ education, onChange }: EducationFormProps) {
  const addEducation = () => {
    onChange([
      ...education,
      {
        id: crypto.randomUUID(),
        school: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        current: false,
      },
    ]);
  };

  const removeEducation = (id: string) => {
    onChange(education.filter((edu) => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    onChange(education.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Vzdělání</h2>
        <button
          onClick={addEducation}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Přidat
        </button>
      </div>

      {education.map((edu, index) => (
        <div
          key={edu.id}
          className="border border-zinc-200 dark:border-zinc-800 p-4 rounded mb-4"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold">Vzdělání #{index + 1}</h3>
            <button
              onClick={() => removeEducation(edu.id)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Odstranit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Škola/Univerzita"
              value={edu.school}
              onInput={(e) => updateEducation(edu.id, "school", (e.target as HTMLInputElement).value)}
              className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Titul/Stupeň"
              value={edu.degree}
              onInput={(e) => updateEducation(edu.id, "degree", (e.target as HTMLInputElement).value)}
              className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Obor"
              value={edu.field}
              onInput={(e) => updateEducation(edu.id, "field", (e.target as HTMLInputElement).value)}
              className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 rounded"
            />
            <div className="flex gap-2">
              <input
                type="month"
                placeholder="Od"
                value={edu.startDate}
                onInput={(e) => updateEducation(edu.id, "startDate", (e.target as HTMLInputElement).value)}
                className="flex-1 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 rounded"
              />
              <input
                type="month"
                placeholder="Do"
                value={edu.endDate}
                disabled={edu.current}
                onInput={(e) => updateEducation(edu.id, "endDate", (e.target as HTMLInputElement).value)}
                className="flex-1 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 rounded disabled:opacity-50"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={edu.current}
                  onChange={(e) => updateEducation(edu.id, "current", (e.target as HTMLInputElement).checked)}
                />
                Současnost
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}