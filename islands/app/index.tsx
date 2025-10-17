import type { Listing } from "../../lib/types.ts";
import { useState } from "preact/hooks";
import { match } from "ts-pattern";
import { BookmarksStep } from "./_components/bookmarks.tsx";
import { RegularStep } from "./_components/regular.tsx";

type Props = {
  initialData: Listing[];
};

export default function App({ initialData }: Props) {
  const [step, setStep] = useState<"bookmarks" | "regular">("regular");

  return match(step)
    .with(
      "bookmarks",
      () => <BookmarksStep toggleStep={() => setStep("regular")} />,
    )
    .with(
      "regular",
      () => (
        <RegularStep
          data={initialData}
          toggleStep={() => setStep("bookmarks")}
        />
      ),
    )
    .exhaustive();
}
