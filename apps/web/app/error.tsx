"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

interface Props {
  error: Error & { digest?: string }
  reset(): void
}

export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[80svh] flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-2xl font-mono">
        <p className="mb-8 text-8xl font-black">:(</p>

        <p className="mb-6 text-lg leading-snug font-bold">
          Tvůj prohlížeč narazil na problém a musí se restartovat.
          <br />
          Sbíráme chybové informace.
        </p>

        <div className="mb-8 space-y-1 text-xs leading-relaxed text-neutral-500">
          <p>
            Chyba:{" "}
            <span className="text-black">
              {error.message || "UNEXPECTED_KERNEL_MODE_TRAP"}
            </span>
          </p>
          {error.digest && (
            <p>
              Digest: <span className="text-black">{error.digest}</span>
            </p>
          )}
          <p className="mt-4 italic">
            Pokud se tato stránka zobrazuje stále, viň React.
          </p>
        </div>

        <Button
          onClick={reset}
          variant="outline"
          className="rounded-none border-black bg-transparent text-black hover:bg-black hover:text-white"
        >
          reset
        </Button>
      </div>
    </div>
  )
}
