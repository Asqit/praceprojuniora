/* eslint-disable react/no-children-prop */
"use client"
import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Wrench, X, Plus } from "lucide-react"
import { FormProps } from "./props"
import { CvDetails } from "../../types"
import { SectionHeading } from "./section-heading"

type Props = FormProps<"skills">

export function SkillsForm({ initialValue, onChange }: Props) {
  const [initialFormValues] = useState(() => {
    const items = Object.entries(initialValue).map(([category, skills]) => ({
      category,
      skills: [...skills],
    }))

    return {
      items,
    }
  })
  const form = useForm({
    defaultValues: initialFormValues,
    listeners: {
      onChange: ({ formApi }) => {
        const result: CvDetails["skills"] = formApi.state.values.items.reduce(
          (acc, it) => {
            acc[it.category] = it.skills
            return acc
          },
          {} as CvDetails["skills"]
        )
        onChange(result)
      },
    },
  })

  return (
    <section id="skills-section" className="scroll-mt-20 py-7 sm:py-9">
      <SectionHeading
        icon={Wrench}
        tone="rose"
        title="S čím umíš pracovat?"
        description="Nástroje, jazyky i postupy, které jsi opravdu použil. Nemusíš uvádět všechno, co znáš jen z doslechu."
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
                        Třeba programovací jazyky, frameworky, nástroje nebo
                        komunikace v týmu.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["Technologie", "Nástroje", "Spolupráce"].map(
                          (category) => (
                            <Button
                              key={category}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                field.handleChange([{ category, skills: [""] }])
                              }
                            >
                              <Plus className="mr-1 h-4 w-4" /> {category}
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <FieldLabel className="text-sm">
                        Kategorie dovedností
                      </FieldLabel>
                      <ul className="space-y-4">
                        {field.state.value.map((cat, idx) => (
                          <li
                            key={idx}
                            className="space-y-2 rounded border p-3"
                          >
                            <div className="flex gap-2">
                              <Input
                                value={cat.category}
                                onChange={(e) => {
                                  const next = [...(field.state.value ?? [])]
                                  next[idx] = {
                                    ...next[idx],
                                    category: e.target.value,
                                  }
                                  field.handleChange(next)
                                }}
                                placeholder="např. Programovací jazyky"
                              />
                            </div>

                            <div className="space-y-2">
                              {(cat.skills ?? []).map((s, si) => (
                                <div
                                  key={si}
                                  className="flex items-center gap-2"
                                >
                                  <Input
                                    value={s}
                                    onChange={(e) => {
                                      const next = [
                                        ...(field.state.value ?? []),
                                      ]
                                      next[idx] = {
                                        ...next[idx],
                                        skills: [...(next[idx].skills ?? [])],
                                      }
                                      next[idx].skills[si] = e.target.value
                                      field.handleChange(next)
                                    }}
                                    placeholder="např. TypeScript"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      const next = [
                                        ...(field.state.value ?? []),
                                      ]
                                      next[idx] = {
                                        ...next[idx],
                                        skills: (next[idx].skills ?? []).filter(
                                          (_, i) => i !== si
                                        ),
                                      }
                                      field.handleChange(next)
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}

                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const next = [...(field.state.value ?? [])]
                                  next[idx] = {
                                    ...next[idx],
                                    skills: [...(next[idx].skills ?? []), ""],
                                  }
                                  field.handleChange(next)
                                }}
                              >
                                <Plus className="mr-1 h-4 w-4" /> Přidat
                                dovednost
                              </Button>
                            </div>

                            <div className="flex justify-end">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const next = (field.state.value ?? []).filter(
                                    (_, i) => i !== idx
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
                            { category: "", skills: [""] },
                          ])
                        }
                      >
                        <Plus className="mr-1 h-4 w-4" /> Přidat oblast
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

export default SkillsForm
