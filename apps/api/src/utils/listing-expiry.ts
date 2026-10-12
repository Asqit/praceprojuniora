function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const MAX_LISTING_AGE_DAYS = 30

export function getCreatedAt(rawStatus: string, fallback: string): string {
  const compare = rawStatus.toLowerCase()
  const age = compare.match(
    /(?:před\s*(\d+)\s*(hodin(?:a|u|y|ami)?|den|dny|dní|dnů|dnem|týdn(?:y|ů)|měsíc(?:e|ů)?)|(?:^|\s)(\d+)\s*(hodin(?:a|u|y|ami)?|den|dny|dní|dnů|dnem|týdn(?:y|ů)|měsíc(?:e|ů)?)(?:\s*\(ů\))?\s+zpět)/
  )

  if (!age) return fallback

  const amount = Number(age[1] ?? age[3])
  const unit = age[2] ?? age[4]
  const hours = unit.startsWith('hodin')
    ? amount
    : unit.startsWith('dn')
      ? amount * 24
      : unit.startsWith('týdn')
        ? amount * 24 * 7
        : amount * 24 * 30

  return new Date(Date.parse(fallback) - hours * 60 * 60 * 1000).toISOString()
}

export function getExpiresAt(rawStatus: string, createdAt: string): string {
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

  return addDays(new Date(createdAt), MAX_LISTING_AGE_DAYS).toISOString()
}
