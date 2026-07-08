import { Button } from "@/components/ui/button"
import {
  FileText,
  FileCode2,
  Loader2,
  Download,
  Sparkles,
  AlertCircle,
} from "lucide-react"

export type ExportState =
  | "idle"
  | "creating"
  | "rendering"
  | "downloading"
  | "error"

interface Props {
  exportState: ExportState

  onExportPdf: () => void
  onExportMarkdown: () => void
}

export function Exporter({
  exportState,
  onExportPdf,
  onExportMarkdown,
}: Props) {
  const pdfBusy = exportState !== "idle" && exportState !== "error"

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <span className="w-14 text-sm text-muted-foreground">Exportovat</span>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onExportMarkdown}
            data-umami-event="cv-export-markdown-click"
          >
            <FileCode2 className="mr-2 size-4" />
            Markdown
          </Button>

          <Button
            disabled={pdfBusy}
            onClick={onExportPdf}
            data-umami-event="cv-export-pdf-click"
          >
            <PdfState state={exportState} />
          </Button>
        </div>
      </div>

      {pdfBusy && <ExportStatus state={exportState} />}

      {exportState === "error" && (
        <div className="ml-[68px] flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="size-4" />
          Export selhal. Zkuste to znovu.
        </div>
      )}
    </div>
  )
}

function PdfState({ state }: { state: ExportState }) {
  switch (state) {
    case "creating":
      return (
        <>
          <Sparkles className="mr-2 size-4 animate-pulse" />
          Připravuji…
        </>
      )

    case "rendering":
      return (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Generuji PDF…
        </>
      )

    case "downloading":
      return (
        <>
          <Download className="mr-2 size-4 animate-bounce" />
          Stahování…
        </>
      )

    default:
      return (
        <>
          <FileText className="mr-2 size-4" />
          PDF
        </>
      )
  }
}

type BusyExportState = Exclude<ExportState, "idle" | "error">

function ExportStatus({ state }: { state: BusyExportState }) {
  const messages = {
    creating: "Připravuji dokument…",
    rendering: "Generuji PDF… obvykle to trvá několik sekund",
    downloading: "Stahování by mělo začít automaticky",
  }

  return (
    <div className="ml-[68px] text-sm text-muted-foreground">
      {messages[state]}
    </div>
  )
}
