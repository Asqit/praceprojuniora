"use client"
import type { CvTemplateName } from "../previewer/templates"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/share/navbar"
import { emptyCvDetails } from "../dummy-data"
import { CvDetails } from "../types"
import { Wizard } from "./wizard"

const DRAFT_STORAGE_KEY = "ppj:cv-builder:draft:v1"

interface CvDraft {
  version: 1
  details: CvDetails
  template: CvTemplateName
}

function isCvDraft(value: unknown): value is CvDraft {
  if (typeof value !== "object" || value === null) return false

  const draft = value as Partial<CvDraft>
  return (
    draft.version === 1 &&
    typeof draft.details === "object" &&
    draft.details !== null &&
    typeof draft.template === "string" &&
    Object.hasOwn(
      { default: true, aurora: true, nebula: true, cyber: true },
      draft.template
    )
  )
}

export function Builder() {
  const [details, setDetails] = useState<CvDetails>(emptyCvDetails)
  const [selectedTemplate, setSelectedTemplate] =
    useState<CvTemplateName>("default")
  const [draftReady, setDraftReady] = useState(false)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const url = new URL(window.location.href)
      if (url.searchParams.has("session")) {
        url.searchParams.delete("session")
        window.history.replaceState({}, "", url)
      }

      try {
        const saved = localStorage.getItem(DRAFT_STORAGE_KEY)
        if (saved) {
          const parsed: unknown = JSON.parse(saved)
          if (isCvDraft(parsed)) {
            setDetails(parsed.details)
            setSelectedTemplate(parsed.template)
          }
        }
      } catch (err) {
        console.error("Failed to restore CV draft:", err)
      }

      setDraftReady(true)
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!draftReady) return

    try {
      localStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({ version: 1, details, template: selectedTemplate })
      )
    } catch (err) {
      console.error("Failed to save CV draft:", err)
    }
  }, [details, draftReady, selectedTemplate])

  if (!draftReady) {
    return <div className="min-h-[70vh]" />
  }

  return (
    <div className="min-h-dvh bg-muted/30 pb-24">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl">
        <Wizard
          details={details}
          setDetails={setDetails}
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
        />
      </main>
    </div>
  )
}
