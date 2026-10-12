import { useCallback, useRef, useState } from "react"
import { http } from "@/lib/http"
import type { CvTemplateName } from "../previewer/templates"
import type { CvDetails } from "../types"

export type ExportState = "idle" | "rendering" | "downloading" | "error"

export function useExportPdf() {
  const [exportState, setExportState] = useState<ExportState>("idle")
  const abortRef = useRef<AbortController | null>(null)

  const downloadPdf = useCallback(
    async (details: CvDetails, template: CvTemplateName) => {
      abortRef.current?.abort() // supersede any in-flight export
      const controller = new AbortController()
      abortRef.current = controller

      try {
        setExportState("rendering")
        const response = await http("cv/export", {
          method: "POST",
          body: JSON.stringify({ data: details, template }),
          signal: controller.signal,
        })

        setExportState("downloading")
        const blob = await response.blob()
        if (blob.type !== "application/pdf") {
          throw new Error("Export endpoint did not return a PDF")
        }

        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${details.personal.firstName}-${details.personal.lastName}-cv.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.setTimeout(() => URL.revokeObjectURL(url), 1000)

        setExportState("idle")
      } catch (err) {
        if (controller.signal.aborted) return // superseded, not a real failure
        console.error("PDF export failed:", err)
        setExportState("error")
      }
    },
    []
  )

  return { exportState, downloadPdf }
}
