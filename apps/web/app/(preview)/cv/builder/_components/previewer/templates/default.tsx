import { CvDetails } from "../../types"

interface Props {
  cv: CvDetails
}

export function DefaultCvTemplate({ cv }: Props) {
  const fullName = `${cv.personal.firstName} ${cv.personal.lastName}`

  return (
    <div className="mx-auto min-h-[1123px] max-w-4xl bg-white p-10 text-neutral-900">
      {/* Header */}
      <header className="border-b pb-6">
        <h1 className="text-4xl font-bold">{fullName}</h1>

        <div className="mt-3 space-y-1 text-sm text-neutral-600">
          <p>{cv.personal.email}</p>
          <p>{cv.personal.phone}</p>
          <p>{cv.personal.address}</p>

          {cv?.personal?.links?.length ? (
            <div className="flex flex-wrap gap-2">
              {cv.personal?.links?.map((link) => (
                <span key={link} className="rounded bg-neutral-100 px-2 py-1">
                  {link}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <main className="mt-8 space-y-8">
        {/* Experience */}
        <section>
          <SectionTitle>Zkušenosti</SectionTitle>

          <div className="space-y-4">
            {cv.experiences.map((exp, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {exp.role} · {exp.title}
                  </h3>

                  <span className="text-sm text-neutral-500">
                    {exp.startDate} → {exp.endDate}
                  </span>
                </div>

                <p className="mt-1 text-sm text-neutral-700">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <SectionTitle>Vzdělání</SectionTitle>

          <div className="space-y-4">
            {cv.education.map((edu, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {edu.degree} · {edu.title}
                  </h3>

                  <span className="text-sm text-neutral-500">
                    {edu.startDate} → {edu.endDate}
                  </span>
                </div>

                <p className="mt-1 text-sm text-neutral-700">
                  {edu.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <SectionTitle>Dovednosti</SectionTitle>

          <div className="space-y-3">
            {Object.entries(cv.skills).map(([group, skills]) => (
              <div key={group}>
                <h3 className="mb-2 font-medium">{group}</h3>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded border px-2 py-1 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Languages */}
        <section>
          <SectionTitle>Jazyky</SectionTitle>

          <div className="grid gap-2 sm:grid-cols-2">
            {Object.entries(cv.languages).map(([lang, level]) => (
              <div
                key={lang}
                className="flex justify-between rounded border p-3"
              >
                <span>{lang}</span>
                <span className="text-neutral-500">{level}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 border-b pb-1 text-lg font-semibold">{children}</h2>
  )
}
