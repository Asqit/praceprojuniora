import { useState, useEffect } from "preact/hooks";
import { Listing } from "../../../lib/types.ts";
import { addFavorite, removeFavorite, isFavorite } from "../../../lib/favorites.ts";
import ky from "ky";
import clsx from "clsx";

type Props = Listing;
const colors = [
  "red",
  "green",
  "yellow",
  "blue",
  "purple",
  "aqua",
  "orange",
];

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
  const hash = [...id].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color = colors[hash % colors.length];

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

  const handleClick = async (e: MouseEvent) => {
    // Prevent middle-click and right-click from bypassing tracking
    if (e.button !== 0) {
      e.preventDefault();
      return;
    }
    
    await ky.put(`/api/listings/click`, {
      json: { id },
    });
    setClicks(clicks + 1);
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

  const toggleBookmark = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarked) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
    setBookmarked(!bookmarked);
  };

  return (
    <a
      href={link}
      rel="noopener noreferrer"
      target="_blank"
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      className={clsx(
        "relative block w-full h-full p-4 border bg-gruvbox-bg transition-all",
        "before:content-[''] before:transition-all before:border before:absolute before:top-0 before:left-0 before:-z-10 before:w-full before:h-full",
        `before:border-gruvbox-${color}`,
        "hover:before:h-full hover:before:w-full hover:before:top-2 hover:before:left-2",
        `border-gruvbox-${color}`,
      )}
      aria-label={`Pracovní nabídka: ${title} u ${company}`}
    >
      <div className="absolute -top-4 -left-2 md:-top-6 md:-left-4 flex items-center gap-2">
        <div
          className="bg-gruvbox-bg1 px-2 py-1 text-sm"
          title={`${clicks} lidí zde kliklo`}
        >
          {clicks}×
        </div>
        <button
          onClick={toggleBookmark}
          className="bg-gruvbox-bg1 px-2 py-1 text-sm hover:text-gruvbox-yellow transition-colors"
          title={bookmarked ? "Odebrat z oblíbených" : "Přidat do oblíbených"}
        >
          {bookmarked ? "[x]" : "[ ]"}
        </button>
        {new Date(createdAt) > new Date(Date.now() - 1000 * 60 * 60 * 48) && (
          <span className="text-gruvbox-fg font-black bg-gruvbox-bg1 px-2 py-1 text-sm">
            NOVÉ
          </span>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-black">
          ┌ <span className={`text-gruvbox-${color}`}>{title}</span>
        </h3>
        <div className="text-lg font-bold">
          ├ {company}
        </div>
        <div>├ {location}</div>
        <div>├ Expiruje: {timeTo(expiredAt)}</div>
        <div>└ {source}</div>

        <details
          className="mt-4 text-sm text-gruvbox-gray"
          onClick={(e) => e.stopPropagation()}
        >
          <summary className="cursor-pointer hover:text-gruvbox-fg">
            Technické info
          </summary>
          <div className="mt-2 space-y-1 pl-4">
            <div>Dostupné od: {timeAgo(createdAt)}</div>
            <div>Kliknutí: {clicks}×</div>
            <div>Stav: {statusMeta}</div>
            <div className="text-xs break-all">{id}</div>
          </div>
        </details>
      </div>
    </a>
  );
}
