import { Dispatch, SetStateAction } from "react"
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
    <div className="sticky bottom-4 z-50 mx-auto hidden w-[90%] max-w-xl min-w-fit animate-in flex-col gap-2 rounded-md bg-background/70 p-3 shadow-xl backdrop-blur-xl slide-in-from-bottom group-hover:flex">
      <TemplateSwitcher
        open={galleryOpen}
        onToggle={() => setGalleryOpen((v) => !v)}
      />
      <Zoomer zoom={zoomLevel} setZoom={setZoomLevel} />
      <Exporter
        onExportPdf={onExportPdf}
        onExportMarkdown={onExportMarkdown}
        exportState={exportState}
      />
    </div>
  )
}
