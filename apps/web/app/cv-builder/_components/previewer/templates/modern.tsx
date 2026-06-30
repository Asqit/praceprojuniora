import React from "react"
import { Mail, Phone, MapPin, Link as LinkIcon } from "lucide-react"

type Props = { cv: CvDetails }

// ---------- Helpers ----------
function fmtDate(d?: string) {
  if (!d) return "Now"
  const date = new Date(d)
  if (isNaN(date.getTime())) return d
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="text-[11px] font-bold tracking-[0.2em] text-amber-700 uppercase print:text-black">
        {children}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-amber-300 to-transparent print:bg-neutral-300" />
    </div>
  )
}

export function ModernCvTemplate({ cv }: Props) {
  const { personal, experiences, education, skills, languages } = cv
  const fullName = [personal.firstName, personal.middleName, personal.lastName]
    .filter(Boolean)
    .join(" ")

  return (
    <div
      className="mx-auto max-w-[850px] overflow-hidden rounded-2xl bg-white text-neutral-900 shadow-xl print:rounded-none print:shadow-none"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700&display=swap');
        @media print {
          .cv-blob { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-amber-200 via-yellow-300 to-orange-400 px-10 py-12 print:bg-white print:px-0 print:py-6">
        <div className="cv-blob absolute -top-10 -right-10 h-56 w-56 rounded-full bg-white/30 blur-2xl" />
        <div className="cv-blob absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-orange-500/20 blur-2xl" />

        <h1
          className="relative text-5xl font-bold tracking-tight text-neutral-900 print:text-black"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {fullName}
        </h1>

        <div className="relative mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-800 print:text-black">
          <span className="flex items-center gap-1.5">
            <MapPin size={14} /> {personal.address}
          </span>
          <span className="flex items-center gap-1.5">
            <Mail size={14} /> {personal.email}
          </span>
          <span className="flex items-center gap-1.5">
            <Phone size={14} /> {personal.phone}
          </span>
          {personal.links?.map((l) => (
            <span key={l} className="flex items-center gap-1.5">
              <LinkIcon size={14} /> {l}
            </span>
          ))}
        </div>

        {personal.summary && (
          <p className="relative mt-5 max-w-2xl text-[15px] leading-relaxed text-neutral-800 print:text-black">
            {personal.summary}
          </p>
        )}
      </header>

      <div className="space-y-10 px-10 py-10 print:px-0 print:py-6">
        {/* Experience */}
        {experiences.length > 0 && (
          <section>
            <Eyebrow>Experience</Eyebrow>
            <div className="space-y-6">
              {experiences.map((e, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-[17px] font-semibold">
                      {e.role}{" "}
                      <span className="text-amber-700 print:text-black">
                        · {e.title}
                      </span>
                    </h3>
                    <span className="shrink-0 text-xs font-medium text-neutral-500 print:text-black">
                      {fmtDate(e.startDate)} — {fmtDate(e.endDate)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-700 print:text-black">
                    {e.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <Eyebrow>Education</Eyebrow>
            <div className="space-y-6">
              {education.map((e, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-[17px] font-semibold">
                      {e.degree}{" "}
                      <span className="text-amber-700 print:text-black">
                        · {e.title}
                      </span>
                    </h3>
                    <span className="shrink-0 text-xs font-medium text-neutral-500 print:text-black">
                      {fmtDate(e.startDate)} — {fmtDate(e.endDate)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-700 print:text-black">
                    {e.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills + Languages side by side */}
        <div className="grid grid-cols-2 gap-10 print:grid-cols-2">
          {Object.keys(skills).length > 0 && (
            <section>
              <Eyebrow>Skills</Eyebrow>
              <div className="space-y-3">
                {Object.entries(skills).map(([cat, items]) => (
                  <div key={cat}>
                    <p className="mb-1.5 text-xs font-semibold text-neutral-500 print:text-black">
                      {cat}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs text-amber-800 print:border-neutral-400 print:bg-white print:text-black"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {Object.keys(languages).length > 0 && (
            <section>
              <Eyebrow>Languages</Eyebrow>
              <div className="space-y-1.5">
                {Object.entries(languages).map(([lang, level]) => (
                  <p key={lang} className="text-sm">
                    <span className="font-medium">{lang}</span>
                    <span className="text-neutral-500 print:text-black">
                      {" "}
                      — {level}
                    </span>
                  </p>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
