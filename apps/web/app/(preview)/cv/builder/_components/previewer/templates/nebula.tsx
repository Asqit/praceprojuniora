import { Mail, Phone, MapPin } from "lucide-react"

import type { CvDetails } from "../../types"

interface Props {
  cv: CvDetails
}

export function NebulaCvTemplate({ cv }: Props) {
  const fullName = `${cv.personal.firstName} ${cv.personal.lastName}`

  const allSkills = Object.entries(cv.skills)

  return (
    <div className="relative min-h-[1123px] overflow-hidden bg-[#f6f4fb] p-8 text-neutral-900">
      {/* gradients */}
      <GradientBlob className="-top-24 -left-24 bg-violet-400/60" />
      <GradientBlob className="right-[-100px] bottom-[-180px] bg-orange-400/60" />
      <GradientBlob className="top-[65%] left-1/2 bg-pink-300/50" />

      <div className="relative z-10">
        {/* HERO */}
        <header className="mb-8">
          <h1 className="font-serif text-4xl leading-tight">{fullName}</h1>

          {/* compact contacts */}
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-700">
            <Contact icon={<Mail size={13} />}>{cv.personal.email}</Contact>

            <Contact icon={<Phone size={13} />}>{cv.personal.phone}</Contact>

            <Contact icon={<MapPin size={13} />}>{cv.personal.address}</Contact>
          </div>

          {!!cv.personal.links?.length && (
            <div className="mt-2 flex flex-wrap gap-2">
              {cv.personal.links.map((link) => (
                <span
                  key={link}
                  className="rounded-full border border-neutral-300 bg-white/50 px-3 py-0.5 text-xs"
                >
                  {link}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="grid grid-cols-[1.7fr_1fr] gap-8">
          {/* LEFT */}
          <div className="space-y-6">
            {!!cv.personal.summary && (
              <Section title="O mně">
                <p className="text-sm leading-7 text-neutral-700">
                  {cv.personal.summary}
                </p>
              </Section>
            )}

            <Section title="Zkušenosti">
              <div className="space-y-4">
                {cv.experiences.map((exp, i) => (
                  <article
                    key={i}
                    className="border-l-2 border-neutral-300 pl-4"
                  >
                    <div className="mb-1 text-xs tracking-wider text-orange-500 uppercase">
                      {exp.startDate} — {exp.endDate}
                    </div>

                    <h3 className="text-sm font-semibold">{exp.role}</h3>

                    <div className="mb-2 text-xs text-neutral-500">
                      {exp.title}
                    </div>

                    <p className="text-xs leading-6 text-neutral-700">
                      {exp.description}
                    </p>
                  </article>
                ))}
              </div>
            </Section>
          </div>

          {/* RIGHT */}
          <aside className="space-y-6">
            <Section title="Dovednosti">
              <div className="space-y-3">
                {allSkills.map(([group, skills]) => (
                  <div key={group}>
                    <div className="mb-1 text-xs font-semibold tracking-wide uppercase">
                      {group}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-white/70 px-2 py-0.5 text-xs ring-1 ring-neutral-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Vzdělání">
              <div className="space-y-3">
                {cv.education.map((edu, i) => (
                  <div key={i}>
                    <div className="text-sm font-medium">{edu.degree}</div>

                    <div className="text-xs text-neutral-500">{edu.title}</div>

                    <div className="text-xs text-orange-500">
                      {edu.startDate}
                      {" — "}
                      {edu.endDate}
                    </div>

                    {!!edu.description && (
                      <div className="mt-1 text-xs">{edu.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Jazyky">
              <div className="space-y-1">
                {Object.entries(cv.languages).map(([lang, level]) => (
                  <div
                    key={lang}
                    className="flex justify-between rounded-lg bg-white/60 px-2 py-1.5"
                  >
                    <span className="text-sm">{lang}</span>

                    <span className="text-xs text-neutral-500">{level}</span>
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
      <h2 className="mb-4 font-serif text-2xl">{title}</h2>

      {children}
    </section>
  )
}

function GradientBlob({ className }: { className?: string }) {
  return (
    <div
      className={`absolute h-[420px] w-[420px] rounded-full blur-3xl ${className}`}
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
    <div className="flex items-center gap-2">
      <span className="text-orange-500">{icon}</span>

      {children}
    </div>
  )
}
