import { BookmarksList } from "./_components/bookmarks-list"

export default function BookmarksView() {
  return (
    <section className="max-w-8xl container mx-auto min-h-svh p-6">
      <h1 className="mb-2 text-3xl font-bold">Tvoje záložky</h1>
      <p className="mb-6 text-muted-foreground">
        Tvůj digitální &quot;jednou na to kouknu&quot;. Tak koukni.{" "}
      </p>
      <BookmarksList />
    </section>
  )
}
