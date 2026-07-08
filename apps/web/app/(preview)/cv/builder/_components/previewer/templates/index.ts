import { DefaultCvTemplate } from "./default"
import { AuroraCvTemplate } from "./aurora"
import { NebulaCvTemplate } from "./nebula"
import { CyberCvTemplate } from "./cyber"

export const templates = {
  default: DefaultCvTemplate,
  aurora: AuroraCvTemplate,
  nebula: NebulaCvTemplate,
  cyber: CyberCvTemplate,
}

export type CvTemplateName = keyof typeof templates
