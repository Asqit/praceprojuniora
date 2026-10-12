import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { cvDetailsSchema, isCvTemplate } from '../../../utils/cv-schema'
import { PdfExportBusyError } from '../../../utils/pdf-renderer'
import { CvService } from '../services/cv.service'

const router = new Hono().post('/export', bodyLimit({ maxSize: 256 * 1024 }), async (c) => {
  const body = (await c.req.json()) as { data?: unknown; template?: unknown }
  if (!isCvTemplate(body?.template)) {
    return c.json({ status: 'invalid_template' }, 400)
  }

  const parsedData = cvDetailsSchema.safeParse(body.data)
  if (!parsedData.success) {
    return c.json({ status: 'invalid_cv_data' }, 400)
  }

  try {
    const pdf = await CvService.createPdf(parsedData.data, body.template)
    c.header('Content-Type', 'application/pdf')
    c.header('Content-Disposition', 'attachment; filename="cv.pdf"')
    return c.body(Buffer.from(pdf))
  } catch (error) {
    if (error instanceof PdfExportBusyError) {
      c.header('Retry-After', '15')
      return c.json({ status: 'pdf_export_busy' }, 503)
    }

    console.error('CV PDF export failed:', error)
    return c.json({ status: 'pdf_export_failed' }, 500)
  }
})

export default router
