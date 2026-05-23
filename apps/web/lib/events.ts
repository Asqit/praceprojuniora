export type EventMap = {
  "praceprojuniora.cz::gamification": {
    type: "scroll" | "click" | "bookmark"
    amount: number
  }
  "praceprojuniora.cz::celebrate": {
    x: number
    y: number
  }
}

export function dispatch<T extends keyof EventMap>(
  name: T,
  detail: EventMap[T]
) {
  window.dispatchEvent(new CustomEvent(name, { detail }))
}
