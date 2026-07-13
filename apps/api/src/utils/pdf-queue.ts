import { verifyPayload } from '@ppj/cv-auth'
import { BunCache } from 'bun-cache'
import puppeteer, { type Browser } from 'puppeteer'

interface Progress {
  status: 'progress'
}
interface PdfError {
  status: 'error'
  error: string
}
interface Success {
  status: 'success'
  data: Uint8Array<ArrayBufferLike>
}
type PdfJob = Progress | PdfError | Success

const cache = new BunCache()
const JOB_TTL_MS = 15 * 60 * 1000

// Reuse one browser instance instead of launching per job.
let browserPromise: Promise<Browser> | null = null
async function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    })
  }
  return browserPromise
}

export function getJob(token: string): PdfJob | undefined {
  return cache.hasKey(token) ? (cache.get(token) as PdfJob) : undefined
}

export async function enqueueJob(token: string): Promise<PdfJob> {
  if (cache.hasKey(token)) return cache.get(token) as PdfJob

  cache.put(token, { status: 'progress' } as PdfJob, JOB_TTL_MS)

  // fire and forget — caller polls /status
  createPdf(token).catch((err) => {
    cache.put(
      token,
      {
        status: 'error',
        error: err instanceof Error ? err.message : 'unknown error',
      } as PdfJob,
      JOB_TTL_MS
    )
  })

  return { status: 'progress' }
}

async function createPdf(token: string): Promise<void> {
  const payload = verifyPayload(token)

  if (!payload || payload.kind !== 'cv_export') {
    cache.put(token, { status: 'error', error: 'invalid or expired token' } as PdfJob, JOB_TTL_MS)
    return
  }

  const browser = await getBrowser()
  const page = await browser.newPage()

  try {
    const normalizedNodeEnv = (process.env.NODE_ENV ?? 'development').toLowerCase()
    const frontendBaseUrl = process.env.FRONTEND_URL?.trim() || 'http://localhost:3000'
    if (!process.env.FRONTEND_URL?.trim() && normalizedNodeEnv === 'production') {
      throw new Error('FRONTEND_URL env variable is required in production for PDF export')
    }
    const previewUrl = new URL(
      `/cv/preview?token=${encodeURIComponent(token)}`,
      frontendBaseUrl
    ).toString()

    const response = await page.goto(previewUrl, {
      waitUntil: 'networkidle0',
    })

    if (!response || !response.ok()) {
      cache.put(
        token,
        {
          status: 'error',
          error: `unexpected status: ${response?.status() ?? 'no response'}`,
        } as PdfJob,
        JOB_TTL_MS
      )
      return
    }

    const pdf = await page.pdf({ format: 'A4', printBackground: true })
    cache.put(token, { status: 'success', data: pdf } as PdfJob, JOB_TTL_MS)
  } finally {
    await page.close()
  }
}
