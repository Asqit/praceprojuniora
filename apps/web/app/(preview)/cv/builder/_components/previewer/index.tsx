"use client"

import { useEffect, useRef, useState } from "react"
import { CvDetails } from "../types"
import { templates, type CvTemplateName } from "./templates"
import { Toolbar } from "./components/toolbar"
import { useExportPdf } from "../builder/use-export-pdf"
import { useExportMarkdown } from "../builder/use-export.md"

interface Props {
  content: CvDetails
  selectedTemplate: CvTemplateName
  onTemplateChange(template: CvTemplateName): void
}

export function Previewer({
  content,
  selectedTemplate,
  onTemplateChange,
}: Props) {
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [galleryOpen, setGalleryOpen] = useState<boolean>(false)
  const previewViewportRef = useRef<HTMLDivElement>(null)
  const [previewWidth, setPreviewWidth] = useState(0)
  const { exportState, downloadPdf } = useExportPdf()
  const { downloadMarkdown } = useExportMarkdown()
  const isEmpty = !content.personal?.firstName && !content.personal?.lastName
  const Template = templates[selectedTemplate] ?? templates.default
  const pageScale =
    previewWidth > 0 ? Math.min(1, previewWidth / 794) * zoomLevel : zoomLevel

  useEffect(() => {
    const viewport = previewViewportRef.current
    if (!viewport) return

    const observer = new ResizeObserver(([entry]) => {
      setPreviewWidth(entry.contentRect.width)
    })
    observer.observe(viewport)

    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <nav
        className={[
          "shrink-0 overflow-hidden border-b bg-background transition-[max-height,opacity] duration-200",
          galleryOpen
            ? "max-h-[360px] opacity-100"
            : "pointer-events-none max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="overflow-x-auto px-4 py-3">
          <div className="flex snap-x gap-3">
            {Object.entries(templates).map(([name, Component]) => {
              const selected = name === selectedTemplate

              return (
                <button
                  key={name}
                  onClick={() => onTemplateChange(name as CvTemplateName)}
                  className={[
                    "group shrink-0 snap-start overflow-hidden rounded-md border transition",
                    "w-[220px]",
                    selected
                      ? "border-primary ring-2 ring-primary"
                      : "border-border hover:border-primary/50",
                  ].join(" ")}
                >
                  <div className="relative h-[260px] overflow-hidden bg-muted/50 p-3">
                    <div
                      className="absolute top-4 left-1/2 origin-top -translate-x-1/2 scale-[0.22]"
                      style={{
                        width: 794,
                        height: 1123,
                      }}
                    >
                      <div className="overflow-hidden bg-white shadow-md">
                        <Component cv={content} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t bg-background px-3 py-2">
                    <span className="font-medium capitalize">{name}</span>

                    {selected && (
                      <span className="text-sm text-primary">Vybráno</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      <div
        ref={previewViewportRef}
        className="min-h-0 flex-1 overflow-auto bg-muted/35 px-2 py-4 sm:px-6 sm:py-6"
      >
        <div
          className="relative mx-auto min-h-[1123px] w-[794px] bg-white text-black shadow-xl"
          style={{ zoom: pageScale }}
        >
          <Template cv={content} />
          {isEmpty && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
              <div className="max-w-xs text-center">
                <p className="text-lg font-medium text-neutral-800">
                  Tady se objeví tvoje CV
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  Vrať se k úpravám a doplň kontaktní údaje.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toolbar
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        galleryOpen={galleryOpen}
        setGalleryOpen={setGalleryOpen}
        exportState={exportState}
        onExportPdf={() => downloadPdf(content, selectedTemplate)}
        onExportMarkdown={() => downloadMarkdown(content)}
      />
    </div>
  )
}
