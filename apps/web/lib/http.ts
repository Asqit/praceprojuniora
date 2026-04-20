const resolvedUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1/"

export const BASE_URL = new URL(
  resolvedUrl.endsWith("/") ? resolvedUrl : resolvedUrl + "/"
)

export async function http(path: string, init?: RequestInit) {
  const response = await fetch(new URL(path, BASE_URL), {
    headers: { "Content-Type": "application/json" },
    ...init,
  })

  if (!response.ok) throw new Error(await response.text())
  return response
}
