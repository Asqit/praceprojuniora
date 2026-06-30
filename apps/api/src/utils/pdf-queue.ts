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

// Reuse one browser instance instead of launching per job.
let browserPromise: Promise<Browser> | null = null
async function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({ headless: true })
  }
  return browserPromise
}

export function getJob(token: string): PdfJob | undefined {
  return cache.hasKey(token) ? (cache.get(token) as PdfJob) : undefined
}

export async function enqueueJob(token: string): Promise<PdfJob> {
  if (cache.hasKey(token)) return cache.get(token) as PdfJob

  cache.put(token, { status: 'progress' } as PdfJob)

  // fire and forget — caller polls /status
  createPdf(token).catch((err) => {
    cache.put(token, {
      status: 'error',
      error: err instanceof Error ? err.message : 'unknown error',
    } as PdfJob)
  })

  return { status: 'progress' }
}

async function createPdf(token: string): Promise<void> {
  const payload = verifyPayload(token)

  if (!payload) {
    cache.put(token, { status: 'error', error: 'invalid or expired token' } as PdfJob)
    return
  }

  const browser = await getBrowser()
  const page = await browser.newPage()

  try {
    const response = await page.goto(`http://localhost:3000/cv/preview?token=${token}`, {
      waitUntil: 'networkidle0',
    })

    if (!response || !response.ok()) {
      cache.put(token, {
        status: 'error',
        error: `unexpected status: ${response?.status() ?? 'no response'}`,
      } as PdfJob)
      return
    }

    const pdf = await page.pdf({ format: 'A4' })
    cache.put(token, { status: 'success', data: pdf } as PdfJob)
  } finally {
    await page.close()
  }
}
