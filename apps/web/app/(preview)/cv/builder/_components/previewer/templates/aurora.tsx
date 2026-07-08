import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Triangle,
  Circle,
  Square,
} from "lucide-react"

import type { CvDetails } from "../../types"

interface Props {
  cv: CvDetails
}

export function AuroraCvTemplate({ cv }: Props) {
  const fullName = [
    cv.personal.firstName,
    cv.personal.middleName,
    cv.personal.lastName,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className="relative min-h-[1123px] overflow-hidden bg-[#fafaf8] p-8 text-neutral-900">
      {/* decorative shapes */}
      <Shape
        className="-top-24 right-[-60px] text-orange-300"
        icon={Circle}
        size={340}
      />

      <Shape
        className="bottom-[-80px] left-[-80px] text-violet-300"
        icon={Square}
        size={260}
      />

      <Shape
        className="top-[45%] right-[10%] text-neutral-300"
        icon={Triangle}
        size={80}
      />

      <div className="relative z-10">
        {/* HERO */}
        <header className="mb-8">
          <div className="mb-5 flex items-start justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="font-serif text-5xl leading-tight tracking-tight">
                {fullName}
              </h1>

              {!!cv.personal.summary && (
                <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">
                  {cv.personal.summary}
                </p>
              )}
            </div>

            <div className="w-[220px] shrink-0 rounded-2xl border border-neutral-200 bg-white/80 p-4 backdrop-blur">
              <Contact icon={<Mail size={14} />}>{cv.personal.email}</Contact>

              <Contact icon={<Phone size={14} />}>{cv.personal.phone}</Contact>

              <Contact icon={<MapPin size={14} />}>
                {cv.personal.address}
              </Contact>

              {!!cv.personal.links?.length && (
                <div className="mt-3 space-y-1">
                  {cv.personal.links.map((link) => (
                    <div
                      key={link}
                      className="flex items-center gap-2 text-xs text-orange-600"
                    >
                      <ArrowUpRight size={12} />

                      <span className="truncate">{link}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="grid grid-cols-[1.6fr_0.9fr] gap-8">
          {/* MAIN */}
          <main className="space-y-6">
            <Section title="Zkušenosti">
              <div className="space-y-3">
                {cv.experiences.map((exp, i) => (
                  <article
                    key={i}
                    className="rounded-2xl border border-neutral-200 bg-white/80 p-4"
                  >
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{exp.role}</h3>

                        <div className="text-sm text-neutral-500">
                          {exp.title}
                        </div>
                      </div>

                      <div className="shrink-0 text-right text-xs text-orange-500">
                        {exp.startDate}
                        <br />
                        {exp.endDate ?? "Nyní"}
                      </div>
                    </div>

                    <p className="text-sm leading-6 text-neutral-700">
                      {exp.description}
                    </p>
                  </article>
                ))}
              </div>
            </Section>

            <Section title="Vzdělání">
              <div className="grid gap-3">
                {cv.education.map((edu, i) => (
                  <div key={i} className="rounded-xl bg-white/70 p-4">
                    <div className="mb-1 font-semibold">{edu.degree}</div>

                    <div className="text-sm text-neutral-500">{edu.title}</div>

                    <div className="mt-1 text-sm text-orange-500">
                      {edu.startDate}
                      {" — "}
                      {edu.endDate}
                    </div>

                    {!!edu.description && (
                      <p className="mt-2 text-sm leading-6">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          </main>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            <Section title="Technologie">
              <div className="space-y-3">
                {Object.entries(cv.skills).map(([group, values]) => (
                  <div key={group}>
                    <div className="mb-2 text-xs font-bold tracking-widest uppercase">
                      {group}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {values.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Jazyky">
              <div className="space-y-2">
                {Object.entries(cv.languages).map(([lang, level]) => (
                  <div
                    key={lang}
                    className="rounded-lg border border-neutral-200 bg-white px-3 py-2"
                  >
                    <div className="text-sm font-medium">{lang}</div>

                    <div className="text-xs text-neutral-500">{level}</div>
                  </div>
                ))}
              </div>
            </Section>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: React.PropsWithChildren<{
  title: string
}>) {
  return (
    <section>
      <h2 className="mb-6 font-serif text-3xl">{title}</h2>

      {children}
    </section>
  )
}

function Shape({
  icon: Icon,
  className,
  size,
}: {
  icon: React.ElementType
  className?: string
  size: number
}) {
  return (
    <Icon
      className={`absolute opacity-20 ${className}`}
      strokeWidth={1}
      size={size}
    />
  )
}

function Contact({
  icon,
  children,
}: React.PropsWithChildren<{
  icon: React.ReactNode
}>) {
  return (
    <div className="mb-2 flex items-center gap-2 text-xs">
      <div className="text-orange-500">{icon}</div>

      <div className="break-all">{children}</div>
    </div>
  )
}
