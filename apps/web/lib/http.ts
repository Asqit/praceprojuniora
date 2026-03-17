export const BASE_URL =
  process.env.NET_PUBLIC_API_URL ?? "http://localhost:8000/api/v1/"

//
export async function http(path: string, init?: RequestInit) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  })

  if (!response.ok) throw new Error(await response.text())
  return response.json()
}
