type WorkType = 'remote' | 'hybrid' | 'onsite' | 'unknown'

const REMOTE_PATTERNS = [
  /\bremote\b/,
  /\bfully remote\b/,
  /\bremote first\b/,
  /\bprace na dalku\b/,
  /\bprace z domova\b/,
  /\bhome office\b/,
  /\b100 % home office\b/,
  /\b100% home office\b/,
]

const HYBRID_PATTERNS = [
  /\bhybrid\b/,
  /\bhybridni\b/,
  /\bhybridni rezim\b/,
  /\bkombinace.*kancelar/,
  /\bkombinace.*home office/,
]

const ONSITE_PATTERNS = [
  /\bna pracovisti\b/,
  /\bv kancelari\b/,
  /\bkazdy den v kancelari\b/,
  /\bprace z kancelare\b/,
]

function matchesAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text))
}

export function detectWorkType(text: string): WorkType {
  // Explicit remote wins.
  if (matchesAny(text, REMOTE_PATTERNS)) {
    return 'remote'
  }

  if (matchesAny(text, HYBRID_PATTERNS)) {
    return 'hybrid'
  }

  if (matchesAny(text, ONSITE_PATTERNS)) {
    return 'onsite'
  }

  return 'unknown'
}
