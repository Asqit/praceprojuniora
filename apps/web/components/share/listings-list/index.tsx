"use client"
import React from "react"
import { Listing } from "@ppj/types"
import { ListingCard } from "../listing-card"
import { Bookmark, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDebounceCallback } from "usehooks-ts"
import { ListingCardSkeleton } from "../list-card-skeleton"
import { ListFilters } from "./components/list-filters"
import Link from "next/link"

interface Props {
  data: Listing[]
  isBookmarks: boolean
  isLoading?: boolean
  totalAmount?: number
  onSearch(values: string): void
  onLocationFilter(location: string): void
  onSort(by: string): void
}

export function ListingsList({
  data,
  isLoading,
  totalAmount,
  isBookmarks,
  onSearch,
  onLocationFilter,
  onSort,
}: Props) {
  const dOnSearch = useDebounceCallback(onSearch, 300)

  return (
    <div>
      <div className="sticky top-20 z-20 mb-4 flex animate-in flex-wrap gap-4 bg-background px-1 py-4 fill-mode-both fade-in slide-in-from-bottom-4 md:flex-nowrap">
        <ListFilters
          onLocationChange={onLocationFilter}
          onSearch={dOnSearch}
          onSort={onSort}
        />
        <Link href={isBookmarks ? "/" : "/bookmarks"}>
          <Button>
            <Bookmark
              className={cn("h-5 w-5", isBookmarks && "fill-current")}
            />
            {isBookmarks ? "Hlavní nabídky" : "Záložky"}
          </Button>
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        <p className="my-8 mt-4 px-2 text-muted-foreground">
          Je zobrazeno {data?.length} {totalAmount && `z celku ${totalAmount}`}
        </p>
        {!isBookmarks && (
          <div className="mb-6 flex min-w-xs flex-1 items-start gap-3 rounded-lg border px-4 py-3 text-sm text-muted-foreground">
            <Info size={15} className="mt-0.5 shrink-0 text-primary" />
            <p>
              Hlasováním ovlivňuješ relevanci nabídek. Nabídky s dlouhodobě
              nízkým skóre jsou automaticky odstraněny.
            </p>
          </div>
        )}
      </div>

      <ul
        className={cn(
          "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
          data?.length === 0 &&
            !isLoading &&
            "flex items-center justify-center pt-32"
        )}
      >
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))
        ) : data?.length === 0 ? (
          <li className="text-center">
            <h3 className="text-xl">Prázdno. Jen ty a ticho.</h3>
            <p className="text-muted-foreground">
              Nabídky si zřejmě vzaly volno. Zkus to znovu za chvíli.{" "}
            </p>
          </li>
        ) : (
          data.map((listing, i) => (
            <li
              key={listing.id}
              className="animate-in fill-mode-both fade-in slide-in-from-bottom-4"
              style={
                {
                  "--tw-animation-delay": `${Math.min(i, 5) * 75}ms`,
                } as React.CSSProperties
              }
            >
              <ListingCard {...listing} />
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
