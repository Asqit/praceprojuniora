"use client"
import type { CvTemplateName } from "../previewer/templates"
import { useEffect, useRef, useState } from "react"
import { emptyCvDetails } from "../dummy-data"
import { Previewer } from "../previewer"
import { CvDetails } from "../types"
import { http } from "@/lib/http"
import { trackUmami } from "@/lib/umami"
import { Wizard } from "./wizard"

export function Builder() {
  const [details, setDetails] = useState<CvDetails>(emptyCvDetails)
  const [selectedTemplate, setSelectedTemplate] =
    useState<CvTemplateName>("default")
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [sessionReady, setSessionReady] = useState(false)
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)")
    const update = () => setIsDesktop(media.matches)

    update()
    media.addEventListener("change", update)

    return () => media.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (isDesktop !== true) return
    if (initializedRef.current) return
    initializedRef.current = true

    const initialize = async () => {
      const params = new URLSearchParams(window.location.search)
      const token = params.get("session")

      if (token) {
        try {
          const res = await http(`cv/session/${encodeURIComponent(token)}`)
          const parsed = (await res.json()) as {
            session: { data: CvDetails; template: CvTemplateName }
          }

          setSessionToken(token)
          setDetails(parsed.session.data)
          setSelectedTemplate(parsed.session.template)
          trackUmami("cv-session-restored", {
            template: parsed.session.template,
          })
          setSessionReady(true)
          return
        } catch {
          // invalid or expired session; continue with creating a fresh one
        }
      }

      const res = await http("cv/session", {
        method: "POST",
        body: JSON.stringify({
          data: emptyCvDetails,
          template: "default",
        }),
      })
      const parsed = (await res.json()) as { sessionToken: string }
      setSessionToken(parsed.sessionToken)
      trackUmami("cv-session-created", {
        template: "default",
      })
      setSessionReady(true)

      const next = new URL(window.location.href)
      next.searchParams.set("session", parsed.sessionToken)
      window.history.replaceState({}, "", next.toString())
    }

    initialize().catch((err) => {
      console.error("Failed to initialize CV session:", err)
      trackUmami("cv-session-init-failed")
      setSessionReady(true)
    })
  }, [isDesktop])

  useEffect(() => {
    if (isDesktop !== true) return
    if (!sessionReady || !sessionToken) return

    const timeout = window.setTimeout(() => {
      http(`cv/session/${encodeURIComponent(sessionToken)}`, {
        method: "PUT",
        body: JSON.stringify({
          data: details,
          template: selectedTemplate,
        }),
      }).catch((err) => {
        console.error("Failed to autosave CV session:", err)
      })
    }, 600)

    return () => window.clearTimeout(timeout)
  }, [details, isDesktop, selectedTemplate, sessionReady, sessionToken])

  if (isDesktop === null) {
    return <div className="min-h-[70vh]" />
  }

  if (!isDesktop) {
    return (
      <section className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center justify-center px-6 py-12">
        <div className="w-full border bg-background p-8 text-center shadow-sm">
          <p className="text-xs font-semibold tracking-[0.28em] text-muted-foreground uppercase">
            CV Builder
          </p>
          <h1 className="mt-3 text-2xl font-semibold">
            Dostupne jen na desktopu
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Editor CV je zatim optimalizovany jen pro vetsi obrazovky. Otevri ho
            prosim na desktopu nebo notebooku.
          </p>
          <a
            href="/cv"
            className="mt-6 inline-flex border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Zpet na CV stranku
          </a>
        </div>
      </section>
    )
  }

  return (
    <div className="flex max-h-screen flex-col overflow-hidden md:flex-row">
      <main className="w-full overflow-y-scroll pb-6 md:w-1/3">
        <Wizard details={details} setDetails={setDetails} />
      </main>
      <aside className="group relative flex flex-col overflow-y-scroll border-l bg-muted md:w-2/3">
        <Previewer
          content={details}
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
          sessionToken={sessionToken}
        />
      </aside>
    </div>
  )
}
