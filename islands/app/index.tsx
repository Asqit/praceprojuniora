import type { Listing } from "../../lib/types.ts";
import { useCallback, useEffect, useState } from "preact/hooks";
import { match } from "ts-pattern";
import { BookmarksStep } from "./_components/bookmarks.tsx";
import { RegularStep } from "./_components/regular.tsx";
import ky from "ky";

type Props = {
  initialData: Listing[];
};

export default function App({ initialData }: Props) {
  const [step, setStep] = useState<"bookmarks" | "regular">("regular");
  const [data, setData] = useState<Listing[]>(initialData || []);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async (reset = false) => {
    setIsLoading(true);
    try {
      const offset = reset ? 0 : data.length;
      const response = await ky.get(`/api/listings?limit=20&offset=${offset}`);
      const result = await response.json<{ data: Listing[]; total: number; hasMore: boolean }>();
      
      if (reset) {
        setData(result.data);
      } else {
        setData(prev => [...prev, ...result.data]);
      }
      
      setTotal(result.total);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [data.length]);

  useEffect(() => {
    if (initialData.length === 0) {
      fetchData(true);
    } else {
      // For initial data, we need to fetch the total count
      fetchData(true);
    }
  }, []);

  return match(step)
    .with(
      "bookmarks",
      () => <BookmarksStep toggleStep={() => setStep("regular")} />,
    )
    .with(
      "regular",
      () => (
        <RegularStep
          data={data}
          total={total}
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={() => fetchData()}
          toggleStep={() => setStep("bookmarks")}
        />
      ),
    )
    .exhaustive();
}
