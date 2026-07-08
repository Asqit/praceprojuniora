import { Button } from "@/components/ui/button"
import { LayoutGrid, ChevronDown } from "lucide-react"

interface Props {
  open: boolean
  onToggle: () => void
}

export function TemplateSwitcher({ open, onToggle }: Props) {
  return (
    <Button variant="outline" onClick={onToggle} className="gap-2">
      <LayoutGrid className="size-4" />
      Šablony
      <ChevronDown
        className={["size-4 transition-transform", open && "rotate-180"]
          .filter(Boolean)
          .join(" ")}
      />
    </Button>
  )
}
