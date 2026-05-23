import React from "react"
import { http } from "@/lib/http"
import { Briefcase, TrendingUp, Database } from "lucide-react"

interface Stats {
  total: number
  addedToday: number
  sources: { name: string; count: number }[]
}

export async function StatsStrip() {
  let stats: Stats | null = null

  try {
    const res = await http("stats", {
      next: { revalidate: 300 },
    } as RequestInit)
    stats = await res.json()
  } catch {
    return null
  }

  if (!stats) return null

  const items = [
    {
      icon: <Briefcase className="size-3.5" />,
      label: "aktivních nabídek",
      value: stats.total.toLocaleString("cs-CZ"),
    },
    {
      icon: <TrendingUp className="size-3.5" />,
      label: "přidáno dnes",
      value: `+${stats.addedToday}`,
    },
    {
      icon: <Database className="size-3.5" />,
      label: "zdrojů",
      value: stats.sources.length,
    },
  ]

  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 md:justify-start">
      {items.map((item, i) => (
        <React.Fragment key={item.label}>
          {i > 0 && (
            <span className="text-border select-none" aria-hidden>
              ·
            </span>
          )}
          <div
            className="flex animate-in items-center gap-1.5 fill-mode-both fade-in slide-in-from-bottom-2"
            style={
              {
                "--tw-animation-delay": `${(i + 2) * 100}ms`,
              } as React.CSSProperties
            }
          >
            <span className="text-primary">{item.icon}</span>
            <span className="text-sm font-semibold tabular-nums">
              {item.value}
            </span>
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}
