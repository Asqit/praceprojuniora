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

const languageItemSchema = z.object({
  name: z.string().min(1, "Jazyk je povinný."),
  level: z.string().min(1, "Úroveň je povinná."),
})

const formSchema = z.object({
  items: z.array(languageItemSchema).min(1, "Přidejte alespoň jeden jazyk."),
})

type LanguagesFormValues = z.infer<typeof formSchema>

const defaultValues: LanguagesFormValues = {
  items: [
    {
      name: "Čeština",
      level: "Rodilý mluvčí",
    },
  ],
}

type Props = FormProps<"languages">

export function LanguagesForm({ submit }: Props) {
  const form = useForm({
    defaultValues,
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      const result: CvDetails["languages"] = value.items.reduce(
        (acc, it) => {
          acc[it.name] = it.level
          return acc
        },
        {} as CvDetails["languages"]
      )
      submit(result)
    },
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Jazyky</CardTitle>
        <CardDescription>Seznam jazyků a úrovní.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <form
          id="languages-form"
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
                  <FieldLabel className="text-sm">Jazyky</FieldLabel>
                  <ul className="space-y-2">
                    {(field.state.value ?? []).map((it, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Input
                          value={it.name}
                          onChange={(e) => {
                            const next = [...(field.state.value ?? [])]
                            next[idx] = { ...next[idx], name: e.target.value }
                            field.handleChange(next)
                          }}
                          placeholder="Jazyk (např. Angličtina)"
                        />
                        <Input
                          value={it.level}
                          onChange={(e) => {
                            const next = [...(field.state.value ?? [])]
                            next[idx] = { ...next[idx], level: e.target.value }
                            field.handleChange(next)
                          }}
                          placeholder="Úroveň (např. B2)"
                        />
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
                        { name: "", level: "" },
                      ])
                    }
                  >
                    <Plus className="mr-1 h-4 w-4" /> Přidat jazyk
                  </Button>

                  <FieldDescription>
                    Např. Čeština: Rodilý mluvčí, Angličtina: B2
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
              <Button type="submit" form="languages-form">
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

export default LanguagesForm
