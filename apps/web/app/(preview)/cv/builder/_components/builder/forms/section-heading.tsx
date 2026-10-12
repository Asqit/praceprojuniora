import type { LucideIcon } from "lucide-react"

const tones = {
  green: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  blue: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  rose: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  cyan: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
} as const

interface Props {
  icon: LucideIcon
  title: string
  description: string
  tone: keyof typeof tones
}

export function SectionHeading({
  icon: Icon,
  title,
  description,
  tone,
}: Props) {
  return (
    <header className="mb-5 flex items-start gap-3">
      <span
        aria-hidden="true"
        className={`flex size-10 shrink-0 items-center justify-center rounded-md ${tones[tone]}`}
      >
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 pt-0.5">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </header>
  )
}
