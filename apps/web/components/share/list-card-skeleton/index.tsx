import { Skeleton } from "@/components/ui/skeleton"

export function ListingCardSkeleton() {
  return (
    <div className="flex h-full min-w-sm flex-col rounded-lg border p-8">
      <div className="w-full px-4">
        {/* Title -- Bookmark */}
        <div className="flex w-full items-start justify-between">
          <div className="flex-1">
            <Skeleton className="my-2 h-6 w-3/4" />
            <Skeleton className="my-2 h-4 w-1/2" />
            <Skeleton className="my-2 h-4 w-1/3" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>

        <div className="my-3 flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>

        <Skeleton className="h-4 w-36" />
      </div>
    </div>
  )
}
