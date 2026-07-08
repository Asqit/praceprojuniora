"use client"

import { useState } from "react"
import { CvDetails } from "../types"
import { templates, type CvTemplateName } from "./templates"
import { Toolbar } from "./components/toolbar"
import { useExportPdf } from "../builder/use-export-pdf"
import { useExportMarkdown } from "../builder/use-export.md"

interface Props {
  content: CvDetails
  selectedTemplate: CvTemplateName
  onTemplateChange(template: CvTemplateName): void
  sessionToken: string | null
}

export function Previewer({
  content,
  selectedTemplate,
  onTemplateChange,
  sessionToken,
}: Props) {
  const [zoomLevel, setZoomLevel] = useState<number>(0.8)
  const [galleryOpen, setGalleryOpen] = useState<boolean>(false)
  const { exportState, downloadPdf } = useExportPdf()
  const { downloadMarkdown } = useExportMarkdown()
  const isEmpty = !content.personal?.firstName && !content.personal?.lastName
  const Template = templates[selectedTemplate] ?? templates.default

  return (
    <div className="flex min-h-0 flex-col overflow-y-auto">
      {/* Sticky gallery header */}
      <nav
        className={[
          "sticky top-0 z-20 border-b-2 bg-background transition-all duration-300",
          galleryOpen
            ? "max-h-[420px] opacity-100"
            : "pointer-events-none max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="-mx-4 overflow-x-auto px-4">
          <div className="flex snap-x gap-4 pb-2">
            {Object.entries(templates).map(([name, Component]) => {
              const selected = name === selectedTemplate

              return (
                <button
                  key={name}
                  onClick={() => onTemplateChange(name as CvTemplateName)}
                  className={[
                    "group shrink-0 snap-start overflow-hidden rounded-3xl border transition",
                    "w-[220px]",
                    selected
                      ? "border-primary shadow-xl ring-2 ring-primary"
                      : "border-border hover:border-primary/50",
                  ].join(" ")}
                >
                  <div className="relative h-[300px] overflow-hidden bg-background/40 p-4">
                    <div
                      className="absolute top-4 left-1/2 origin-top -translate-x-1/2 scale-[0.22]"
                      style={{
                        width: 794,
                        height: 1123,
                      }}
                    >
                      <div className="overflow-hidden rounded-md bg-white shadow-xl">
                        <Component cv={content} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t bg-background px-5 py-3">
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

      <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
        <Toolbar
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          galleryOpen={galleryOpen}
          setGalleryOpen={setGalleryOpen}
          exportState={exportState}
          onExportPdf={() => downloadPdf(content, sessionToken ?? undefined)}
          onExportMarkdown={() => downloadMarkdown(content)}
        />
      </div>

      {/* Content area */}
      <div className="space-y-4 p-4">
        <div
          className="relative mx-auto min-h-[1123px] w-[794px] bg-white shadow-xl"
          style={{ zoom: zoomLevel }}
        >
          <Template cv={content} />
          {isEmpty && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
              <div className="max-w-xs text-center">
                <p className="text-lg font-medium text-neutral-800">
                  Sem se to bude propisovat živě
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  Vyplň jméno vlevo a sleduj, jak se CV rovnou skládá.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
