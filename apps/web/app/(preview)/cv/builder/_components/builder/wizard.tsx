"use client"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Link from "next/link"
import { CvDetails } from "../types"
import { PersonalForm } from "./forms/personal"
import { EducationForm } from "./forms/education"
import { ExperiencesForm } from "./forms/experiences"
import { SkillsForm } from "./forms/skills"
import { LanguagesForm } from "./forms/languages"
import { dummyCvDetails } from "../dummy-data"
import { Button } from "@/components/ui/button"
import { Brand } from "@/components/share/brand"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Props {
  setDetails: Dispatch<SetStateAction<CvDetails>>
  details: CvDetails
}

const stateLookup: Record<keyof CvDetails, number> = {
  personal: 1,
  education: 2,
  experiences: 3,
  skills: 4,
  languages: 5,
}

export function Wizard({ details, setDetails }: Props) {
  const [step, setStep] = useState<keyof CvDetails>("personal")
  const [demoOn, setDemoOn] = useState(false)
  const [savedDetails, setSavedDetails] = useState<CvDetails | null>(null)
  const [exitConfirm, setExitConfirm] = useState(false)

  const toggleDemo = () => {
    if (!demoOn) {
      setSavedDetails(details)
      setDetails(dummyCvDetails)
      setDemoOn(true)
    } else {
      setDetails(savedDetails ?? details)
      setDemoOn(false)
    }
  }

  // On mount, set step from URL hash if present
  useEffect(() => {
    if (typeof window === "undefined") return
    const hash = window.location.hash.replace("#", "") as keyof CvDetails
    if (hash && Object.prototype.hasOwnProperty.call(stateLookup, hash)) {
      ;(() => setStep(hash))()
    }
  }, [])

  // Whenever step changes, update URL hash and scroll to the form element
  useEffect(() => {
    if (typeof window === "undefined") return
    const hash = `#${step}`
    if (window.location.hash !== hash) {
      try {
        window.location.hash = hash
      } catch {
        // ignore
      }
    }

    const el = document.getElementById(`${step}-form`)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [step])

  return (
    <>
      {/* Brand and Navigation - Sticky Top */}
      <div className="sticky top-0 z-50 mb-6 border-b bg-background px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="origin-left scale-50">
            <Brand />
          </div>
          <nav>
            <ul className="flex gap-4">
              <li>
                <Link
                  href="/"
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Nabídky
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  O Nás
                </Link>
              </li>
              <li>
                <Link
                  href="/bookmarks"
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Záložky
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Onboarding Helper - Sticky Top */}
      <div className="sticky top-14 z-40 mb-6 flex items-center justify-between border-b bg-background px-5 py-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold">Postav si CV krok za krokem</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Vyplňuj postupně, vpravo vidíš živě, jak to vypadá.
          </p>
        </div>
        <div className="ml-6 flex shrink-0 flex-col gap-2">
          <Button onClick={toggleDemo} variant="outline" size="sm">
            {demoOn ? "Vrátit" : "Vzor"}
          </Button>
          <Button
            onClick={() => setExitConfirm(true)}
            variant="destructive"
            size="sm"
          >
            Ukončit builder
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4">
        {Object.keys(stateLookup).map((k) => {
          const key = k as unknown as keyof CvDetails
          if (stateLookup[key] <= stateLookup[step]) {
            switch (key) {
              case "personal":
                return (
                  <PersonalForm
                    submit={(value) => {
                      setDetails((p) => ({
                        ...p,
                        personal: value,
                      }))
                      setStep("education")
                    }}
                  />
                )
              case "education":
                return (
                  <EducationForm
                    submit={(value) => {
                      setDetails((p) => ({
                        ...p,
                        education: value,
                      }))
                      setStep("experiences")
                    }}
                  />
                )
              case "experiences":
                return (
                  <ExperiencesForm
                    submit={(value) => {
                      setDetails((p) => ({
                        ...p,
                        experiences: value,
                      }))
                      setStep("skills")
                    }}
                  />
                )
              case "skills":
                return (
                  <SkillsForm
                    submit={(value) => {
                      setDetails((p) => ({
                        ...p,
                        skills: value,
                      }))
                      setStep("languages")
                    }}
                  />
                )
              case "languages":
                return (
                  <LanguagesForm
                    submit={(value) => {
                      setDetails((p) => ({
                        ...p,
                        languages: value,
                      }))
                    }}
                  />
                )
            }
          }

          return null
        })}
      </div>

      {/* Footer - Normal grid item */}
      <div className="mt-8 border-t bg-background px-5 py-3">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} praceprojuniora.cz
        </p>
      </div>

      <AlertDialog open={exitConfirm} onOpenChange={setExitConfirm}>
        <AlertDialogContent>
          <AlertDialogTitle>Opravdu chceš ukončit builder?</AlertDialogTitle>
          <AlertDialogDescription>
            Případné neuložené změny budou ztraceny.
          </AlertDialogDescription>
          <div className="flex gap-3">
            <AlertDialogCancel>Zůstat</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href="/">Opustit</Link>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
