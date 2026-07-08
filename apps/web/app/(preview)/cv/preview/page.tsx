import { notFound } from "next/navigation"
import { verifyPayload } from "@ppj/cv-auth"
import { DefaultCvTemplate } from "@/app/(preview)/cv/builder/_components/previewer/templates/default"
import { CvDetails } from "@/app/(preview)/cv/builder/_components/types"

export const runtime = "nodejs"

interface PageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function CvPreviewPage({ searchParams }: PageProps) {
  const { token } = await searchParams

  if (!token) return notFound()

  // Server-side verification — this is what Puppeteer hits directly,
  // so we can't trust the query string, only the signed payload.
  const payload = verifyPayload(token)
  if (!payload) return notFound()

  // Re-validate shape, not just signature. A valid signature on stale/
  // malformed data shouldn't be trusted blindly either.
  //const result = cvDataSchema.safeParse(payload.data)
  //if (!result.success) return notFound()

  const data: CvDetails = payload.data

  return (
    <main className="cv-preview">
      <DefaultCvTemplate cv={data} />
    </main>
  )
}
