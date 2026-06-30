import { Button } from "@/components/ui/button"
import { FileText, FileCode2, Printer } from "lucide-react"

interface Props {
  onExportPdf: () => void
  onExportMarkdown: () => void
  onPrint: () => void
  isBusy?: boolean
}

export function Exporter({
  onExportPdf,
  onExportMarkdown,
  onPrint,
  isBusy = false,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      {/* Label */}
      <span className="w-14 text-sm text-muted-foreground">Export</span>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" disabled={isBusy} onClick={onPrint}>
          <Printer className="mr-2 size-4" />
          Print
        </Button>

        <Button variant="outline" disabled={isBusy} onClick={onExportMarkdown}>
          <FileCode2 className="mr-2 size-4" />
          Markdown
        </Button>

        <Button disabled={isBusy} onClick={onExportPdf}>
          <FileText className="mr-2 size-4" />
          PDF
        </Button>
      </div>
    </div>
  )
}
