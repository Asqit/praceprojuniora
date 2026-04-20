"use client"

import type { MouseEvent } from "react"
import { Button } from "@/components/ui/button"
import { localStorageKeys } from "@/lib/storage"
import { timeAgo } from "@/lib/utils"
import { Listing } from "@ppj/types"
import { Bookmark, Eye, SquareArrowOutUpRight } from "lucide-react"
import { useCallback, useState } from "react"
import { useLocalStorage } from "usehooks-ts"
import { queryClient } from "@/lib/query-client"
import { useMutation } from "@tanstack/react-query"
import { http } from "@/lib/http"
import Link from "next/link"

export function ListingCard(props: Listing) {
  const [clicks, setClicks] = useState<number>(props.clicks)
  const { mutateAsync } = useMutation({
    mutationKey: ["listing", "click", props.id],
    mutationFn: async () => {
      const response = await http(`listing/click-counter/${props.id}`, {
        method: "POST",
      })
      return await response.json()
    },
    onSuccess(data) {
      setClicks(data?.clicks)
    },
  })
  const [bookmarks, setBookmarks] = useLocalStorage<Listing[]>(
    localStorageKeys.bookmarks,
    []
  )
  const isBookmarked = bookmarks.some((i) => i.id === props.id)

  const handleBookmark = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      if (isBookmarked) {
        setBookmarks(bookmarks.filter((i) => i.id !== props.id))
        queryClient.invalidateQueries({ queryKey: ["listing", "bookmarks"] })
        return
      }

      const rect = event.currentTarget.getBoundingClientRect()
      setBookmarks([...bookmarks, props])
      globalThis.dispatchEvent(
        new CustomEvent("celebrate", {
          detail: {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          },
        })
      )
    },
    [bookmarks, isBookmarked, props, setBookmarks]
  )

  return (
    <Link
      href={props.link}
      rel="noopener noreferrer"
      onClick={(e) => mutateAsync()}
      target="_blank"
      aria-label={`Pracovní nabídka: ${props.title} u ${props.company}`}
      className="relative z-10! flex h-full animate-in flex-col rounded-lg border p-8 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
    >
      <div className="w-full px-4">
        {/* Title -- Bookmark */}
        <div className="flex w-full items-start justify-between">
          <div>
            <h1 className="my-2 text-lg font-bold">{props.title}</h1>
            <h2 className="my-2 font-bold text-zinc-400">{props.company}</h2>
            <h3 className="my-2 text-sm text-zinc-500">{props.location}</h3>
          </div>
          <Button variant={"outline"} size={"icon-sm"} onClick={handleBookmark}>
            <Bookmark
              className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
            />
          </Button>
        </div>

        <ul className="my-3 flex flex-1 flex-wrap items-center justify-between gap-4 text-sm text-zinc-400">
          <li className="flex items-center gap-2">
            <Eye size={16} /> {clicks} zobrazení
          </li>
          <li className="group h-5 overflow-hidden">
            <div className="transition-all group-hover:-translate-y-6">
              Platnost do: {props.status}
            </div>
            <div className="transition-all group-hover:-translate-y-5">
              Přidáno před {timeAgo(props.createdAt)}
            </div>
          </li>
        </ul>
        <p className="flex items-center gap-2 text-sm text-primary hover:underline">
          <span>Zobrazit původní inzerát</span>{" "}
          <SquareArrowOutUpRight size={16} />
        </p>
      </div>
    </Link>
  )
}
