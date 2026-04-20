function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function getExpiresAt(rawStatus: string): string {
  const compare = rawStatus.toLowerCase()
  const today = new Date()

  if (compare.includes('hodinu') || compare.includes('hodinami') || compare.includes('hodiny')) {
    return addDays(today, 1).toISOString()
  }

  if (compare.includes('končí')) {
    if (compare.includes('zítra')) {
      return addDays(today, 2).toISOString()
    }
    if (compare.includes('dny') || compare.includes('dnem')) {
      const parsed = Number(compare.split(' ').find((word) => parseInt(word)))
      const days = isNaN(parsed) ? 1 : parsed
      return addDays(today, days).toISOString()
    }
    return addDays(today, 1).toISOString()
  }

  return addDays(today, 30).toISOString()
}
