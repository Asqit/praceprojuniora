export type WorkType = 'remote' | 'hybrid' | 'onsite' | 'unknown'

export type Seniority = 'intern' | 'junior' | 'mid' | 'senior' | 'unknown'

export type Enrichment = {
  relevanceScore: number
  juniorScore: number

  seniority: Seniority

  experienceMinYears: number | null

  workType: WorkType

  tags: string[]

  reasons: string[]
}
