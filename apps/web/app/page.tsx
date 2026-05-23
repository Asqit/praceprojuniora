import { http } from "@/lib/http"
import { DataList } from "./_components/data-list"
import Image from "next/image"
import { StatsStrip } from "@/components/share/stats-strip"
import { Gamification } from "./_components/gamification"

export default async function Page() {
  const response = await http("listing?page=1&limit=6").catch(console.log)
  const data = await response?.json().catch(console.log)
  const dummy = { data: [] }

  return (
    <section className="max-w-8xl container mx-auto p-6">
      <div className="grid grid-cols-1 items-center gap-4 py-8 md:grid-cols-2 md:py-12">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <h1 className="animate-in text-4xl leading-tight font-bold tracking-tight fill-mode-both fade-in slide-in-from-bottom-4 md:text-6xl">
            Pracovní nabídky pro <span className="text-primary">juniory</span> v
            IT
          </h1>
          <p className="mt-4 animate-in text-lg text-muted-foreground fill-mode-both [--tw-animation-delay:100ms] fade-in slide-in-from-bottom-4">
            Pro ty, co umí git commit, ale ještě ne git blame na kolegy.
          </p>
          <StatsStrip />
        </div>
        <div className="relative flex items-center justify-center md:justify-end">
          <div className="dot-grid-bg absolute -inset-6 -z-10" />
          <Image
            src="/whatnot.webp"
            width={320}
            height={320}
            alt=""
            className="relative z-10 w-36 drop-shadow-sm md:w-64"
          />
        </div>
      </div>

      <DataList initialData={data ?? dummy} />
      <Gamification />
    </section>
  )
}
