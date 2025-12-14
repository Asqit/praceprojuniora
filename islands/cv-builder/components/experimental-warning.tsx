export default function ExperimentalWarning() {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
      <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
        <span className="text-sm font-medium">⚠️ EXPERIMENTÁLNÍ FUNKCE</span>
      </div>
      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
        CV Builder je ve vývoji. Může obsahovat chyby nebo nefungovat správně.
      </p>
    </div>
  );
}