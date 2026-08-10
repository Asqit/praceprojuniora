export type Signal = {
  pattern: RegExp
  score: number
  reason: string
}

export const JUNIOR_POSITIVE: Signal[] = [
  {
    pattern: /\bjunior\b/,
    score: 10,
    reason: 'explicit junior',
  },
  {
    pattern: /\bentry[- ]level\b/,
    score: 10,
    reason: 'entry level',
  },
  {
    pattern: /\bzacatecnik\b/,
    score: 10,
    reason: 'beginner',
  },
  {
    pattern: /\btrainee\b/,
    score: 8,
    reason: 'trainee',
  },
  {
    pattern: /\bgraduate\b|\babsolvent/,
    score: 8,
    reason: 'graduate',
  },
  {
    pattern: /\bbe[zs] praxe\b/,
    score: 10,
    reason: 'no previous experience required',
  },
  {
    pattern: /\bvhodne pro absolventy\b/,
    score: 10,
    reason: 'suitable for graduates',
  },
]

export const SENIOR_SIGNALS: Signal[] = [
  {
    pattern: /\bsenior\b/,
    score: -15,
    reason: 'senior',
  },
  {
    pattern: /\blead\b/,
    score: -15,
    reason: 'lead',
  },
  {
    pattern: /\bprincipal\b/,
    score: -20,
    reason: 'principal',
  },
  {
    pattern: /\bstaff\b/,
    score: -20,
    reason: 'staff',
  },
  {
    pattern: /\barchitect\b/,
    score: -15,
    reason: 'architect',
  },
  {
    pattern: /\bhead\b/,
    score: -20,
    reason: 'head',
  },
]

export const STRONG_IT: Signal[] = [
  {
    pattern: /\bdeveloper\b|\bsoftware engineer\b|\bvyvojar\b|\bvyvojarka\b|\bprogramator\b/,
    score: 5,
    reason: 'software development role',
  },
  {
    pattern: /\bfrontend\b|\bbackend\b|\bfull[- ]?stack\b/,
    score: 5,
    reason: 'web development',
  },
  {
    pattern: /\bdevops\b|\bsite reliability\b/,
    score: 5,
    reason: 'DevOps',
  },
  {
    pattern: /\bdata engineer\b|\bmachine learning\b/,
    score: 5,
    reason: 'data/ML',
  },
]

export const WEAK_IT: Signal[] = [
  {
    pattern: /\btester\b/,
    score: 2,
    reason: 'tester',
  },
  {
    pattern: /\bsql\b/,
    score: 1,
    reason: 'SQL',
  },
]

export const NON_IT: Signal[] = [
  {
    pattern: /\bcnc\b|\bplc\b/,
    score: -5,
    reason: 'industrial programming',
  },
  {
    pattern: /\bmechanik\b|\btechnolog\b/,
    score: -5,
    reason: 'industrial role',
  },
  {
    pattern: /\blaborant\b|\bchemik\b/,
    score: -5,
    reason: 'laboratory role',
  },
]

export function applySignals(
  text: string,
  signals: Signal[]
): {
  score: number
  reasons: string[]
} {
  let score = 0
  const reasons: string[] = []

  for (const signal of signals) {
    if (!signal.pattern.test(text)) continue

    score += signal.score
    reasons.push(`${signal.score >= 0 ? '+' : ''}${signal.score} ${signal.reason}`)
  }

  return { score, reasons }
}
