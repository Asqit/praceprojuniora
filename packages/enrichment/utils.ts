export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}

export function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
