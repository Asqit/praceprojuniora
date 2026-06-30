import { CvDetails } from "./types"

export const dummyCvDetails: CvDetails = {
  personal: {
    firstName: "Jan",
    lastName: "Novák",
    email: "jan.novak@email.cz",
    phone: "+420 123 456 789",
    address: "Praha, CZ",
    links: ["github.com/jannovak"],
  },
  experiences: [
    {
      title: "Firma s.r.o.",
      role: "Junior Developer",
      startDate: "2023-01",
      endDate: "2024-06",
      description: "Vývoj webových aplikací",
    },
  ],
  education: [
    {
      title: "ČVUT",
      degree: "Bc.",
      startDate: "2019-09",
      endDate: "2023-06",
      description: "Informatika",
    },
  ],
  skills: {
    Frontend: ["React", "TypeScript", "Tailwind"],
    Backend: ["Node.js", "PostgreSQL"],
  },
  languages: {
    Čeština: "Rodilý mluvčí",
    Angličtina: "B2",
  },
}
