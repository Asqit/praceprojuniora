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
      title: "SuperIT",
      degree: "Střední Škola IT s maturitou",
      startDate: "2015-09",
      endDate: "2019-06",
      description: "",
    },
    {
      title: "ČVUT",
      degree: "Bc.",
      startDate: "2019-09",
      endDate: "2023-06",
      description: "",
    },
  ],
  skills: {
    Jazyky: ["Python", "JavaScript", "C++"],
    Frontend: ["React", "Tailwind"],
    Backend: [
      "FastAPI",
      "Nest.js",
      "drizzle",
      "sqlalchemy",
      "sqlite",
      "postgres",
    ],
    DevOps: ["AWS Cloudshell", "Docker", "GNU/Linux", "cURL"],
    AI: ["llama.cpp", "Claude Code"],
  },
  languages: {
    Čeština: "Rodilý mluvčí",
    Angličtina: "B2",
  },
}

export const emptyCvDetails: CvDetails = {
  personal: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    links: [],
  },
  experiences: [],
  education: [],
  skills: {},
  languages: {},
}
