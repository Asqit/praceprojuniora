import { Listing } from "@ppj/types"
import { ListingCard } from "../listing-card"
import { Bookmark } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDebounceCallback } from "usehooks-ts"
import { ListingCardSkeleton } from "../list-card-skeleton"
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
      <div className="sticky top-20 z-20 mb-4 flex flex-wrap gap-4 bg-background px-1 py-4 md:flex-nowrap">
        <Input
          onInput={(e) => dOnSearch(e.currentTarget.value)}
          type="text"
          placeholder="Hledat pozici nebo firmu..."
        />
        <Select
          defaultValue="all"
          onValueChange={(value) => onLocationFilter(value)}
        >
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Všechny lokace" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Všechny lokace</SelectItem>
              <SelectItem value="Praha">Praha</SelectItem>
              <SelectItem value="Brno">Brno</SelectItem>
              <SelectItem value="Ostrava">Ostrava</SelectItem>
              <SelectItem value="Plzeň">Plzeň</SelectItem>
              <SelectItem value="Liberec">Liberec</SelectItem>
              <SelectItem value="Olomouc">Olomouc</SelectItem>
              <SelectItem value="České Budějovice">České Budějovice</SelectItem>
              <SelectItem value="Hradec Králové">Hradec Králové</SelectItem>
              <SelectItem value="Pardubice">Pardubice</SelectItem>
              <SelectItem value="Zlín">Zlín</SelectItem>
              <SelectItem value="Ústí nad Labem">Ústí nad Labem</SelectItem>
              <SelectItem value="Karlovy Vary">Karlovy Vary</SelectItem>
              <SelectItem value="Jihlava">Jihlava</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select defaultValue="newest" onValueChange={(value) => onSort(value)}>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Nejnovější" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="newest">Nejnovější</SelectItem>
              <SelectItem value="popularity">Nejpopulárnější</SelectItem>
              <SelectItem value="expiration">Brzy končící</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Link href={isBookmarks ? "/" : "/bookmarks"}>
          <Button>
            <Bookmark
              className={cn("h-5 w-5", isBookmarks && "fill-current")}
            />
            {isBookmarks ? "Hlavní nabídky" : "Záložky"}
          </Button>
        </Link>
      </div>
      <p className="my-8 mt-4 px-2 text-muted-foreground">
        Je zobrazeno {data?.length} {totalAmount && `z celku ${totalAmount}`}
      </p>
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
          data.map((listing) => (
            <li key={listing.id}>
              <ListingCard {...listing} />
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
