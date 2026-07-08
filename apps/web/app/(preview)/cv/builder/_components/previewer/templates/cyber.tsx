import type { CvDetails } from "../../types"

interface Props {
  cv: CvDetails
}

export function CyberCvTemplate({ cv }: Props) {
  const fullName = `${cv.personal.firstName} ${cv.personal.lastName}`
  return (
    <div
      className="relative min-h-[1123px] bg-white p-10 text-black"
      style={{
        backgroundImage:
          "radial-gradient(circle, #d1d1d1 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* HEADER */}
      <header className="mb-8 border-b-2 border-black pb-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 font-mono text-[10px] tracking-[0.4em] text-neutral-400 uppercase">
              Curriculum Vitae
            </p>
            <h1 className="font-mono text-5xl leading-none font-black tracking-tight uppercase">
              {fullName}
            </h1>
          </div>

          {/* Pixel block accent */}
          <pre
            aria-hidden
            className="mb-1 shrink-0 font-mono text-[7px] leading-[1.1] text-black select-none"
          >
            {`█░█░█░█\n░█░█░█░\n█░█░█░█\n░█░█░█░`}
          </pre>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-neutral-500">
          <span>{cv.personal.email}</span>
          <span>{cv.personal.phone}</span>
          <span>{cv.personal.address}</span>
          {cv.personal.links?.map((link) => (
            <span
              key={link}
              className="text-black underline underline-offset-2"
            >
              {link}
            </span>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-[1.6fr_1fr] gap-10">
        {/* LEFT */}
        <div className="space-y-6">
          {!!cv.personal.summary && (
            <Section title="About">
              <p className="text-sm leading-7 text-neutral-600">
                {cv.personal.summary}
              </p>
            </Section>
          )}

          <Section title="Experience">
            <div className="space-y-5">
              {cv.experiences.map((exp, i) => (
                <div key={i} className="border-l-2 border-black pl-4">
                  <div className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
                    {exp.startDate} — {exp.endDate ?? "Present"}
                  </div>
                  <div className="mt-1 text-sm font-bold">{exp.role}</div>
                  <div className="font-mono text-xs text-neutral-500">
                    {exp.title}
                  </div>
                  <p className="mt-1.5 text-xs leading-6 text-neutral-600">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Education">
            <div className="space-y-4">
              {cv.education.map((edu, i) => (
                <div key={i} className="border-l-2 border-black pl-4">
                  <div className="text-sm font-bold">{edu.degree}</div>
                  <div className="font-mono text-xs text-neutral-500">
                    {edu.title}
                  </div>
                  <div className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
                    {edu.startDate} — {edu.endDate}
                  </div>
                  {!!edu.description && (
                    <p className="mt-1 text-xs text-neutral-600">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* RIGHT */}
        <aside className="space-y-6">
          <Section title="Skills">
            <div className="space-y-4">
              {Object.entries(cv.skills).map(([group, skills]) => (
                <div key={group}>
                  <div className="mb-2 font-mono text-[10px] tracking-[0.3em] text-neutral-400 uppercase">
                    {group}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="border border-black bg-black px-2 py-0.5 font-mono text-xs text-white"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Languages">
            <div className="space-y-1.5">
              {Object.entries(cv.languages).map(([lang, level]) => (
                <div
                  key={lang}
                  className="flex items-center justify-between border border-black px-3 py-1.5"
                >
                  <span className="text-sm font-bold">{lang}</span>
                  <span className="font-mono text-xs text-neutral-400">
                    {level}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        </aside>
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <h2 className="font-mono text-[10px] font-bold tracking-[0.4em] uppercase">
          {title}
        </h2>
        <div className="h-px flex-1 bg-black" />
      </div>
      {children}
    </section>
  )
}
