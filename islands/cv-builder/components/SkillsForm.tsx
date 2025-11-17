import { Plus } from "lucide-preact";

interface Skill {
  id: string;
  name: string;
  level: string;
}

interface SkillsFormProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

export default function SkillsForm({ skills, onChange }: SkillsFormProps) {
  const addSkill = () => {
    onChange([
      ...skills,
      {
        id: crypto.randomUUID(),
        name: "",
        level: "Začátečník",
      },
    ]);
  };

  const removeSkill = (id: string) => {
    onChange(skills.filter((skill) => skill.id !== id));
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    onChange(skills.map((skill) =>
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Dovednosti</h2>
        <button
          onClick={addSkill}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Přidat
        </button>
      </div>

      {skills.map((skill) => (
        <div key={skill.id} className="flex gap-4 items-center mb-4">
          <input
            type="text"
            placeholder="Dovednost"
            value={skill.name}
            onInput={(e) => updateSkill(skill.id, "name", (e.target as HTMLInputElement).value)}
            className="flex-1 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 rounded"
          />
          <select
            value={skill.level}
            onChange={(e) => updateSkill(skill.id, "level", (e.target as HTMLSelectElement).value)}
            className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 rounded"
          >
            <option value="Začátečník">Začátečník</option>
            <option value="Pokročilý">Pokročilý</option>
            <option value="Expert">Expert</option>
          </select>
          <button
            onClick={() => removeSkill(skill.id)}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            Odstranit
          </button>
        </div>
      ))}
    </div>
  );
}