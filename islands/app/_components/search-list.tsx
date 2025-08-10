import { useState } from "preact/hooks";
import type { JSX } from "preact";
import { Listing } from "../../../lib/types.ts";
import clsx from "clsx";

type Props = {
  renderData: Listing[];
  storeData: Listing[];
  setData(data: Listing[]): void;
  className?: string;
};

const lifetimeOptions = ["new", "stale", "expiring", "expired"] as const;

export function SearchList({ setData, storeData, className }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [lifetimeFilters, setLifetimeFilters] = useState<string[]>([]);

  const filterData = (term: string, lifetimes: string[]) => {
    const value = term.toLowerCase().trim();

    const filtered = storeData.filter((job) => {
      const matchesSearch = !value ||
        job.title.toLowerCase().includes(value) ||
        (job.location?.toLowerCase().includes(value)) ||
        (job.status?.toLowerCase().includes(value));

      const matchesLifetime = lifetimes.length === 0 ||
        lifetimes.includes(job.statusMeta ?? "");

      return matchesSearch && matchesLifetime;
    });

    setData(filtered);
  };

  const handleSearch = (e: JSX.TargetedEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearchTerm(value);
    filterData(value, lifetimeFilters);
  };

  const handleLifetimeChange = (status: string) => {
    const updated = lifetimeFilters.includes(status)
      ? lifetimeFilters.filter((s) => s !== status)
      : [...lifetimeFilters, status];

    setLifetimeFilters(updated);
    filterData(searchTerm, updated);
  };

  return (
    <search
      className={clsx(
        "p-4 border border-gruvbox-bg1 bg-gruvbox-bg sticky top-8 z-20",
        className,
      )}
    >
      <h1 className="absolute -top-3 left-4 z-30 bg-gruvbox-bg1">
        Filter Control
      </h1>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
        <div className="border border-gruvbox-bg1 px-2 py-1">
          <h2>Lifetime Specifier</h2>
          {lifetimeOptions.map((status) => (
            <div key={status} className="flex gap-2 items-center">
              <input
                type="checkbox"
                id={status}
                checked={lifetimeFilters.includes(status)}
                onChange={() =>
                  handleLifetimeChange(status)}
              />
              <label htmlFor={status}>{status}</label>
            </div>
          ))}
        </div>

        <input
          type="text"
          placeholder="search ..."
          onChange={handleSearch}
          value={searchTerm}
          className="w-full px-2 py-1 bg-gruvbox-bg border border-gruvbox-bg1"
        />
      </form>
    </search>
  );
}
