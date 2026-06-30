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
import { X, Plus } from "lucide-react"
import { FormProps } from "./props"
import { CvDetails } from "../../types"

const skillCategorySchema = z.object({
  category: z.string().min(1, "Kategorie je povinná."),
  skills: z
    .array(z.string().min(1, "Dovednost je povinná."))
    .min(1, "Přidejte alespoň jednu dovednost."),
})

const formSchema = z.object({
  items: z
    .array(skillCategorySchema)
    .min(1, "Přidejte alespoň jednu kategorii dovedností."),
})

type SkillsFormValues = z.infer<typeof formSchema>

const defaultValues: SkillsFormValues = {
  items: [
    {
      category: "Frontend",
      skills: ["React"],
    },
  ],
}

type Props = FormProps<"skills">

export function SkillsForm({ submit }: Props) {
  const form = useForm({
    defaultValues,
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      const result: CvDetails["skills"] = value.items.reduce(
        (acc, it) => {
          acc[it.category] = it.skills
          return acc
        },
        {} as CvDetails["skills"]
      )
      submit(result)
    },
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Dovednosti</CardTitle>
        <CardDescription>Kategorie a seznam dovedností.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <form
          id="skills-form"
          className="scroll-mt-8"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup className="grid gap-3">
            <form.Field
              name="items"
              children={(field) => (
                <Field className="gap-2">
                  <FieldLabel className="text-sm">
                    Kategorie dovedností
                  </FieldLabel>
                  <ul className="space-y-4">
                    {(field.state.value ?? []).map((cat, idx) => (
                      <li key={idx} className="space-y-2 rounded border p-3">
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
                            placeholder="Kategorie (např. Frontend)"
                          />
                        </div>

                        <div className="space-y-2">
                          {(cat.skills ?? []).map((s, si) => (
                            <div key={si} className="flex items-center gap-2">
                              <Input
                                value={s}
                                onChange={(e) => {
                                  const next = [...(field.state.value ?? [])]
                                  next[idx] = {
                                    ...next[idx],
                                    skills: [...(next[idx].skills ?? [])],
                                  }
                                  next[idx].skills[si] = e.target.value
                                  field.handleChange(next)
                                }}
                                placeholder="Dovednost (např. TypeScript)"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                disabled={(cat.skills ?? []).length <= 1}
                                onClick={() => {
                                  const next = [...(field.state.value ?? [])]
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
                            <Plus className="mr-1 h-4 w-4" /> Přidat dovednost
                          </Button>
                        </div>

                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={(field.state.value ?? []).length <= 1}
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
                        ...(field.state.value ?? []),
                        { category: "", skills: [""] },
                      ])
                    }
                  >
                    <Plus className="mr-1 h-4 w-4" /> Přidat kategorii
                  </Button>

                  <FieldDescription>
                    Rozdělte dovednosti do kategorií (Frontend, Backend...)
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
              <Button type="submit" form="skills-form">
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

export default SkillsForm
