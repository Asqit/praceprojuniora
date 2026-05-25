const STRONG_IT = [
  // generic SWE
  'developer',
  'vyvojar',
  'software-engineer',
  // web
  'frontend',
  'backend',
  'fullstack',
  'full-stack',
  'webovy',
  'webovych',
  // infra
  'devops',
  'site-reliability',
  'platform-engineer',
  'cloud-engineer',
  // mobile
  'mobile-developer',
  'ios-developer',
  'android-developer',
  // data/ai
  'data-engineer',
  'data-scientist',
  'machine-learning',
  'ml-engineer',
  'ai-engineer',
  // security
  'cybersecurity',
  'security-engineer',
  // support
  'support-engineer',
  'technical-support',
  // explicit IT
  'application-developer',
  'software-developer',
  'software-engineer',
]

const WEAK_IT = [
  // generic
  'programator',
  'tester',
  'analytik',
  'analyst',
  // enterprise
  'sap',
  'abap',
  'erp',
  'crm',
  'databricks',
  // databases
  'database',
  'databaze',
  'sql',
  // technologies — pouze jako samostatná slova (ne substrings)
  'java',
  'javascript',
  'typescript',
  'nodejs',
  'react',
  'angular',
  'vuejs',
  'php',
  'python',
  'golang',
  'dotnet',
  'kotlin',
  'swift',
  'go',
  'c',
  'c++',
  'c#',
  // misc
  'aplikaci',
  'aplikacii',
]

const QUALIFIER_GOOD = [
  // juniority
  'junior',
  'entry',
  'graduate',
  'trainee',
  'absolvent',
  'fresher',
  // cloud/infra stack
  'aws',
  'azure',
  'gcp',
  'docker',
  'kubernetes',
  // explicit IT context
  'pocitacovych',
  'webmaster',
  'koder',
]

const QUALIFIER_BAD = [
  // industrial programmers
  'cnc',
  'plc',
  'robot',
  'robotu',
  'robotick',
  'mechatronik',
  'cam',
  'cad',
  'palici', // pálící plány
  // manufacturing
  'vyroby',
  'linky',
  'operator',
  'obsluha',
  'serizovac',
  'udrzbar',
  'mechanik',
  'technolog',
  // quality/lab
  'kvality',
  'laborant',
  'chemik',
  'svarec',
  'svarovani',
  // logistics/manual
  'ridic',
  'skladnik',
  'delnik',
  // construction/electro
  'stavby',
  'stavebni',
  'stavar',
  'projektant',
  'silnoproud',
  'slaboproud',
  'elektro',
  // non-IT analysts
  'audit',
  'pruzkum',
  'marketing',
  // misc non-IT
  'socialni',
  'ucitel',
  'zdravotni',
]

const SENIOR_PENALTY = [
  'senior',
  'lead',
  'principal',
  'staff',
  'architect',
  'manager',
  'expert',
  'head',
]

// "sr" zvlášť — jen jako samostatné slovo, ne substring
const SR_PATTERN = /\bsr\b/

export function scoreJob(input: string): number {
  const normalized = input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diakritika
    .replace(/[0-9]/g, '')
    .replace(/\./g, '') // .net → net

  const words = normalized.split(/[-_\s/]+/).filter(Boolean)

  let score = 0

  for (const word of words) {
    if (STRONG_IT.some((t) => word === t || word.includes(t))) score += 3
    else if (WEAK_IT.some((t) => word === t)) score += 1 // exact match pro tech keywords
    if (QUALIFIER_GOOD.some((t) => word === t || word.includes(t))) score += 1
    if (QUALIFIER_BAD.some((t) => word === t || word.includes(t))) score -= 3
    if (SENIOR_PENALTY.some((t) => word === t || word.includes(t))) score -= 2
  }

  // "sr" jako standalone senior signal
  if (SR_PATTERN.test(normalized)) score -= 2

  // "programator" bez IT kontextu = pravděpodobně průmysl
  const hasProgramator = words.some((w) => w === 'programator')
  const hasItContext = words.some((w) =>
    [
      ...WEAK_IT,
      'web',
      'software',
      'frontend',
      'backend',
      'java',
      'php',
      'python',
      'react',
      'angular',
      'vue',
      'node',
      'mobile',
      'android',
      'ios',
      'aplikaci',
      'fullstack',
      'pocitacovych',
    ].includes(w)
  )

  if (hasProgramator && !hasItContext) score -= 2

  return score
}

export const isItRelevant = (input: string): boolean => scoreJob(input) >= 3
