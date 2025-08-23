import { useMemo, useState } from "preact/hooks";
import { Listing } from "../../../lib/types.ts";
import { ListItem } from "./list-item.tsx";

type Props = {
  data: Listing[];
};

export function List({ data }: Props) {
  const [sortBy, setSortBy] = useState<"expiry" | "clicks">("expiry");
  const [sortDirection, setSortDirection] = useState<"most" | "least">("least");

  const renderData = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.sort((a, b) => {
      const aValue = sortBy === "expiry"
        ? new Date(a.expiredAt).getTime()
        : a.clicks;
      const bValue = sortBy === "expiry"
        ? new Date(b.expiredAt).getTime()
        : b.clicks;
      return sortDirection === "most" ? bValue - aValue : aValue - bValue;
    });
  }, [sortBy, sortDirection, data]);

  return (
    <div>
      <div className="w-full sticky top-56 md:top-8 z-10">
        <div className="inline-flex items-center gap-4 float-right bg-gruvbox-bg">
          <button
            type="button"
            onClick={() =>
              setSortDirection((p) => p === "least" ? "most" : "least")}
            className="border border-gruvbox-fg p-1 px-2 transition-colors hover:border-gruvbox-orange"
          >
            {sortDirection === "least"
              ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-arrow-down-up-icon lucide-arrow-down-up"
                >
                  <path d="m3 16 4 4 4-4" />
                  <path d="M7 20V4" />
                  <path d="m21 8-4-4-4 4" />
                  <path d="M17 4v16" />
                </svg>
              )
              : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-arrow-up-down-icon lucide-arrow-up-down"
                >
                  <path d="m21 16-4 4-4-4" />
                  <path d="M17 20V4" />
                  <path d="m3 8 4-4 4 4" />
                  <path d="M7 4v16" />
                </svg>
              )}
          </button>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.currentTarget.value as "expiry" | "clicks")}
            className="bg-transparent border border-grubox-fg p-2 ml-2 transition-colors hover:border-gruvbox-orange"
          >
            <option value="clicks">clicks</option>
            <option value="expiry">expiry</option>
          </select>
        </div>
      </div>

      <ul className="w-full grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-16 p-8">
        {renderData.map((listing) => (
          <li key={listing.id}>
            <ListItem {...listing} />
          </li>
        ))}
      </ul>
    </div>
  );
}
