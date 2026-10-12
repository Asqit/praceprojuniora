import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { Dispatch, SetStateAction } from "react"

interface Props {
  zoom: number
  setZoom: Dispatch<SetStateAction<number>>
}

const MIN = 0.7
const MAX = 1.5
const STEP = 0.1

export function Zoomer({ zoom, setZoom }: Props) {
  const handleChange = (delta: number) => {
    setZoom((prev) => Math.min(MAX, Math.max(MIN, prev + delta)))
  }

  return (
    <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 border border-border/70 px-2 py-1.5">
      <span className="col-span-2 text-sm text-muted-foreground">
        Přiblížení
      </span>
      <span className="justify-self-end text-sm font-medium tabular-nums">
        {Math.round(zoom * 100)}%
      </span>
      <Button
        size="icon"
        variant="outline"
        aria-label="Oddálit náhled"
        disabled={zoom <= MIN}
        onClick={() => handleChange(-STEP)}
      >
        −
      </Button>

      <div className="min-w-0 px-1">
        <Slider
          value={[zoom]}
          min={MIN}
          max={MAX}
          step={0.01}
          onValueChange={([value]) => setZoom(value)}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>70%</span>
          <span>150%</span>
        </div>
      </div>

      <Button
        size="icon"
        variant="outline"
        aria-label="Přiblížit náhled"
        disabled={zoom >= MAX}
        onClick={() => handleChange(STEP)}
      >
        +
      </Button>
    </div>
  )
}
