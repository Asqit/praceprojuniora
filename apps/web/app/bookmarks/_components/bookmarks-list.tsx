"use client"
import { ListingsList } from "@/components/share/listings-list"
import { localStorageKeys } from "@/lib/storage"
import { Listing } from "@ppj/types"
import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { useLocalStorage } from "usehooks-ts"

export function BookmarksList() {
  const [sort, setSort] = useState("")
  const [filter, setFilter] = useState("")
  const [search, setSearch] = useState("")
  const [listings] = useLocalStorage<Listing[]>(localStorageKeys.bookmarks, [])

  const { data, isLoading } = useQuery({
    queryKey: ["listing", "bookmarks"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8000/api/v1/listing/bulk", {
        method: "POST",                                          // fix: was missing
        headers: { "Content-Type": "application/json" },        // fix: was missing
        body: JSON.stringify({ ids: listings.map((l) => l.id) }),
      })

      if (!response.ok) throw new Error("faulty request")

      const parsed = await response.json()
      return parsed.data as Listing[]
    },
    enabled: Boolean(listings.length),
    placeholderData: listings,
  })

  const filtered = useMemo(() => {
    const heap: Listing[] = data ?? []

    const result = heap.filter((item) => {
      const searchLower = search.toLowerCase()
      const filterLower = filter.toLowerCase()

      const hasSearch =
        !searchLower ||
        [item.title, item.description, item.company, item.location].some((s) =>
          s?.toLowerCase().includes(searchLower)
        )

      const hasLocation = !filterLower || item.location.toLowerCase().includes(filterLower)

      return hasSearch && hasLocation
    })

    // fix: sort applied here
    if (sort === "title")    result.sort((a, b) => a.title.localeCompare(b.title))
    if (sort === "company")  result.sort((a, b) => a.company.localeCompare(b.company))
    if (sort === "newest")   result.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    if (sort === "oldest")   result.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))

    return result
  }, [data, filter, search, sort])            // fix: was misplaced inside .filter()

  // fix: return was trapped inside useMemo
  return (
    <ListingsList
      data={filtered}
      isLoading={isLoading}
      isBookmarks={true}
      onSearch={(v) => setSearch(v)}
      onLocationFilter={(loc) => setFilter(loc)}
      onSort={(by) => setSort(by)}
    />
  )
}
