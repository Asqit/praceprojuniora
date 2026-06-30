import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { Dispatch, SetStateAction } from "react"

interface Props {
  zoom: number
  setZoom: Dispatch<SetStateAction<number>>
}

const MIN = 0.5
const MAX = 1
const STEP = 0.05

export function Zoomer({ zoom, setZoom }: Props) {
  const handleChange = (delta: number) => {
    setZoom((prev) => Math.min(MAX, Math.max(MIN, prev + delta)))
  }

  return (
    <div className="flex items-center gap-3">
      {/* Label */}
      <span className="w-14 text-sm text-muted-foreground">Zoom</span>

      <Button
        size="icon"
        variant="outline"
        disabled={zoom <= MIN}
        onClick={() => handleChange(-STEP)}
      >
        −
      </Button>

      <div className="flex min-w-[220px] flex-col gap-1">
        <Slider
          value={[zoom]}
          min={MIN}
          max={MAX}
          step={0.01}
          onValueChange={([value]) => setZoom(value)}
        />

        {/* Legend */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>50%</span>
          <span className="font-medium text-foreground">
            {Math.round(zoom * 100)}%
          </span>
          <span>100%</span>
        </div>
      </div>

      <Button
        size="icon"
        variant="outline"
        disabled={zoom >= MAX}
        onClick={() => handleChange(STEP)}
      >
        +
      </Button>
    </div>
  )
}
