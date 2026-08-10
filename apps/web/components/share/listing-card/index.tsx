"use client"

import type { MouseEvent } from "react"
import { Button } from "@/components/ui/button"
import { localStorageKeys } from "@/lib/storage"
import { timeAgo, isNew } from "@/lib/utils"
import { Listing } from "@ppj/types"
import {
  Bookmark,
  BriefcaseBusiness,
  Clock,
  MapPin,
  MoveUpRight,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react"
import { useCallback, useState } from "react"
import { useLocalStorage } from "usehooks-ts"
import { queryClient } from "@/lib/query-client"
import { useMutation } from "@tanstack/react-query"
import { http } from "@/lib/http"
import { dispatch } from "@/lib/events"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import Link from "next/link"
import { useMemo } from "react"

const WORK_TYPE_LABEL: Record<string, string> = {
  remote: "Remote",
  hybrid: "Hybridní",
  onsite: "Na místě",
}

export function ListingCard(props: Listing) {
  const [clicks, setClicks] = useState<number>(props.clicks)
  const [upvotes, setUpvotes] = useState<number>(props.upvotes ?? 0)
  const [downvotes, setDownvotes] = useState<number>(props.downvotes ?? 0)

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
      dispatch("praceprojuniora.cz::gamification", {
        type: "click",
        amount: 1,
      })
    },
  })
  const [votes, setVotes] = useLocalStorage<Record<number, "up" | "down">>(
    localStorageKeys.votes,
    {}
  )
  const myVote = votes[props.id] ?? null

  const { mutateAsync: castVote } = useMutation({
    mutationKey: ["listing", "vote", props.id],
    mutationFn: async (direction: "up" | "down") => {
      const response = await http(`listing/vote/${props.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction }),
      })
      return await response.json()
    },
    onSuccess(data, direction) {
      setUpvotes(data?.upvotes ?? upvotes)
      setDownvotes(data?.downvotes ?? downvotes)
      setVotes({ ...votes, [props.id]: direction })
    },
  })

  const handleVote = useCallback(
    (event: MouseEvent<HTMLElement>, direction: "up" | "down") => {
      event.preventDefault()
      event.stopPropagation()
      if (myVote) return
      castVote(direction)
    },
    [castVote, myVote, votes]
  )

  const [bookmarks, setBookmarks] = useLocalStorage<Listing[]>(
    localStorageKeys.bookmarks,
    []
  )
  const isBookmarked = bookmarks.some((i) => i.id === props.id)

  const tags = useMemo<string[]>(() => {
    if (!props.tags) return []
    try {
      return JSON.parse(props.tags)
    } catch {
      return []
    }
  }, [props.tags])

  const workTypeLabel =
    props.workType && props.workType !== "unknown"
      ? WORK_TYPE_LABEL[props.workType]
      : null

  const handleBookmark = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      if (isBookmarked) {
        setBookmarks(bookmarks.filter((i) => i.id !== props.id))
        queryClient.invalidateQueries({ queryKey: ["listing", "bookmarks"] })
        return
      }

      const rect = event.currentTarget.getBoundingClientRect()
      setBookmarks([...bookmarks, props])
      dispatch("praceprojuniora.cz::celebrate", {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      })
      dispatch("praceprojuniora.cz::gamification", {
        type: "bookmark",
        amount: 1,
      })
    },
    [bookmarks, isBookmarked, props, setBookmarks]
  )

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Link
          href={props.link}
          rel="noopener noreferrer"
          onClick={() => mutateAsync()}
          target="_blank"
          aria-label={`Pracovní nabídka: ${props.title} u ${props.company}`}
          className="flex h-full animate-in flex-col gap-4 rounded-xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
          data-umami-event="listing-click"
          data-umami-event-title={props.title}
        >
          {/* Company row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-muted text-sm font-bold text-muted-foreground uppercase">
                {props.company.charAt(0)}
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {props.company}
                </span>
                {isNew(props.createdAt) && (
                  <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                    · Nové
                  </span>
                )}
                {(props.relevanceScore ?? 0) >= 80 && (
                  <span
                    title={String(props.relevanceScore)}
                    className="text-xs font-semibold tracking-wider text-yellow-500 uppercase"
                  >
                    · Doporučujeme
                  </span>
                )}
                {(props.relevanceScore ?? 100) < 40 &&
                  props.relevanceScore !== null && (
                    <span
                      title={String(props.relevanceScore)}
                      className="text-xs font-semibold tracking-wider text-red-500 uppercase"
                    >
                      · Komunita rozhodla
                    </span>
                  )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleBookmark}
              className="shrink-0"
            >
              <Bookmark
                className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
              />
            </Button>
          </div>

          {/* Title */}
          <h1 className="text-xl leading-snug font-bold">{props.title}</h1>

          {/* Meta */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
            {props.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={13} />
                {props.location}
              </span>
            )}
            {workTypeLabel && (
              <span className="flex items-center gap-1.5">
                <BriefcaseBusiness size={13} />
                {workTypeLabel}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {timeAgo(props.createdAt)}
            </span>
          </div>

          {/* Description snippet */}
          {props.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {props.description}
            </p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {tags.slice(0, 6).map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}

          {/* Bottom bar */}
          <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <button
                onClick={(e) => handleVote(e, "up")}
                aria-label="Palec nahoru"
                disabled={myVote !== null}
                className={`flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors hover:text-green-500 disabled:opacity-40 ${myVote === "up" ? "text-green-500" : ""}`}
              >
                <ThumbsUp
                  size={14}
                  className={myVote === "up" ? "fill-current" : ""}
                />
                <span>{upvotes}</span>
              </button>
              <button
                onClick={(e) => handleVote(e, "down")}
                aria-label="Palec dolů"
                disabled={myVote !== null}
                className={`flex items-center rounded-md px-1.5 py-1 transition-colors hover:text-red-500 disabled:opacity-40 ${myVote === "down" ? "text-red-500" : ""}`}
              >
                <ThumbsDown
                  size={14}
                  className={myVote === "down" ? "fill-current" : ""}
                />
              </button>
              <span className="ml-1 text-xs text-muted-foreground/60">
                Community score
              </span>
            </div>
            <span className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent">
              Zobrazit nabídku <MoveUpRight size={12} />
            </span>
          </div>
        </Link>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            mutateAsync()
            window.open(props.link, "_blank")?.focus()
          }}
        >
          Otevřít v nové kartě
        </ContextMenuItem>
        <ContextMenuItem onClick={(e) => handleBookmark(e)}>
          Uložit
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
