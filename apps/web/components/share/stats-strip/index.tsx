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
      icon: <Briefcase className="size-4" />,
      label: "aktivních nabídek",
      value: stats.total.toLocaleString("cs-CZ"),
    },
    {
      icon: <TrendingUp className="size-4" />,
      label: "přidáno dnes",
      value: `+${stats.addedToday}`,
    },
    {
      icon: <Database className="size-4" />,
      label: "zdrojů",
      value: stats.sources.length,
    },
  ]

  return (
    <div className="mb-8 grid grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex min-w-32 flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card px-5 py-4"
        >
          <span className="text-3xl leading-none font-black tabular-nums">
            {item.value}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="text-primary">{item.icon}</span>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}
