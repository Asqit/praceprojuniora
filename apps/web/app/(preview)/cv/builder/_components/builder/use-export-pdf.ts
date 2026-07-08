import { useCallback, useRef, useState } from "react"
import { fetchEventSource } from "@microsoft/fetch-event-source"
import { BASE_URL, http } from "@/lib/http"
import type { CvDetails } from "../types"

export type ExportState =
  | "idle"
  | "creating"
  | "rendering"
  | "downloading"
  | "error"

export function useExportPdf() {
  const [exportState, setExportState] = useState<ExportState>("idle")
  const abortRef = useRef<AbortController | null>(null)

  const downloadPdf = useCallback(
    async (details: CvDetails, sessionToken?: string) => {
      if (!sessionToken) {
        setExportState("error")
        return
      }

      abortRef.current?.abort() // supersede any in-flight export
      const controller = new AbortController()
      abortRef.current = controller

      try {
        setExportState("creating")

        const createRes = await http(
          `cv/create/${encodeURIComponent(sessionToken)}`,
          {
            method: "POST",
            signal: controller.signal,
          }
        )
        const { jobToken } = (await createRes.json()) as { jobToken: string }

        setExportState("rendering")
        await new Promise<void>((resolve, reject) => {
          fetchEventSource(
            new URL(`cv/status/${jobToken}`, BASE_URL).toString(),
            {
              signal: controller.signal,
              async onopen(res) {
                if (!res.ok)
                  reject(new Error(`status stream failed: ${res.status}`))
              },
              onmessage(ev) {
                if (ev.event === "success") resolve()
                if (ev.event === "error") {
                  const parsed = JSON.parse(ev.data || "{}")
                  reject(new Error(parsed.error ?? "PDF generation failed"))
                }
                // "progress" — nothing to do, keep waiting
              },
              onerror(err) {
                reject(
                  err instanceof Error ? err : new Error("status stream error")
                )
                throw err // stop fetchEventSource's built-in retry
              },
            }
          )
        })

        setExportState("downloading")
        const collectRes = await http(`cv/collect/${jobToken}`, {
          method: "POST",
          signal: controller.signal,
        })
        const blob = await collectRes.blob()

        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${details.personal.firstName}-${details.personal.lastName}-cv.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)

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
