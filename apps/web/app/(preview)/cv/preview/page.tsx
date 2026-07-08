import { notFound } from "next/navigation"
import { verifyPayload } from "@ppj/cv-auth"
import {
  templates,
  type CvTemplateName,
} from "@/app/(preview)/cv/builder/_components/previewer/templates"
import { CvDetails } from "@/app/(preview)/cv/builder/_components/types"

export const runtime = "nodejs"

interface PageProps {
  searchParams: Promise<{ token?: string }>
}

interface ExportPayload {
  kind: "cv_export"
  data: CvDetails
  template: CvTemplateName
}

export default async function CvPreviewPage({ searchParams }: PageProps) {
  const { token } = await searchParams

  if (!token) return notFound()

  // Server-side verification — this is what Puppeteer hits directly,
  // so we can't trust the query string, only the signed payload.
  const payload = verifyPayload(token) as ExportPayload | null
  if (!payload || payload.kind !== "cv_export") return notFound()

  // Re-validate shape, not just signature. A valid signature on stale/
  // malformed data shouldn't be trusted blindly either.
  //const result = cvDataSchema.safeParse(payload.data)
  //if (!result.success) return notFound()

  const data = payload.data
  const templateName =
    payload.template in templates ? payload.template : "default"
  const Template = templates[templateName]

  return (
    <main className="cv-preview">
      <Template cv={data} />
    </main>
  )
}
