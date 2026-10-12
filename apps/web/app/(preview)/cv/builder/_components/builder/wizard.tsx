"use client"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  Eye,
  Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { CvDetails } from "../types"
import { CvTemplateName } from "../previewer/templates"
import { Previewer } from "../previewer"
import { PersonalForm } from "./forms/personal"
import { ExperiencesForm } from "./forms/experiences"
import { EducationForm } from "./forms/education"
import { SkillsForm } from "./forms/skills"
import { LanguagesForm } from "./forms/languages"
import { dummyCvDetails, emptyCvDetails } from "../dummy-data"

type StepId =
  | "personal"
  | "experiences"
  | "education"
  | "skills"
  | "languages"
  | "review"
  | "preview"

const steps: { id: StepId; label: string }[] = [
  { id: "personal", label: "Kontakt" },
  { id: "experiences", label: "Projekty" },
  { id: "education", label: "Vzdělání" },
  { id: "skills", label: "Dovednosti" },
  { id: "languages", label: "Jazyky" },
  { id: "review", label: "Kontrola" },
  { id: "preview", label: "Náhled a export" },
]
const optionalSteps: StepId[] = [
  "experiences",
  "education",
  "skills",
  "languages",
]

interface Props {
  setDetails: Dispatch<SetStateAction<CvDetails>>
  details: CvDetails
  selectedTemplate: CvTemplateName
  onTemplateChange(template: CvTemplateName): void
}

export function Wizard({
  details,
  setDetails,
  selectedTemplate,
  onTemplateChange,
}: Props) {
  const [step, setStep] = useState<StepId>("personal")
  const [previewOpen, setPreviewOpen] = useState(false)
  const [returnToReviewAfterEdit, setReturnToReviewAfterEdit] = useState(false)
  const [demoOn, setDemoOn] = useState(false)
  const [savedDetails, setSavedDetails] = useState<CvDetails | null>(null)
  const [formVersion, setFormVersion] = useState(0)
  const stepIndex = steps.findIndex((item) => item.id === step)
  const stepLabel = steps[stepIndex]?.label ?? "Kontakt"
  const firstName = details.personal.firstName.trim()
  const fullName = [details.personal.firstName, details.personal.lastName]
    .filter(Boolean)
    .join(" ")

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [step])

  const goForward = () => {
    if (returnToReviewAfterEdit) {
      setReturnToReviewAfterEdit(false)
      setStep("review")
      return
    }

    const nextStep = steps[stepIndex + 1]
    if (nextStep) {
      setPreviewOpen(false)
      setStep(nextStep.id)
    }
  }

  const goBack = () => {
    if (returnToReviewAfterEdit) setReturnToReviewAfterEdit(false)
    const previousStep = steps[stepIndex - 1]
    if (previousStep) setStep(previousStep.id)
  }

  const goToStep = (nextStep: StepId) => {
    setPreviewOpen(false)
    setReturnToReviewAfterEdit(false)
    setStep(nextStep)
  }

  const toggleDemo = () => {
    if (demoOn) {
      setDetails(savedDetails ?? emptyCvDetails)
    } else {
      setSavedDetails(details)
      setDetails(dummyCvDetails)
    }

    setDemoOn(!demoOn)
    setFormVersion((version) => version + 1)
  }

  return (
    <div
      className={
        step === "preview"
          ? "relative left-1/2 flex h-[calc(100dvh-4.5rem)] min-h-[26rem] w-[96vw] max-w-[90rem] -translate-x-1/2 flex-col px-2 pt-4 pb-4 sm:px-4 sm:pt-5"
          : "px-5 pt-7 pb-44 sm:px-9 sm:pt-10 md:px-12 md:pt-12"
      }
    >
      {step === "preview" ? (
        <>
          <header className="mb-3 flex shrink-0 items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold">Podívej, co už máš.</h1>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {fullName
                  ? `Tvoje CV, ${firstName}. Vyber šablonu a stáhni si ho.`
                  : "Vyber šablonu, nebo se vrať ke kontrole a doplň své údaje."}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep("review")}
              className="shrink-0"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Zpět ke kontrole</span>
              <span className="sm:hidden">Zpět</span>
            </Button>
          </header>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden border bg-background">
            <Previewer
              content={details}
              selectedTemplate={selectedTemplate}
              onTemplateChange={onTemplateChange}
            />
          </div>
        </>
      ) : (
        <>
          <header className="mb-7 flex flex-col gap-5 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="mt-2 text-3xl font-semibold">
                {firstName ? `Ahoj, ${firstName}!` : "Ahoj!"}
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Doplň jen to, co pro tebe dává smysl. I vlastní projekt se
                počítá.
              </p>
            </div>
            <Button onClick={toggleDemo} variant="outline" size="sm">
              {demoOn ? "Vrátit moje CV" : "Načíst vzor"}
            </Button>
          </header>

          <div className="min-h-[300px]">
            {step === "personal" && (
              <PersonalForm
                key={`personal-${formVersion}`}
                initialValue={details.personal}
                onChange={(personal) =>
                  setDetails((current) => ({ ...current, personal }))
                }
              />
            )}
            {step === "experiences" && (
              <ExperiencesForm
                key={`experiences-${formVersion}`}
                initialValue={details.experiences}
                onChange={(experiences) =>
                  setDetails((current) => ({ ...current, experiences }))
                }
              />
            )}
            {step === "education" && (
              <EducationForm
                key={`education-${formVersion}`}
                initialValue={details.education}
                onChange={(education) =>
                  setDetails((current) => ({ ...current, education }))
                }
              />
            )}
            {step === "skills" && (
              <SkillsForm
                key={`skills-${formVersion}`}
                initialValue={details.skills}
                onChange={(skills) =>
                  setDetails((current) => ({ ...current, skills }))
                }
              />
            )}
            {step === "languages" && (
              <LanguagesForm
                key={`languages-${formVersion}`}
                initialValue={details.languages}
                onChange={(languages) =>
                  setDetails((current) => ({ ...current, languages }))
                }
              />
            )}
            {step === "review" && (
              <ReviewStep
                details={details}
                onEdit={(section) => {
                  setReturnToReviewAfterEdit(true)
                  setStep(section)
                }}
              />
            )}
          </div>
        </>
      )}

      {step !== "preview" && (
        <>
          <footer
            className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-4 pt-2 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur"
            style={{
              paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
            }}
          >
            <div className="mx-auto max-w-3xl">
              <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{stepLabel}</span>
                <span>
                  {stepIndex + 1} / {steps.length}
                </span>
              </div>
              <nav
                aria-label="Přejít na krok"
                className="grid grid-cols-7 gap-1"
              >
                {steps.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Krok ${index + 1}: ${item.label}`}
                    aria-current={index === stepIndex ? "step" : undefined}
                    onClick={() => goToStep(item.id)}
                    className="group flex min-h-8 min-w-0 items-center focus-visible:outline-none"
                  >
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-full rounded-full transition-colors group-hover:bg-primary/70 group-focus-visible:ring-2 group-focus-visible:ring-ring ${index <= stepIndex ? "bg-primary" : "bg-border"}`}
                    />
                  </button>
                ))}
              </nav>
              <div className="mt-1 flex items-center justify-between gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBack}
                  disabled={stepIndex === 0}
                  className="shrink-0"
                >
                  <ArrowLeft className="size-4" />
                  Zpět
                </Button>
                <div className="flex min-w-0 items-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewOpen(true)}
                    className="shrink-0 gap-1 sm:gap-2"
                  >
                    <Eye className="size-4" />
                    Náhled
                  </Button>
                  {optionalSteps.includes(step) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={goForward}
                      className="shrink-0 px-2 sm:px-3"
                    >
                      Přeskočit
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={goForward}
                    className="shrink-0 gap-1 px-2 sm:gap-2 sm:px-3"
                  >
                    <span className="hidden sm:inline">
                      {step === "review"
                        ? "Pokračovat k náhledu"
                        : "Pokračovat"}
                    </span>
                    <span className="sm:hidden">Dál</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </footer>

          <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
            <SheetContent
              side="right"
              showCloseButton={false}
              className="!w-full !max-w-none gap-0 overflow-hidden p-0 sm:!w-[min(92vw,920px)]"
            >
              <SheetHeader className="shrink-0 border-b px-4 py-3">
                <div className="flex items-center justify-between gap-4 pr-10 sm:pr-0">
                  <div className="min-w-0">
                    <SheetTitle className="text-base">Náhled CV</SheetTitle>
                    <SheetDescription className="truncate">
                      {fullName || "Nový životopis"}
                    </SheetDescription>
                  </div>
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 gap-2"
                    >
                      Pokračovat ve vyplňování
                    </Button>
                  </SheetClose>
                </div>
              </SheetHeader>
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <Previewer
                  content={details}
                  selectedTemplate={selectedTemplate}
                  onTemplateChange={onTemplateChange}
                />
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}
    </div>
  )
}

interface ReviewStepProps {
  details: CvDetails
  onEdit(step: StepId): void
}

function ReviewStep({ details, onEdit }: ReviewStepProps) {
  const name = [
    details.personal.firstName,
    details.personal.middleName,
    details.personal.lastName,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div>
      <div className="mb-5 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <ClipboardCheck aria-hidden="true" className="size-5" />
        </span>
        <div>
          <h2 className="text-xl font-semibold">Tvoje CV, přehledně</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ještě něco upravit? Vrať se přímo k dané části. Prázdné sekce můžeš
            nechat být.
          </p>
        </div>
      </div>

      <div className="divide-y divide-border/70 border-y border-border/70">
        <ReviewSection
          title="Kontakt"
          values={[
            name,
            details.personal.email,
            details.personal.phone,
            details.personal.address,
            ...(details.personal.links ?? []),
          ].filter(Boolean)}
          emptyLabel="Zatím bez kontaktních údajů"
          onEdit={() => onEdit("personal")}
        />
        <ReviewSection
          title="Projekty a zkušenosti"
          values={details.experiences.map((item) =>
            [
              item.role,
              item.title,
              item.startDate,
              item.endDate,
              item.description,
            ]
              .filter(Boolean)
              .join(" · ")
          )}
          emptyLabel="Tuhle část jsi přeskočil"
          onEdit={() => onEdit("experiences")}
        />
        <ReviewSection
          title="Vzdělání"
          values={details.education.map((item) =>
            [item.degree, item.title, item.startDate, item.endDate]
              .filter(Boolean)
              .join(" · ")
          )}
          emptyLabel="Tuhle část jsi přeskočil"
          onEdit={() => onEdit("education")}
        />
        <ReviewSection
          title="Dovednosti"
          values={Object.entries(details.skills).map(
            ([category, skills]) => `${category}: ${skills.join(", ")}`
          )}
          emptyLabel="Tuhle část jsi přeskočil"
          onEdit={() => onEdit("skills")}
        />
        <ReviewSection
          title="Jazyky"
          values={Object.entries(details.languages).map(
            ([language, level]) => `${language}: ${level}`
          )}
          emptyLabel="Tuhle část jsi přeskočil"
          onEdit={() => onEdit("languages")}
        />
      </div>
    </div>
  )
}

interface ReviewSectionProps {
  title: string
  values: string[]
  emptyLabel: string
  onEdit(): void
}

function ReviewSection({
  title,
  values,
  emptyLabel,
  onEdit,
}: ReviewSectionProps) {
  return (
    <section className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h3 className="font-medium">{title}</h3>
        {values.length > 0 ? (
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {values.map((value, index) => (
              <li key={`${value}-${index}`} className="break-words">
                {value}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">{emptyLabel}</p>
        )}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="shrink-0 self-start"
        onClick={onEdit}
      >
        <Pencil className="size-4" />
        Upravit
      </Button>
    </section>
  )
}
