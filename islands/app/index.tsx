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
    <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <aside className="space-y-4" aria-label="Search and information">
        <SearchList
          renderData={data}
          storeData={dataStore}
          setData={(data) => setData(data)}
          className="hidden md:block"
        />
        <About listingsCount={data.length} />
      </aside>
      <article className="md:col-span-2" aria-label="Job listings">
        <SearchList
          renderData={data}
          storeData={dataStore}
          setData={(data) => setData(data)}
          className="md:hidden"
        />
        <List data={data} />
      </article>
    </div>
  );
}
