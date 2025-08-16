import { Listing } from "../../../lib/types.ts";
import { ListItem } from "./list-item.tsx";

type Props = {
  data: Listing[];
};

export function List({ data }: Props) {
  return (
    <ul className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 p-8">
      {(data || []).map((listing) => (
        <li key={listing.id}>
          <ListItem {...listing} />
        </li>
      ))}
    </ul>
  );
}
