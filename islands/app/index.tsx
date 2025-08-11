import type { Listing } from "../../lib/types.ts";
import { useState } from "preact/hooks";
import { List } from "./_components/list.tsx";
import { SearchList } from "./_components/search-list.tsx";
import { About } from "./_components/about.tsx";

type Props = {
  initialData: Listing[];
};

export default function App({ initialData }: Props) {
  const [dataStore, _setDataStore] = useState(initialData);
  const [data, setData] = useState(initialData);

  return (
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
  );
}
