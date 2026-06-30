interface Personal {
  firstName: string
  middleName?: string
  lastName: string
  address: string
  email: string
  phone: string
  links?: string[]
  summary?: string // old-schoolish, maybe tell this to user before using it.
}

interface Experiences {
  title: string
  role: string
  startDate: string // UTC
  endDate?: string
  description: string
}

interface Education extends Omit<Experiences, "role"> {
  degree: string
}

type Skills = Record<string, string[]> // i.e. Frontend: react, tailwindcss, shadcn
type Languages = Record<string, string> // i.e. Czech: Native

export type CvDetails = {
  personal: Personal
  experiences: Experiences[]
  education: Education[]
  skills: Skills
  languages: Languages
}
