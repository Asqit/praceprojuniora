import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { signPayload } from '@ppj/cv-auth' // HMAC TTLed token
import { enqueueJob, getJob } from '../../../utils/pdf-queue'

const router = new Hono()
  // ^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~ CREATE
  .post('/create', async (c) => {
    const data = await c.req.json()
    const payload = {
      exp: Date.now() + 60_000,
      data,
    }
    const jobToken = signPayload(payload)

    await enqueueJob(jobToken)

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
