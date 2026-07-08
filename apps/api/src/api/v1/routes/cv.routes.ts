import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { isCvTemplate } from '../../../utils/cv-session'
import { getJob } from '../../../utils/pdf-queue'
import { CvService } from '../services/cv.service'

const router = new Hono()
  // ^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~ SESSION CREATE
  .post('/session', async (c) => {
    const body = (await c.req.json()) as { data?: unknown; template?: unknown }
    const template = isCvTemplate(body?.template) ? body.template : 'default'

    const { sessionToken, session } = CvService.createSession(body?.data ?? {}, template)
    return c.json({ sessionToken, session })
  })
  // ^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~ SESSION GET
  .get('/session/:token', async (c) => {
    const token = c.req.param('token')
    const session = CvService.getSession(token)

    if (!session) return c.json({ status: 'not_found' }, 404)
    return c.json({ session })
  })
  // ^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~ SESSION UPDATE
  .put('/session/:token', async (c) => {
    const token = c.req.param('token')
    const body = (await c.req.json()) as { data?: unknown; template?: unknown }

    if (!isCvTemplate(body?.template)) {
      return c.json({ status: 'invalid_template' }, 400)
    }

    const session = CvService.updateSession(token, body?.data ?? {}, body.template)
    if (!session) return c.json({ status: 'not_found' }, 404)

    return c.json({ session })
  })
  // ^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~ CREATE EXPORT JOB
  .post('/create/:token', async (c) => {
    const token = c.req.param('token')
    const jobToken = await CvService.createPdfJobFromSession(token)

    if (!jobToken) return c.json({ status: 'not_found' }, 404)
    return c.json({ jobToken })
  })
  // ^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~ STATUS (SSE)
  .get('/status/:token', async (c) => {
    const token = c.req.param('token')

    return streamSSE(c, async (stream) => {
      let lastStatus: string | null = null

      while (true) {
        const job = getJob(token)

        if (!job) {
          await stream.writeSSE({ event: 'error', data: JSON.stringify({ error: 'not_found' }) })
          break
        }

        if (job.status !== lastStatus) {
          lastStatus = job.status
          await stream.writeSSE({ event: job.status, data: JSON.stringify(job) })
        }

        if (job.status === 'success' || job.status === 'error') break

        await stream.sleep(500)
      }

      await stream.close()
    })
  })
  // ^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~ COLLECT
  .post('/collect/:token', async (c) => {
    const token = c.req.param('token')
    const job = getJob(token)

    if (!job) return c.json({ status: 'not_found' }, 404)
    if (job.status === 'progress') return c.json({ status: 'progress' }, 202)
    if (job.status === 'error') return c.json({ status: 'error', error: job.error }, 400)

    c.header('Content-Type', 'application/pdf')
    c.header('Content-Disposition', 'inline; filename="dokument.pdf"')
    const data = Uint8Array.from(Object.values(job.data))
    return c.body(data)
  })

export default router
