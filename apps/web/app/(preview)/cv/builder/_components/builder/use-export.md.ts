import { useState } from "react"
import type { CvDetails } from "../types"

type MarkdownExportState = "idle" | "creating" | "downloading" | "error"

export function useExportMarkdown() {
  const [state, setState] = useState<MarkdownExportState>("idle")

  async function downloadMarkdown(cv: CvDetails) {
    try {
      setState("creating")

      const markdown = cvToMarkdown(cv)

      setState("downloading")

      downloadFile(
        markdown,
        `${slugify(`${cv.personal.firstName}-${cv.personal.lastName}`)}.md`
      )

      setState("idle")
    } catch {
      setState("error")
    }
  }

  return {
    downloadMarkdown,
    state,
  }
}

function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], {
    type: "text/markdown",
  })

  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")

  a.href = url
  a.download = filename

  document.body.appendChild(a)

  a.click()

  a.remove()

  URL.revokeObjectURL(url)
}

function slugify(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-")
}

function cvToMarkdown(cv: CvDetails) {
  const links = cv.personal.links?.map((x) => `- ${x}`).join("\n") ?? ""

  const experiences = cv.experiences
    .map(
      (exp) => `

## ${exp.role}

**${exp.title}**
${exp.startDate} — ${exp.endDate ?? "Present"}

${exp.description}
`
    )
    .join("\n")

  const education = cv.education
    .map(
      (edu) => `

## ${edu.degree}

${edu.title}

${edu.startDate} — ${edu.endDate ?? "Present"}

${edu.description ?? ""}
`
    )
    .join("\n")

  const skills = Object.entries(cv.skills)
    .map(([group, values]) => `### ${group}\n${values.join(", ")}`)
    .join("\n\n")

  const languages = Object.entries(cv.languages)
    .map(([lang, level]) => `- ${lang}: ${level}`)
    .join("\n")

  return `# ${cv.personal.firstName} ${cv.personal.lastName}

${cv.personal.summary ?? ""}

## Contact

- Email: ${cv.personal.email}
- Phone: ${cv.personal.phone}
- Address: ${cv.personal.address}

${links}

# Experience

${experiences}

# Education

${education}

# Skills

${skills}

# Languages

${languages}
`
}
