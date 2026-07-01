"use client"

import { useState } from "react"
import { CvDetails } from "../types"
import { templates } from "./templates"
import { DefaultCvTemplate } from "./templates/default"

interface Props {
  content: CvDetails
  zoom: number
  galleryOpen: boolean
}

export function Previewer({ content, zoom, galleryOpen }: Props) {
  const [Template, setTemplate] = useState<
    React.ComponentType<{ cv: CvDetails }>
  >(() => DefaultCvTemplate)
  const isEmpty = !content.personal?.firstName && !content.personal?.lastName

  return (
    <div className="sticky top-32 h-fit overflow-y-auto py-8">
      <div className="space-y-4">
        {/* Expandable gallery */}
        <nav
          className={[
            "overflow-hidden transition-all duration-300",
            galleryOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0",
          ].join(" ")}
        >
          <div className="-mx-4 overflow-x-auto px-4">
            <div className="flex snap-x gap-4 pb-2">
              {Object.entries(templates).map(([name, Component]) => {
                const selected = Component === Template

                return (
                  <button
                    key={name}
                    onClick={() => setTemplate(() => Component)}
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

        <div
          className="relative mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-white shadow-xl"
          style={{ zoom }}
        >
          <Template cv={content} />
          {isEmpty && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
              <div className="max-w-xs text-center">
                <p className="text-lg font-medium text-neutral-800">
                  Sem se to bude propisovat živě ✨
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
