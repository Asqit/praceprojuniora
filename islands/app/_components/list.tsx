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
    <ul className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
      {renderData.map((listing) => (
        <li key={listing.id}>
          <ListItem {...listing} />
        </li>
      ))}
    </ul>
  );
}
