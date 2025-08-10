import type { Listing } from "../../lib/types.ts";
import { useCallback, useEffect, useState } from "preact/hooks";
import { match } from "ts-pattern";
import { List } from "./_components/list.tsx";
import { SearchList } from "./_components/search-list.tsx";
import { About } from "./_components/about.tsx";
import ky from "ky";

export default function App() {
  const [dataStore, setDataStore] = useState<Array<Listing>>([]);
  const [data, setData] = useState<Array<Listing>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<"error" | "pending" | "idle">("idle");
  const handleFetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setStatus("pending");
      const response = await ky.get("/api/listings/");
      const jobs = (await response.json<{ data: Listing[] }>())?.data;

      setStatus("idle");
      setDataStore(jobs);
      setData(jobs);
    } catch (error) {
      setError(error as Error);
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (dataStore.length === 0) {
      handleFetch();
    }
  }, []);

  return match(status)
    .with("error", () => (
      <main className="min-h-[60vh] p-4">
        <div className="border-2 border-dashed border-gruvbox-red max-w-xl mx-auto p-6">
          <h1 className="text-2xl font-black text-gruvbox-red mb-3">
            Chybička se vloudila!
          </h1>
          <p>
            Je nám líto, ale vyskytla se neočekávaná chyba. Prosím zkuste to
            později.
          </p>
        </div>
      </main>
    ))
    .with(
      "idle",
      () => (
        <main className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-4">
            <SearchList
              renderData={data}
              storeData={dataStore}
              setData={(data) => setData(data)}
              className="hidden md:block"
            />
            <About listingsCount={dataStore.length} />
          </div>
          <div className="md:col-span-2">
            <SearchList
              renderData={data}
              storeData={dataStore}
              setData={(data) => setData(data)}
              className="md:hidden"
            />

            <List data={data} />
          </div>
        </main>
      ),
    )
    .with(
      "pending",
      () => (
        <main className="min-h-[60vh] grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <div className={"grid grid-rows-2"}>
            {Array.from(new Array(1)).map((i) => (
              <div
                key={i}
                className="w-full aspect-square max-h-[128px] border border-gruvbox-bg1 bg-gruvbox-bg1 animate-pulse"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:col-span-2 gap-4">
            {Array.from(new Array(8)).map((i) => (
              <div
                key={i}
                className="w-full aspect-square max-h-[128px] border border-gruvbox-bg1 bg-gruvbox-bg1 animate-pulse"
              />
            ))}
          </div>
        </main>
      ),
    )
    .exhaustive();
}
