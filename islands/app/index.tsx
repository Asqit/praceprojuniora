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
  const fetchData = useCallback(async () => {
    try {
      const response = await ky.get("/api/listings");
      const { data: parsedData } = await response.json<{ data: Listing[] }>();
      setData(parsedData);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (initialData.length === 0) {
      fetchData();
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
          toggleStep={() => setStep("bookmarks")}
        />
      ),
    )
    .exhaustive();
}
