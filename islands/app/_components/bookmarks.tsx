import { Listing } from "../../../lib/types.ts";
import { useCallback, useEffect, useState } from "preact/hooks";
import { List } from "./list.tsx";
import { localStorageKeys } from "../../../lib/misc.ts";
import ky from "ky";
import { Bookmark } from "lucide-preact";

interface Props {
  toggleStep(): void;
}

export function BookmarksStep({ toggleStep }: Props) {
  const [data, setData] = useState<Listing[]>([]);
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const handleFetchBookmarks = useCallback(async () => {
    try {
      setStatus("loading");

      const bookmarks = JSON.parse(
        localStorage.getItem(localStorageKeys.bookmarks)!,
      );
      if (!bookmarks || bookmarks.length === 0) {
        setData([]);
        setStatus("success");
        return;
      }

      const response = await ky.post("/api/listings/bulk", {
        timeout: 10_000,
        body: JSON.stringify({ ids: bookmarks }),
      });

      const { data } = await response.json<{ data: Listing[] }>();
      setData(data);
      setStatus("success");
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    handleFetchBookmarks();
  }, []);

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
        <h1 className="text-3xl font-bold mb-2">Tvoje záložky</h1>
        <p className="text-muted-foreground mb-6">
          Zde najdeš všechny pracovní nabídky, které jsi si uložil do záložek
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
            className="border border-zinc-200 dark:border-zinc-700 px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition flex items-center gap-4"
          >
            <Bookmark className="h-5 w-5 fill-current" />
            Zpět na nabídky
          </button>
        </div>
      </div>

      {status === "loading" && (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
          <div className="h-8 w-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p>Načítám tvoje záložky...</p>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-red-500 font-medium mb-2">Něco se pokazilo 😢</p>
          <p className="text-muted-foreground mb-4">
            Nepodařilo se načíst tvoje záložky. Zkus to prosím znovu.
          </p>
          <button
            onClick={handleFetchBookmarks}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
          >
            Zkusit znovu
          </button>
        </div>
      )}

      {status === "success" && (
        <>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Nalezeno {filteredData.length} pozic
            </p>
          </div>

          {filteredData.length === 0
            ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                <p>Nemáš uložené žádné nabídky 😅</p>
                <p className="text-sm">Zkus si nějakou přidat a vrať se sem!</p>
              </div>
            )
            : <List data={filteredData} />}
        </>
      )}
    </main>
  );
}
