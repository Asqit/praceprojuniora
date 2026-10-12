import type { Dispatch, SetStateAction } from "react"
import { Exporter, ExportState } from "./components/exporter"
import { TemplateSwitcher } from "./components/template-switcher"
import { Zoomer } from "./components/zoomer"

interface Props {
  galleryOpen: boolean
  setGalleryOpen: Dispatch<SetStateAction<boolean>>
  zoomLevel: number
  setZoomLevel: Dispatch<SetStateAction<number>>
  onExportPdf(): void
  onExportMarkdown(): void
  exportState: ExportState
}

export function Toolbar(props: Props) {
  const {
    galleryOpen,
    setGalleryOpen,
    zoomLevel,
    setZoomLevel,
    onExportMarkdown,
    onExportPdf,
    exportState,
  } = props

  return (
    <div className="z-30 grid shrink-0 grid-cols-1 gap-3 border-t bg-background/95 p-3 backdrop-blur">
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
        <div className="min-w-0">
          <TemplateSwitcher
            open={galleryOpen}
            onToggle={() => setGalleryOpen((v) => !v)}
          />
        </div>
        <Zoomer zoom={zoomLevel} setZoom={setZoomLevel} />
      </div>
      <div className="min-w-0 border-t pt-3">
        <Exporter
          onExportPdf={onExportPdf}
          onExportMarkdown={onExportMarkdown}
          exportState={exportState}
        />
      </div>
    </div>
  )
}
