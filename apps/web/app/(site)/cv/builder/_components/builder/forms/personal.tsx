"use client"
/* eslint-disable react/no-children-prop */
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

const formSchema = z.object({
  firstName: z.string().min(1, "Jméno je povinné."),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Příjmení je povinné."),
  address: z.string().min(4, "Adresa je povinná."),
  email: z.email("Zadejte platný e-mail."),
  phone: z.string().min(7, "Telefon je povinný."),
  links: z.array(z.url("Zadejte platnou URL.")).optional(),
  summary: z.string().optional(),
})

type PersonalFormValues = z.infer<typeof formSchema>

const defaultValues: PersonalFormValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  address: "",
  email: "",
  phone: "",
  links: [],
  summary: "",
}

type Props = FormProps<"personal">

export function PersonalForm({ submit }: Props) {
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      submit(value satisfies CvDetails["personal"])
    },
  })

  console.log(form.state.errors)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Osobní údaje</CardTitle>
        <CardDescription>
          Vyplňte kontaktní údaje, které se zobrazí v hlavičce životopisu.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <form
          id="personal-form"
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup className="grid gap-3">
            {/* 1. Celý řádek: Jméno | Prostřední | Příjmení */}
            <div className="grid grid-cols-3 gap-3">
              <form.Field
                name="firstName"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field className="gap-2" data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name} className="text-sm">
                        Jméno
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Jan"
                        autoComplete="given-name"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
              <form.Field
                name="middleName"
                children={(field) => (
                  <Field className="gap-2">
                    <FieldLabel htmlFor={field.name} className="text-sm">
                      Prostřední jméno
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Nepovinné"
                      autoComplete="additional-name"
                    />
                  </Field>
                )}
              />
              <form.Field
                name="lastName"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field className="gap-2" data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name} className="text-sm">
                        Příjmení
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Novák"
                        autoComplete="family-name"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </div>

            {/* 2. Email + Telefon vedle sebe */}
            <div className="grid grid-cols-2 gap-3">
              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field className="gap-2" data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name} className="text-sm">
                        E-mail
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="jan.novak@email.cz"
                        autoComplete="email"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
              <form.Field
                name="phone"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field className="gap-2" data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name} className="text-sm">
                        Telefon
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="+420 123 456 789"
                        autoComplete="tel"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </div>

            {/* 3. Telefon a adresa vedle sebe — dle zadání "telefón nech a adresu taky" */}
            <form.Field
              name="address"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field className="gap-2" data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} className="text-sm">
                      Adresa
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Praha, CZ"
                      autoComplete="street-address"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            {/* 4. Linky jako seznam s tlačítkem přidat */}
            <form.Field
              name="links"
              children={(field) => (
                <Field className="gap-2">
                  <FieldLabel className="text-sm">Odkazy</FieldLabel>
                  <ul className="space-y-2">
                    {(field.state.value ?? [""]).map((link, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Input
                          value={link}
                          onChange={(e) => {
                            const next = [...(field.state.value ?? [])]
                            next[index] = e.target.value
                            field.handleChange(next)
                          }}
                          placeholder={`https://github.com/jannovak`}
                          autoComplete="off"
                        />
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
                      </li>
                    ))}
                  </ul>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-fit"
                    onClick={() =>
                      field.handleChange([...(field.state.value ?? []), ""])
                    }
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Přidat odkaz
                  </Button>
                  <FieldDescription>
                    GitHub, LinkedIn, portfolio…
                  </FieldDescription>
                </Field>
              )}
            />

            {/* 5. Summary jako auto-resize textarea */}
            <form.Field
              name="summary"
              children={(field) => (
                <Field className="gap-2">
                  <FieldLabel htmlFor={field.name} className="text-sm">
                    Shrnutí
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Junior vývojář zaměřený na web a TypeScript."
                    autoComplete="off"
                    className="resize-none overflow-hidden"
                    style={{ fieldSizing: "content" } as React.CSSProperties}
                    rows={2}
                  />
                  <FieldDescription>
                    Volitelné krátké představení do životopisu.
                  </FieldDescription>
                </Field>
              )}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Resetovat
            </Button>
            <Button type="submit" form="personal-form">
              Uložit
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2"></CardFooter>
    </Card>
  )
}
