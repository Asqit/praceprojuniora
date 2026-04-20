"use client"

import { ListingsList } from "@/components/share/listings-list"
import { Button } from "@/components/ui/button"
import { http } from "@/lib/http"
import { Pagination } from "@/lib/types"
import { Listing } from "@ppj/types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"

interface Props {
  initialData?: Pagination<Listing>
}

export function DataList({ initialData }: Props) {
  const [sort, setSort] = useState("")
  const [filter, setFilter] = useState("")
  const [search, setSearch] = useState("")
  const limit = 6
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["listings", { limit, sort, search, filter }],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams()
      params.set("page", String(pageParam))
      params.set("limit", String(limit))
      if (sort) params.set("sortBy", sort)
      if (search) params.set("search", search)
      if (filter) params.set("location", filter)
      const res = await http(`listing?${params.toString()}`)
      return res.json()
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    initialData: {
      pages: [initialData],
      pageParams: [1],
    },
  })

  const listings = useMemo(() => {
    const heap: Listing[] = data?.pages.flatMap((p) => p.data) ?? []
    return heap
  }, [data])

  return (
    <div className="space-y-6">
      <ListingsList
        totalAmount={data?.pages[0]?.totalRows}
        isLoading={isLoading}
        data={listings ?? []}
        isBookmarks={false}
        onSearch={(value) => setSearch(value)}
        onLocationFilter={(loc) =>
          loc === "all" ? setFilter("") : setFilter(loc)
        }
        onSort={(by) => setSort(by)}
      />
      <div className="flex items-center justify-center">
        {hasNextPage ? (
          <Button onClick={() => fetchNextPage()}>Načíst Další</Button>
        ) : null}
      </div>
    </div>
  )
}
