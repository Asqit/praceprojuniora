export async function initDb(): Promise<Deno.Kv> {
  return await Deno.openKv("./data/kv.sqlite3");
}
