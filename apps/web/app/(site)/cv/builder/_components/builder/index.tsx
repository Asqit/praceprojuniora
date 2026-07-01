"use client"
import { useState } from "react"
import { emptyCvDetails } from "../dummy-data"
import { Previewer } from "../previewer"
import { CvDetails } from "../types"
import { Wizard } from "./wizard"
import { Exporter } from "../previewer/components/exporter"
import { Zoomer } from "../previewer/components/zoomer"
import { TemplateSwitcher } from "../previewer/components/template-switcher"
import { useExportPdf } from "./use-export-pdf"
import { useExportMarkdown } from "./use-export.md"

export function Builder() {
  const [details, setDetails] = useState<CvDetails>(emptyCvDetails)
  const [zoomLevel, setZoomLevel] = useState<number>(0.8)
  const [galleryOpen, setGalleryOpen] = useState<boolean>(false)
  const { exportState, downloadPdf } = useExportPdf()
  const { downloadMarkdown } = useExportMarkdown()

  return (
    <div className="grid-cols-3 md:grid">
      <main className="p-6">
        <Wizard details={details} setDetails={setDetails} />
      </main>
      <aside className="group col-span-2 hidden bg-muted md:block">
        <Previewer
          zoom={zoomLevel}
          content={details}
          galleryOpen={galleryOpen}
        />
        <div className="animate-ou sticky bottom-12 z-50 mx-auto hidden w-fit max-w-2xl animate-in flex-col gap-2 rounded-md bg-background/50 p-2 backdrop-blur-xl slide-in-from-bottom slide-out-to-bottom group-hover:flex">
          <TemplateSwitcher
            open={galleryOpen}
            onToggle={() => setGalleryOpen((v) => !v)}
          />
          <Zoomer zoom={zoomLevel} setZoom={setZoomLevel} />
          <Exporter
            onExportPdf={() => downloadPdf(details)}
            onExportMarkdown={() => downloadMarkdown(details)}
            onPrint={function (): void {
              throw new Error("Function not implemented.")
            }}
            exportState={exportState}
          />
        </div>
      </aside>
    </div>
  )
}
