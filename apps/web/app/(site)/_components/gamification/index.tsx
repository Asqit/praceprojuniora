"use client"
import { dispatch, EventMap } from "@/lib/events"
import { useEffect, useState } from "react"
import { useLocalStorage } from "usehooks-ts"
import { Button } from "@/components/ui/button"
import { Bookmark, MousePointerClick, Footprints, X, Medal } from "lucide-react"

interface State {
  scrollLength: number
  postsClicked: number
  bookmarks: number
}

const initialState: State = {
  scrollLength: 0,
  postsClicked: 0,
  bookmarks: 0,
}

// ~3779px per metre at 96 dpi
function formatScroll(px: number) {
  const m = px / 3779
  if (m < 1) return `${Math.round(m * 100)} cm`
  return `${m.toFixed(1)} m`
}

export function Gamification() {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useLocalStorage<State>(
    "praceprojuniora.cz/gamification",
    initialState
  )

  useEffect(() => {
    const handler = (e: Event) => {
      const { type, amount } = (
        e as CustomEvent<EventMap["praceprojuniora.cz::gamification"]>
      ).detail

      setValue((p) => {
        switch (type) {
          case "scroll":
            return { ...p, scrollLength: p.scrollLength + amount }
          case "click":
            return { ...p, postsClicked: p.postsClicked + amount }
          case "bookmark":
            return { ...p, bookmarks: p.bookmarks + amount }
        }
      })
    }
    window.addEventListener("praceprojuniora.cz::gamification", handler)
    return () =>
      window.removeEventListener("praceprojuniora.cz::gamification", handler)
  }, [setValue])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        dispatch("praceprojuniora.cz::gamification", {
          type: "scroll",
          amount: Math.round(window.scrollY),
        })
      }
    }

    document.addEventListener("visibilitychange", handleVisibility)
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility)
  }, [])

  const hasActivity =
    value.scrollLength > 0 || value.postsClicked > 0 || value.bookmarks > 0

  const stats = [
    {
      icon: <Footprints className="size-3.5" />,
      value: formatScroll(value.scrollLength),
      label: "prošlapáno",
    },
    {
      icon: <MousePointerClick className="size-3.5" />,
      value: value.postsClicked,
      label: value.postsClicked === 1 ? "nabídka otevřena" : "nabídek otevřeno",
    },
    {
      icon: <Bookmark className="size-3.5" />,
      value: value.bookmarks,
      label: value.bookmarks === 1 ? "záložka uložena" : "záložek uloženo",
    },
  ]

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
      {/* Stats panel */}
      {isOpen && (
        <div className="w-52 animate-in rounded-lg border border-border bg-card shadow-md duration-150 fill-mode-both fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold">Tvůj progres</p>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setIsOpen(false)}
              aria-label="Zavřít"
            >
              <X />
            </Button>
          </div>
          <div className="flex flex-col gap-3 px-4 py-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-primary">{stat.icon}</span>
                <span className="min-w-10 text-sm font-semibold tabular-nums">
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAB trigger */}
      <div className="relative">
        {/* activity dot */}
        {hasActivity && !isOpen && (
          <span className="absolute -top-0.5 -right-0.5 flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-primary ring-2 ring-background" />
          </span>
        )}
        <Button
          size="icon-lg"
          variant="default"
          onClick={() => setIsOpen((o) => !o)}
          aria-label="Zobrazit tvůj progres"
          aria-expanded={isOpen}
          className="rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          {isOpen ? <X className="size-5" /> : <Medal className="size-5" />}
        </Button>
      </div>
    </div>
  )
}
