import { USER_AGENT } from './ua'
const FETCH_TIMEOUT_MS = 15_000

export async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    return await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timer)
  }
}
