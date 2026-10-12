/* eslint-disable react/no-children-prop */
"use client"
import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Code2, X, Plus } from "lucide-react"
import { FormProps } from "./props"
import { CvDetails } from "../../types"
import { SectionHeading } from "./section-heading"

const emptyExperience: CvDetails["experiences"][number] = {
  title: "",
  role: "",
  startDate: "",
  endDate: "",
  description: "",
}

type Props = FormProps<"experiences">

export function ExperiencesForm({ initialValue, onChange }: Props) {
  const [initialFormValues] = useState(() => ({
    items:
      initialValue.length > 0 ? initialValue.map((item) => ({ ...item })) : [],
  }))
  const form = useForm({
    defaultValues: initialFormValues,
    listeners: {
      onChange: ({ formApi }) => {
        onChange(
          formApi.state.values.items.map((item) => ({
            ...item,
            description: item.description ?? "",
          }))
        )
      },
    },
  })

  return (
    <section id="experiences-section" className="scroll-mt-20 py-7 sm:py-9">
      <SectionHeading
        icon={Code2}
        tone="amber"
        title="Co už máš za sebou?"
        description="Započítají se i školní a vlastní projekty, stáž nebo brigáda. Vyber, co nejlépe ukazuje, co umíš a jaký přínos můžeš nabídnout."
      />
      <div className="space-y-3">
        <div>
          <FieldGroup className="grid gap-3">
            <form.Field
              name="items"
              children={(field) => (
                <Field className="gap-2">
                  {field.state.value.length === 0 ? (
                    <div className="space-y-3 border border-dashed border-border px-4 py-5">
                      <p className="max-w-xl text-sm text-muted-foreground">
                        Začni projektem, který jsi dokončil. Napiš, co jsi
                        vytvořil, čím a jaký to mělo výsledek.
                      </p>
                      <details className="max-w-xl text-sm">
                        <summary className="w-fit cursor-pointer text-primary underline-offset-4 hover:underline">
                          Co se počítá jako zkušenost?
                        </summary>
                        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                          <li>Školní nebo vlastní aplikace</li>
                          <li>Hackathon, stáž nebo dobrovolnictví</li>
                          <li>Příspěvek do open-source projektu</li>
                        </ul>
                      </details>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          field.handleChange([{ ...emptyExperience }])
                        }
                      >
                        <Plus className="mr-1 h-4 w-4" /> Přidat projekt nebo
                        práci
                      </Button>
                    </div>
                  ) : (
                    <>
                      <ul className="space-y-4">
                        {field.state.value.map((item, index) => (
                          <li
                            key={index}
                            className="space-y-2 rounded border p-3"
                          >
                            <div className="grid gap-2">
                              <div className="grid gap-1">
                                <FieldLabel className="text-sm">
                                  Projekt nebo firma{" "}
                                  <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                  value={item.title}
                                  onChange={(e) => {
                                    const next = [...(field.state.value ?? [])]
                                    next[index] = {
                                      ...next[index],
                                      title: e.target.value,
                                    }
                                    field.handleChange(next)
                                  }}
                                  placeholder="např. Vlastní portfolio"
                                />
                              </div>
                              <div className="grid gap-1">
                                <FieldLabel className="text-sm">
                                  Tvoje role{" "}
                                  <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                  value={item.role}
                                  onChange={(e) => {
                                    const next = [...(field.state.value ?? [])]
                                    next[index] = {
                                      ...next[index],
                                      role: e.target.value,
                                    }
                                    field.handleChange(next)
                                  }}
                                  placeholder="např. Návrh a vývoj"
                                />
                              </div>
                            </div>

                            <div className="grid gap-2">
                              <div className="grid gap-1">
                                <FieldLabel className="text-sm">
                                  Začátek{" "}
                                  <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                  value={item.startDate}
                                  onChange={(e) => {
                                    const next = [...(field.state.value ?? [])]
                                    next[index] = {
                                      ...next[index],
                                      startDate: e.target.value,
                                    }
                                    field.handleChange(next)
                                  }}
                                  placeholder="Začátek (YYYY-MM)"
                                />
                              </div>
                              <div className="grid gap-1">
                                <FieldLabel className="text-sm">
                                  Konec{" "}
                                  <span className="text-muted-foreground">
                                    (volitelné)
                                  </span>
                                </FieldLabel>
                                <Input
                                  value={item.endDate}
                                  onChange={(e) => {
                                    const next = [...(field.state.value ?? [])]
                                    next[index] = {
                                      ...next[index],
                                      endDate: e.target.value,
                                    }
                                    field.handleChange(next)
                                  }}
                                  placeholder="Konec (YYYY-MM) — volitelné"
                                />
                              </div>
                            </div>

                            <Textarea
                              value={item.description}
                              onChange={(e) => {
                                const next = [...(field.state.value ?? [])]
                                next[index] = {
                                  ...next[index],
                                  description: e.target.value,
                                }
                                field.handleChange(next)
                              }}
                              placeholder="Co jsi vytvořil nebo zlepšil? Čím? Jaký byl výsledek?"
                              rows={2}
                            />

                            <div className="flex justify-end">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const next = (field.state.value ?? []).filter(
                                    (_, i) => i !== index
                                  )
                                  field.handleChange(next)
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2 w-fit"
                        onClick={() =>
                          field.handleChange([
                            ...field.state.value,
                            { ...emptyExperience },
                          ])
                        }
                      >
                        <Plus className="mr-1 h-4 w-4" /> Přidat další
                      </Button>
                    </>
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </div>
      </div>
    </section>
  )
}

export default ExperiencesForm
