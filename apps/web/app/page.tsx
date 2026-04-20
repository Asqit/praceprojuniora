import { http } from "@/lib/http"
import { DataList } from "./_components/data-list"

export default async function Page() {
  const response = await http("listing?page=1&limit=6").catch(console.log)
  const data = await response?.json().catch(console.log)
  const dummy = { data: [] }

  return (
    <section className="max-w-8xl container mx-auto min-h-svh p-6">
      <h1 className="mb-2 text-3xl font-bold text-balance">
        Pracovní nabídky pro juniory v IT{" "}
      </h1>
      <p className="mb-6 text-muted-foreground">
        Pro ty, co umí git commit, ale ještě ne git blame na kolegy.
      </p>
      <DataList initialData={data ?? dummy} />
    </section>
  )
}
