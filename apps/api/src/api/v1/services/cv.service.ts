import { signPayload } from '@ppj/cv-auth'
import type { CvDetails, CvTemplate } from '../../../utils/cv-schema'
import { renderCvPdf } from '../../../utils/pdf-renderer'

export class CvService {
  static async createPdf(data: CvDetails, template: CvTemplate): Promise<Uint8Array> {
    const now = Date.now()
    const exportToken = signPayload({
      kind: 'cv_export',
      iat: now,
      exp: now + 5 * 60_000,
      ver: 1,
      nonce: crypto.randomUUID(),
      data,
      template,
    })

    return renderCvPdf(exportToken)
  }
}
