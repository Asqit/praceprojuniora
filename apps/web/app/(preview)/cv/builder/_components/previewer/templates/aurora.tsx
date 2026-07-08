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

  const role = cv.experiences[0]?.role ?? "Softwarový inženýr"

  return (
    <div className="relative overflow-hidden bg-[#fafaf8] p-12 text-neutral-900">
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
        <header className="mb-16">
          <div className="mb-8 flex items-start justify-between gap-10">
            <div className="max-w-3xl">
              <div className="mb-3 text-sm tracking-[0.4em] text-orange-500 uppercase">
                {role}
              </div>

              <h1 className="font-serif text-7xl leading-[0.9] tracking-tight">
                {fullName}
              </h1>

              {!!cv.personal.summary && (
                <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-600">
                  {cv.personal.summary}
                </p>
              )}
            </div>

            <div className="w-[260px] shrink-0 rounded-3xl border border-neutral-200 bg-white/80 p-6 backdrop-blur">
              <Contact icon={<Mail size={16} />}>{cv.personal.email}</Contact>

              <Contact icon={<Phone size={16} />}>{cv.personal.phone}</Contact>

              <Contact icon={<MapPin size={16} />}>
                {cv.personal.address}
              </Contact>

              {!!cv.personal.links?.length && (
                <div className="mt-5 space-y-2">
                  {cv.personal.links.map((link) => (
                    <div
                      key={link}
                      className="flex items-center gap-2 text-sm text-orange-600"
                    >
                      <ArrowUpRight size={14} />

                      <span className="truncate">{link}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="grid gap-14 lg:grid-cols-[1.6fr_0.9fr]">
          {/* MAIN */}
          <main className="space-y-12">
            <Section title="Zkušenosti">
              <div className="space-y-5">
                {cv.experiences.map((exp, i) => (
                  <article
                    key={i}
                    className="rounded-3xl border border-neutral-200 bg-white/80 p-7"
                  >
                    <div className="mb-5 flex items-start justify-between gap-5">
                      <div>
                        <h3 className="text-xl font-semibold">{exp.role}</h3>

                        <div className="text-neutral-500">{exp.title}</div>
                      </div>

                      <div className="text-right text-sm text-orange-500">
                        {exp.startDate}
                        <br />
                        {exp.endDate ?? "Nyní"}
                      </div>
                    </div>

                    <p className="text-sm leading-7 text-neutral-700">
                      {exp.description}
                    </p>
                  </article>
                ))}
              </div>
            </Section>

            <Section title="Vzdělání">
              <div className="grid gap-5">
                {cv.education.map((edu, i) => (
                  <div key={i} className="rounded-2xl bg-white/70 p-6">
                    <div className="mb-1 font-semibold">{edu.degree}</div>

                    <div className="text-neutral-500">{edu.title}</div>

                    <div className="mt-2 text-sm text-orange-500">
                      {edu.startDate}
                      {" — "}
                      {edu.endDate}
                    </div>

                    {!!edu.description && (
                      <p className="mt-4 text-sm leading-6">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          </main>

          {/* SIDEBAR */}
          <aside className="space-y-12">
            <Section title="Technologie">
              <div className="space-y-6">
                {Object.entries(cv.skills).map(([group, values]) => (
                  <div key={group}>
                    <div className="mb-3 text-sm font-bold tracking-widest uppercase">
                      {group}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {values.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm"
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
              <div className="space-y-3">
                {Object.entries(cv.languages).map(([lang, level]) => (
                  <div
                    key={lang}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-3"
                  >
                    <div className="font-medium">{lang}</div>

                    <div className="text-sm text-neutral-500">{level}</div>
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
    <div className="mb-3 flex items-center gap-3 text-sm">
      <div className="text-orange-500">{icon}</div>

      <div className="break-all">{children}</div>
    </div>
  )
}
