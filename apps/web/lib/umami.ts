type UmamiPayload = Record<string, string | number | boolean>

interface UmamiApi {
  track: (eventName: string, payload?: UmamiPayload) => void
}

export function trackUmami(eventName: string, payload?: UmamiPayload) {
  if (typeof window === "undefined") return

  const umami = (window as Window & { umami?: UmamiApi }).umami
  umami?.track(eventName, payload)
}
