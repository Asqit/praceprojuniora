/* eslint-disable react/no-children-prop */
"use client"
import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Languages, X, Plus } from "lucide-react"
import { FormProps } from "./props"
import { CvDetails } from "../../types"
import { SectionHeading } from "./section-heading"

type Props = FormProps<"languages">

export function LanguagesForm({ initialValue, onChange }: Props) {
  const [initialFormValues] = useState(() => {
    const items = Object.entries(initialValue).map(([name, level]) => ({
      name,
      level,
    }))

    return {
      items,
    }
  })
  const form = useForm({
    defaultValues: initialFormValues,
    listeners: {
      onChange: ({ formApi }) => {
        const result: CvDetails["languages"] =
          formApi.state.values.items.reduce(
            (acc, it) => {
              acc[it.name] = it.level
              return acc
            },
            {} as CvDetails["languages"]
          )
        onChange(result)
      },
    },
  })

  return (
    <section id="languages-section" className="scroll-mt-20 py-7 sm:py-9">
      <SectionHeading
        icon={Languages}
        tone="cyan"
        title="V jakých jazycích se domluvíš?"
        description="Uveď jen jazyky a úroveň, za kterou si stojíš. Mateřský jazyk můžeš klidně vynechat."
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
                      <p className="text-sm text-muted-foreground">
                        Jazyky jsou nepovinné. Přidej je, pokud pomáhají pro
                        pozici, kterou hledáš.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Například angličtina pro dokumentaci nebo němčina pro
                        komunikaci se zákazníky.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          field.handleChange([{ name: "", level: "" }])
                        }
                      >
                        <Plus className="mr-1 h-4 w-4" /> Přidat první jazyk
                      </Button>
                    </div>
                  ) : (
                    <>
                      <FieldLabel className="text-sm">Jazyky</FieldLabel>
                      <ul className="space-y-2">
                        {field.state.value.map((it, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Input
                              value={it.name}
                              onChange={(e) => {
                                const next = [...(field.state.value ?? [])]
                                next[idx] = {
                                  ...next[idx],
                                  name: e.target.value,
                                }
                                field.handleChange(next)
                              }}
                              placeholder="Jazyk (např. Angličtina)"
                            />
                            <Input
                              value={it.level}
                              onChange={(e) => {
                                const next = [...(field.state.value ?? [])]
                                next[idx] = {
                                  ...next[idx],
                                  level: e.target.value,
                                }
                                field.handleChange(next)
                              }}
                              placeholder="Úroveň (např. B2)"
                            />
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
                            { name: "", level: "" },
                          ])
                        }
                      >
                        <Plus className="mr-1 h-4 w-4" /> Přidat jazyk
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

export default LanguagesForm
