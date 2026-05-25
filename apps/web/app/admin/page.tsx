import type { ScrapeJob } from "@ppj/types"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { BASE_URL } from "@/lib/http"
import { signOut, triggerScrape } from "./actions"

interface Stats {
  total: number
  addedToday: number
  sources: { name: string; count: number }[]
}

const PROVIDERS = ["inwork.cz", "jobs.cz", "prace.cz"] as const

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ jobId?: string }>
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_session")?.value
  if (!token) redirect("/admin/signin")

  const { jobId } = await searchParams

  const [stats, job] = await Promise.all([
    fetch(new URL("stats", BASE_URL), { cache: "no-store" })
      .then((r) => (r.ok ? (r.json() as Promise<Stats>) : null))
      .catch(() => null),

    jobId
      ? fetch(new URL(`scraper/scrape/${jobId}/status`, BASE_URL), {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        })
          .then((r) => (r.ok ? (r.json() as Promise<ScrapeJob>) : null))
          .catch(() => null)
      : null,
  ])

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin</h1>
            <p className="text-sm text-muted-foreground">Správa scraperu</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Odhlásit se
            </button>
          </form>
        </div>

        {/* Stats */}
        {stats && (
          <section className="space-y-3">
            <h2 className="font-semibold text-primary">Statistiky</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded bg-card p-4">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Celkem nabídek</p>
              </div>
              <div className="rounded bg-card p-4">
                <p className="text-2xl font-bold">{stats.addedToday}</p>
                <p className="text-sm text-muted-foreground">Přidáno dnes</p>
              </div>
              {stats.sources.map((s) => (
                <div key={s.name} className="rounded bg-card p-4">
                  <p className="text-2xl font-bold">{s.count}</p>
                  <p className="text-sm text-muted-foreground">{s.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Job status */}
        {job && (
          <section className="space-y-3">
            <h2 className="font-semibold text-primary">Stav scrape</h2>
            <div className="space-y-2 rounded bg-card p-4">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    job.status === "running"
                      ? "bg-yellow-500"
                      : job.status === "done"
                        ? "bg-green-500"
                        : "bg-destructive"
                  }`}
                />
                <span className="text-sm font-medium capitalize">
                  {job.status === "running"
                    ? "Probíhá…"
                    : job.status === "done"
                      ? "Dokončeno"
                      : "Chyba"}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                Zdroje: {job.providers}
              </p>
              <p className="text-sm text-muted-foreground">
                Spuštěno: {new Date(job.startedAt).toLocaleString("cs-CZ")}
              </p>

              {job.finishedAt && (
                <p className="text-sm text-muted-foreground">
                  Dokončeno: {new Date(job.finishedAt).toLocaleString("cs-CZ")}
                </p>
              )}

              {job.result && (
                <p className="text-sm">
                  Vloženo:{" "}
                  <strong>
                    {job.result.inserted} / {job.result.total}
                  </strong>{" "}
                  nabídek
                </p>
              )}

              {job.error && (
                <p className="text-sm text-destructive">{job.error}</p>
              )}

              {job.status === "running" && (
                <a
                  href={`/admin?jobId=${job.id}`}
                  className="mt-1 block text-sm text-primary hover:underline"
                >
                  Obnovit stav
                </a>
              )}
            </div>
          </section>
        )}

        {/* Trigger scrape */}
        <section className="space-y-3">
          <h2 className="font-semibold text-primary">Spustit scrape</h2>
          <form
            action={triggerScrape}
            className="space-y-4 rounded bg-card p-4"
          >
            <fieldset className="space-y-2">
              <legend className="mb-2 text-sm font-medium">
                Zdroje{" "}
                <span className="font-normal text-muted-foreground">
                  (prázdné = všechny)
                </span>
              </legend>
              {PROVIDERS.map((p) => (
                <label
                  key={p}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    name="providers"
                    value={p}
                    className="rounded"
                  />
                  {p}
                </label>
              ))}
            </fieldset>

            <button
              type="submit"
              className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Spustit
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
