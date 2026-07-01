"use client"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { CvDetails } from "../types"
import { PersonalForm } from "./forms/personal"
import { EducationForm } from "./forms/education"
import { ExperiencesForm } from "./forms/experiences"
import { SkillsForm } from "./forms/skills"
import { LanguagesForm } from "./forms/languages"
import { dummyCvDetails } from "../dummy-data"
import { Button } from "@/components/ui/button"

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
      <div className="mb-6 flex items-center justify-between rounded-2xl border bg-muted p-5">
        <div>
          <h2 className="text-lg font-semibold">Postav si CV krok za krokem</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Vyplňuj postupně, vpravo vidíš živě, jak to vypadá.
          </p>
        </div>
        <Button onClick={toggleDemo} variant={"default"}>
          {demoOn ? "Vrátit svoje údaje" : "Ukázat mi vzor"}
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4">
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
    </>
  )
}
