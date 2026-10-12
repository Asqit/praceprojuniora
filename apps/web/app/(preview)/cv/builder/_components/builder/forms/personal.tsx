"use client"
/* eslint-disable react/no-children-prop */
import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UserRound, X, Plus } from "lucide-react"
import { FormProps } from "./props"
import { SectionHeading } from "./section-heading"
import { CvDetails } from "../../types"

type Props = FormProps<"personal">

export function PersonalForm({ initialValue, onChange }: Props) {
  const [initialFormValues] = useState(() => ({
    ...initialValue,
    middleName: initialValue.middleName ?? "",
    links: initialValue.links ?? [],
    summary: initialValue.summary ?? "",
  }))
  const form = useForm({
    defaultValues: initialFormValues,
    listeners: {
      onChange: ({ formApi }) => {
        onChange(formApi.state.values satisfies CvDetails["personal"])
      },
    },
  })

  return (
    <section id="personal-section" className="scroll-mt-20 py-7 sm:py-9">
      <SectionHeading
        icon={UserRound}
        tone="green"
        title="Kdo jsi?"
        description="Stačí jméno a kontakt. Krátké představení můžeš dopsat až nakonec."
      />
      <div className="space-y-3">
        <div>
          <FieldGroup className="grid gap-3">
            <div className="grid gap-3">
              <form.Field
                name="firstName"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field className="gap-2" data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name} className="text-sm">
                        Jméno <span className="text-destructive">*</span>
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
                        Příjmení <span className="text-destructive">*</span>
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

            <div className="grid gap-3">
              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field className="gap-2" data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name} className="text-sm">
                        E-mail <span className="text-destructive">*</span>
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
                        Telefon <span className="text-destructive">*</span>
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

            <form.Field
              name="address"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field className="gap-2" data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} className="text-sm">
                      Město nebo region
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Praha / Jihočeský kraj"
                      autoComplete="address-level2"
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
                    GitHub, LinkedIn nebo portfolio, kde je vidět tvoje práce.
                  </FieldDescription>
                </Field>
              )}
            />

            <form.Field
              name="summary"
              children={(field) => (
                <Field className="gap-2">
                  <FieldLabel htmlFor={field.name} className="text-sm">
                    Krátké představení
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Zajímá mě vývoj webů a rád převádím nápady do funkčních projektů."
                    autoComplete="off"
                    className="resize-none overflow-hidden"
                    style={{ fieldSizing: "content" } as React.CSSProperties}
                    rows={2}
                  />
                  <FieldDescription>
                    Co tě zajímá, co hledáš a v čem chceš být lepší? Dvě věty
                    stačí.
                  </FieldDescription>
                </Field>
              )}
            />
          </FieldGroup>
        </div>
      </div>
    </section>
  )
}
