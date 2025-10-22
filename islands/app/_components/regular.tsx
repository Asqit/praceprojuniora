import { Listing } from "../../../lib/types.ts";
import { useState } from "preact/hooks";
import { List } from "./list.tsx";
import { Bookmark, Search } from "lucide-preact";

interface Props {
  toggleStep(): void;
  data: Listing[];
}

export function RegularStep({ data, toggleStep }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredData = data
    .filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = locationFilter === "all" ||
        job.location.toLowerCase().includes(locationFilter.toLowerCase());
      return matchesSearch && matchesLocation;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime();
      }

      if (sortBy === "expiring") {
        return new Date(a.expiredAt).getTime() -
          new Date(b.expiredAt).getTime();
      }

      return b.clicks - a.clicks;
    });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-balance">
          Pracovní nabídky pro juniory v IT
        </h1>
        <p className="text-muted-foreground mb-6">
          Propojujeme talentované začátečníky s jejich prvními příležitostmi v
          technologickém odvětví
        </p>
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Hledat pozici nebo firmu..."
            value={searchTerm}
            onInput={(e) => setSearchTerm(e.currentTarget.value)}
            className="flex-grow border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-zinc-100 px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.currentTarget.value)}
            className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-zinc-100 px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          >
            <option value="all">Všechny lokace</option>
            <option value="Praha">Praha</option>
            <option value="Brno">Brno</option>
            <option value="Ostrava">Ostrava</option>
            <option value="Plzeň">Plzeň</option>
            <option value="Liberec">Liberec</option>
            <option value="Olomouc">Olomouc</option>
            <option value="České Budějovice">České Budějovice</option>
            <option value="Hradec Králové">Hradec Králové</option>
            <option value="Pardubice">Pardubice</option>
            <option value="Zlín">Zlín</option>
            <option value="Ústí nad Labem">Ústí nad Labem</option>
            <option value="Karlovy Vary">Karlovy Vary</option>
            <option value="Jihlava">Jihlava</option>
            <option value="Remote">Remote</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.currentTarget.value)}
            className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-zinc-100 px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          >
            <option value="newest">Nejnovější</option>
            <option value="popular">Nejpopulárnější</option>
            <option value="expiring">Brzy končící</option>
          </select>
          <button
            type="button"
            onClick={toggleStep}
            className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-zinc-100 px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition flex items-center gap-4"
          >
            <Bookmark className="h-5 w-5" />
            Záložky
          </button>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Nalezeno {filteredData.length} pozic
        </p>
      </div>

      {filteredData.length === 0
        ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Search className="h-10 w-10 mb-4 text-zinc-400" />
            <h2 className="text-lg font-semibold mb-2">
              Žádné nabídky nenalezeny
            </h2>
            <p className="mb-2 max-w-md mx-auto">
              Zkuste upravit filtr, hledat jinou pozici nebo se vraťte později –
              nabídky se pravidelně aktualizují.
            </p>
          </div>
        )
        : <List data={filteredData} />}
    </main>
  );
}
