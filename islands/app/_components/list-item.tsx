import { useEffect, useState } from "preact/hooks";
import { Listing } from "../../../lib/types.ts";
import { Eye, SquareArrowOutUpRight } from "lucide-preact";
import {
  addFavorite,
  isFavorite,
  removeFavorite,
} from "../../../lib/favorites.ts";
import ky from "ky";
import { JSX } from "preact";

type Props = Listing;

export function ListItem(props: Props) {
  const {
    title,
    id,
    link,
    expiredAt,
    location,
    createdAt,
    source,
    statusMeta,
    company,
    ...rest
  } = props;
  const [clicks, setClicks] = useState<number>(rest?.clicks);
  const [bookmarked, setBookmarked] = useState<boolean>(false);

  useEffect(() => {
    setBookmarked(isFavorite(id));
  }, [id]);

  const timeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Dnes";
    if (diffDays === 1) return "Zítra";
    return `${diffDays} dny(ů)`;
  };

  const timeTo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Dnes";
    if (diffDays === 1) return "Zítra";
    return `${diffDays} dní`;
  };

  const handleClick = async (e: JSX.TargetedMouseEvent<HTMLDivElement>) => {
    // Prevent middle-click and right-click from bypassing tracking
    if (e.button !== 0) {
      e.preventDefault();
      return;
    }

    await ky.put(`/api/listings/click`, {
      json: { id },
    });

    setClicks(clicks + 1);

    globalThis.dispatchEvent(
      new CustomEvent("celebrate", {
        detail: {
          x: e.clientX,
          y: e.clientY,
        },
      }),
    );
    globalThis.dispatchEvent(new Event("job-bookmarked"));
  };

  const handleContextMenu = (e: Event) => {
    e.preventDefault(); // Disable right-click context menu
  };

  const handleMouseDown = (e: MouseEvent) => {
    // Prevent middle-click from opening in new tab
    if (e.button === 1) {
      e.preventDefault();
    }
  };

  return (
    <div
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      aria-label={`Pracovní nabídka: ${title} u ${company}`}
      class="p-8 h-full bg-white dark:bg-zinc-950 dark:text-zinc-100 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-all hover:!border-green-500 hover:shadow-lg hover:-translate-y-1 flex flex-col"
    >
      <div>
        <h1 class="font-bold text-lg my-2">{title}</h1>
        <h2 class="font-bold text-zinc-400 my-2">{company}</h2>
        <h3 class="text-zinc-500 text-sm my-2">{location}</h3>
      </div>
      <ul class="flex items-center justify-between my-3 text-sm text-zinc-400 flex-grow">
        <li class="flex items-center gap-2">
          <Eye size={16} /> {clicks} zobrazení
        </li>
        <li>Platnost do {timeTo(expiredAt)}</li>
      </ul>
      <a
        class="text-green-500 hover:underline flex items-center gap-2 text-sm"
        href={link}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span>Zobrazit původní inzerát</span>{" "}
        <SquareArrowOutUpRight size={16} />
      </a>
    </div>
  );
}
