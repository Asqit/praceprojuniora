interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

interface PersonalInfoFormProps {
  personalInfo: PersonalInfo;
  onChange: (info: PersonalInfo) => void;
}

export default function PersonalInfoForm({ personalInfo, onChange }: PersonalInfoFormProps) {
  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Osobní údaje</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Jméno a příjmení"
          value={personalInfo.name}
          onInput={(e) =>
            onChange({
              ...personalInfo,
              name: (e.target as HTMLInputElement).value,
            })
          }
          className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={personalInfo.email}
          onInput={(e) =>
            onChange({
              ...personalInfo,
              email: (e.target as HTMLInputElement).value,
            })
          }
          className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 rounded"
        />
        <input
          type="tel"
          placeholder="Telefon"
          value={personalInfo.phone}
          onInput={(e) =>
            onChange({
              ...personalInfo,
              phone: (e.target as HTMLInputElement).value,
            })
          }
          className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Lokace"
          value={personalInfo.location}
          onInput={(e) =>
            onChange({
              ...personalInfo,
              location: (e.target as HTMLInputElement).value,
            })
          }
          className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 rounded"
        />
      </div>
      <textarea
        placeholder="Krátký popis/profil"
        value={personalInfo.summary}
        onInput={(e) =>
          onChange({
            ...personalInfo,
            summary: (e.target as HTMLTextAreaElement).value,
          })
        }
        className="w-full mt-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 rounded h-24 resize-none"
      />
    </div>
  );
}