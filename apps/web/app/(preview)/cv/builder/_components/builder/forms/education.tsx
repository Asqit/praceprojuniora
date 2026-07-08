/* eslint-disable react/no-children-prop */
"use client"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus } from "lucide-react"
import { FormProps } from "./props"

const educationItemSchema = z.object({
  title: z.string().min(1, "Název instituce je povinný."),
  degree: z.string().min(1, "Studijní obor / stupeň je povinný."),
  startDate: z.string().min(1, "Datum zahájení je povinné."),
  endDate: z.string().optional(),
  description: z.string(),
})

const formSchema = z.object({
  items: z
    .array(educationItemSchema)
    .min(1, "Přidejte alespoň jedno vzdělání."),
})

type EducationFormValues = z.infer<typeof formSchema>

const defaultValues: EducationFormValues = {
  items: [
    {
      title: "",
      degree: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ],
}

type Props = FormProps<"education">

export function EducationForm({ submit }: Props) {
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      submit(value.items)
    },
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Vzdělání</CardTitle>
        <CardDescription>Seznam škol a studií.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <form
          id="education-form"
          className="scroll-mt-8"
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup className="grid gap-3">
            <form.Field
              name="items"
              children={(field) => (
                <Field className="gap-2">
                  <FieldLabel className="text-sm">Vzdělání</FieldLabel>
                  <ul className="space-y-4">
                    {(field.state.value ?? []).map((item, index) => (
                      <li key={index} className="space-y-2 rounded border p-3">
                        <div className="grid gap-2">
                          <div className="grid gap-1">
                            <FieldLabel className="text-sm">
                              Název instituce{" "}
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
                              placeholder="Název instituce (např. ČVUT)"
                            />
                          </div>
                          <div className="grid gap-1">
                            <FieldLabel className="text-sm">
                              Studijní obor / stupeň{" "}
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
                              placeholder="Studijní obor / stupeň"
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
                            disabled={(field.state.value ?? []).length <= 1}
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
                        ...(field.state.value ?? []),
                        { ...defaultValues.items[0] },
                      ])
                    }
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Přidat vzdělání
                  </Button>

                  <FieldDescription>Školy, kurzy, atd.</FieldDescription>
                </Field>
              )}
            />

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Resetovat
              </Button>
              <Button type="submit" form="education-form">
                Uložit
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2"></CardFooter>
    </Card>
  )
}

export default EducationForm
