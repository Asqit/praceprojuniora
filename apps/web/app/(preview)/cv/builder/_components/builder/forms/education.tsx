/* eslint-disable react/no-children-prop */
"use client"
import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { GraduationCap, X, Plus } from "lucide-react"
import { FormProps } from "./props"
import { SectionHeading } from "./section-heading"
import type { CvDetails } from "../../types"

const emptyEducation: CvDetails["education"][number] = {
  title: "",
  degree: "",
  startDate: "",
  endDate: "",
  description: "",
}

type Props = FormProps<"education">

export function EducationForm({ initialValue, onChange }: Props) {
  const [initialFormValues] = useState(() => ({
    items:
      initialValue.length > 0 ? initialValue.map((item) => ({ ...item })) : [],
  }))
  const form = useForm({
    defaultValues: initialFormValues,
    listeners: {
      onChange: ({ formApi }) => {
        onChange(formApi.state.values.items)
      },
    },
  })

  return (
    <section id="education-section" className="scroll-mt-20 py-7 sm:py-9">
      <SectionHeading
        icon={GraduationCap}
        tone="blue"
        title="Co ses naučil?"
        description="Škola, kurz nebo certifikát. Tuhle část můžeš klidně přeskočit."
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
                        Uveď obor nebo téma, které se hodí k práci, kterou
                        hledáš. Nemusíš vypisovat každou školu.
                      </p>
                      <details className="max-w-xl text-sm">
                        <summary className="w-fit cursor-pointer text-primary underline-offset-4 hover:underline">
                          Ukázky, co sem patří
                        </summary>
                        <p className="mt-2 text-muted-foreground">
                          Střední škola se zaměřením na IT, online kurz Reactu
                          nebo certifikát Cisco.
                        </p>
                      </details>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          field.handleChange([{ ...emptyEducation }])
                        }
                      >
                        <Plus className="mr-1 h-4 w-4" /> Přidat školu nebo kurz
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
                                  Škola nebo kurz{" "}
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
                                  placeholder="např. SPŠE České Budějovice"
                                />
                              </div>
                              <div className="grid gap-1">
                                <FieldLabel className="text-sm">
                                  Obor nebo zaměření{" "}
                                  <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                  value={item.degree}
                                  onChange={(e) => {
                                    const next = [...(field.state.value ?? [])]
                                    next[index] = {
                                      ...next[index],
                                      degree: e.target.value,
                                    }
                                    field.handleChange(next)
                                  }}
                                  placeholder="např. Informační technologie"
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
                              placeholder="Krátký popis (např. zaměření)"
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
                            { ...emptyEducation },
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

export default EducationForm
