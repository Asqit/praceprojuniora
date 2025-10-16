import { useEffect, useState } from "preact/hooks";
import { Listing } from "../../../lib/types.ts";
import { Bookmark, Eye, SquareArrowOutUpRight } from "lucide-preact";
import ky from "ky";
import { JSX } from "preact";
import { localStorageKeys } from "../../../lib/misc.ts";

type Props = Listing;

export function ListItem(props: Props) {
  const {
    title,
    id,
    link,
    expiredAt,
    location,
    company,
    ...rest
  } = props;
  const [clicks, setClicks] = useState<number>(rest?.clicks);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const timeTo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Dnes";
    if (diffDays === 1) return "Zítra";
    return `${diffDays} dní`;
  };

  const handleClick = async (e: JSX.TargetedMouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0) {
      e.preventDefault();
      return;
    }

    try {
      await ky.put(`/api/listings/click`, {
        json: { id },
      });

      setClicks(clicks + 1);
      globalThis.dispatchEvent(
        new CustomEvent("job-viewed"),
      );
    } catch {
      console.warn("failed to update click count");
    }
  };

  const handleBookmark = (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const prior: string[] = JSON.parse(
      localStorage.getItem(localStorageKeys.bookmarks)!,
    ) ?? [];

    if (prior.includes(id)) {
      localStorage.setItem(
        localStorageKeys.bookmarks,
        JSON.stringify(prior.filter((i) => i !== id)),
      );
      setIsBookmarked(false);
      return;
    }

    localStorage.setItem(
      localStorageKeys.bookmarks,
      JSON.stringify([...prior, id]),
    );
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    globalThis.dispatchEvent(
      new CustomEvent("celebrate", {
        detail: {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        },
      }),
    );
    globalThis.dispatchEvent(new Event("job-bookmarked"));
    setIsBookmarked(true);
  };

  useEffect(() => {
    const prior: string[] = JSON.parse(
      localStorage.getItem(localStorageKeys.bookmarks) ?? "[]",
    );
    if (prior.includes(id)) {
      setIsBookmarked(true);
    }
  }, []);

  return (
    <a
      href={link}
      rel="noopener noreferrer"
      target="_blank"
      onClick={handleClick}
      aria-label={`Pracovní nabídka: ${title} u ${company}`}
      class="p-8 h-full bg-white dark:bg-zinc-950 dark:text-zinc-100 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-all hover:!border-green-500 hover:shadow-lg hover:-translate-y-1 flex flex-col"
    >
      <div class="flex justify-between items-start">
        <div>
          <h1 class="font-bold text-lg my-2">{title}</h1>
          <h2 class="font-bold text-zinc-400 my-2">{company}</h2>
          <h3 class="text-zinc-500 text-sm my-2">{location}</h3>
        </div>
        <button type="button" onClick={handleBookmark}>
          <Bookmark
            className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
          />
        </button>
      </div>
      <ul class="flex items-center justify-between my-3 text-sm text-zinc-400 flex-grow">
        <li class="flex items-center gap-2">
          <Eye size={16} /> {clicks} zobrazení
        </li>
        <li>Platnost do {timeTo(expiredAt)}</li>
      </ul>
      <p class="text-green-500 hover:underline flex items-center gap-2 text-sm">
        <span>Zobrazit původní inzerát</span>{" "}
        <SquareArrowOutUpRight size={16} />
      </p>
    </a>
  );
}
