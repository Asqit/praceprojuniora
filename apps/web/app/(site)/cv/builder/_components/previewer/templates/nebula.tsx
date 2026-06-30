import { Mail, Phone, MapPin, Sparkles, Star, Asterisk } from "lucide-react"

import type { CvDetails } from "../../types"

interface Props {
  cv: CvDetails
}

export function NebulaCvTemplate({ cv }: Props) {
  const fullName = `${cv.personal.firstName} ${cv.personal.lastName}`

  const allSkills = Object.entries(cv.skills)

  return (
    <div className="relative overflow-hidden bg-[#f6f4fb] p-12 text-neutral-900">
      {/* gradients */}
      <GradientBlob className="-top-24 -left-24 bg-violet-400/30" />
      <GradientBlob className="right-[-100px] bottom-[-180px] bg-orange-400/40" />
      <GradientBlob className="top-[65%] left-1/2 bg-pink-300/20" />

      {/* ornaments */}
      <Ornament icon={Sparkles} className="top-10 left-10" />

      <Ornament icon={Star} className="top-24 right-20 rotate-12" />

      <Ornament icon={Asterisk} className="top-64 right-32" />

      <Ornament icon={Sparkles} className="top-16 left-[55%] scale-75" />

      <div className="relative z-10">
        {/* HERO */}
        <header className="mb-14">
          <h1 className="font-serif text-6xl leading-[0.9]">{fullName}</h1>

          <div className="mt-4 text-lg tracking-[0.35em] text-orange-500 uppercase">
            {cv.experiences[0]?.role ?? "Software Engineer"}
          </div>

          {/* compact contacts */}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-neutral-700">
            <Contact icon={<Mail size={15} />}>{cv.personal.email}</Contact>

            <Contact icon={<Phone size={15} />}>{cv.personal.phone}</Contact>

            <Contact icon={<MapPin size={15} />}>{cv.personal.address}</Contact>
          </div>

          {!!cv.personal.links?.length && (
            <div className="mt-4 flex flex-wrap gap-2">
              {cv.personal.links.map((link) => (
                <span
                  key={link}
                  className="rounded-full border border-neutral-300 bg-white/50 px-3 py-1 text-xs"
                >
                  {link}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="grid gap-16 lg:grid-cols-[1.7fr_1fr]">
          {/* LEFT */}
          <div className="space-y-12">
            {!!cv.personal.summary && (
              <Section title="About">
                <p className="leading-8 text-neutral-700">
                  {cv.personal.summary}
                </p>
              </Section>
            )}

            <Section title="Experience">
              <div className="space-y-8">
                {cv.experiences.map((exp, i) => (
                  <article
                    key={i}
                    className="border-l-2 border-neutral-300 pl-5"
                  >
                    <div className="mb-2 text-xs tracking-wider text-orange-500 uppercase">
                      {exp.startDate} — {exp.endDate}
                    </div>

                    <h3 className="font-semibold">{exp.role}</h3>

                    <div className="mb-3 text-sm text-neutral-500">
                      {exp.title}
                    </div>

                    <p className="text-sm leading-7 text-neutral-700">
                      {exp.description}
                    </p>
                  </article>
                ))}
              </div>
            </Section>
          </div>

          {/* RIGHT */}
          <aside className="space-y-12">
            <Section title="Skills">
              <div className="space-y-5">
                {allSkills.map(([group, skills]) => (
                  <div key={group}>
                    <div className="mb-2 text-sm font-semibold tracking-wide uppercase">
                      {group}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-white/70 px-3 py-1 text-sm ring-1 ring-neutral-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Education">
              <div className="space-y-5">
                {cv.education.map((edu, i) => (
                  <div key={i}>
                    <div className="font-medium">{edu.degree}</div>

                    <div className="text-sm text-neutral-500">{edu.title}</div>

                    <div className="text-sm text-orange-500">
                      {edu.startDate}
                      {" — "}
                      {edu.endDate}
                    </div>

                    {!!edu.description && (
                      <div className="mt-2 text-sm">{edu.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Languages">
              <div className="space-y-2">
                {Object.entries(cv.languages).map(([lang, level]) => (
                  <div
                    key={lang}
                    className="flex justify-between rounded-xl bg-white/60 px-3 py-2"
                  >
                    <span>{lang}</span>

                    <span className="text-neutral-500">{level}</span>
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

function GradientBlob({ className }: { className?: string }) {
  return (
    <div
      className={`absolute h-[420px] w-[420px] rounded-full blur-3xl ${className}`}
    />
  )
}

function Ornament({
  icon: Icon,
  className,
}: {
  icon: React.ElementType
  className?: string
}) {
  return <Icon className={`absolute text-black/80 ${className}`} size={28} />
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
