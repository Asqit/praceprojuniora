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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus } from "lucide-react"
import { FormProps } from "./props"
import { CvDetails } from "../../types"

const experienceItemSchema = z.object({
  title: z.string().min(1, "Název zaměstnavatele je povinný."),
  role: z.string().min(1, "Pozice je povinná."),
  startDate: z.string().min(1, "Datum zahájení je povinné."),
  endDate: z.string().optional(),
  description: z.string().optional(),
})

const formSchema = z.object({
  items: z
    .array(experienceItemSchema)
    .min(1, "Přidejte alespoň jednu zkušenost."),
})

type ExperiencesFormValues = z.infer<typeof formSchema>

const defaultValues: ExperiencesFormValues = {
  items: [
    {
      title: "",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ],
}

type Props = FormProps<"experiences">

export function ExperiencesForm({ submit }: Props) {
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      // TODO: Fix types
      submit(value.items as any)
    },
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Zkušenosti</CardTitle>
        <CardDescription>Seznam pracovních zkušeností.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <form
          id="experiences-form"
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
                  <FieldLabel className="text-sm">Zkušenosti</FieldLabel>
                  <ul className="space-y-4">
                    {(field.state.value ?? []).map((item, index) => (
                      <li key={index} className="space-y-2 rounded border p-3">
                        <div className="grid gap-2">
                          <div className="grid gap-1">
                            <FieldLabel className="text-sm">
                              Název zaměstnavatele{" "}
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
                              placeholder="Název zaměstnavatele"
                            />
                          </div>
                          <div className="grid gap-1">
                            <FieldLabel className="text-sm">
                              Pozice <span className="text-destructive">*</span>
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
                              placeholder="Pozice (např. Junior Developer)"
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
                          placeholder="Popis role a odpovědností"
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
                    Přidat zkušenost
                  </Button>

                  <FieldDescription>
                    Pracovní zkušenosti, stáže, projekty.
                  </FieldDescription>
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
              <Button type="submit" form="experiences-form">
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

export default ExperiencesForm
