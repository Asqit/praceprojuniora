"use client"
import { useState } from "react"
import { emptyCvDetails } from "../dummy-data"
import { Previewer } from "../previewer"
import { CvDetails } from "../types"
import { Wizard } from "./wizard"

export function Builder() {
  const [details, setDetails] = useState<CvDetails>(emptyCvDetails)

  return (
    <div className="flex max-h-screen flex-col overflow-hidden md:flex-row">
      <main className="w-full overflow-y-scroll pb-6 md:w-1/3">
        <Wizard details={details} setDetails={setDetails} />
      </main>
      <aside className="group relative flex flex-col overflow-y-scroll border-l bg-muted md:w-2/3">
        <Previewer content={details} />
      </aside>
    </div>
  )
}
