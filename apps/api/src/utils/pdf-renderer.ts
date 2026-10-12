import { verifyPayload } from '@ppj/cv-auth'
import puppeteer, { type Browser, type Page } from 'puppeteer'

const EXPORT_TIMEOUT_MS = 45_000
const BROWSER_LAUNCH_TIMEOUT_MS = 15_000
const NAVIGATION_TIMEOUT_MS = 15_000
const MAX_CONCURRENT_EXPORTS = 1

let browserPromise: Promise<Browser> | null = null
let activeExports = 0

export class PdfExportBusyError extends Error {
  constructor() {
    super('A PDF export is already running')
    this.name = 'PdfExportBusyError'
  }
}

async function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = puppeteer
      .launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        timeout: BROWSER_LAUNCH_TIMEOUT_MS,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      })
      .catch((error) => {
        browserPromise = null
        throw error
      })
  }

  const browser = await browserPromise
  if (!browser.connected) {
    browserPromise = null
    return getBrowser()
  }

  return browser
}

export async function renderCvPdf(token: string): Promise<Uint8Array> {
  if (activeExports >= MAX_CONCURRENT_EXPORTS) {
    throw new PdfExportBusyError()
  }

  activeExports += 1
  try {
    return await renderCvPdfInternal(token)
  } finally {
    activeExports -= 1
  }
}

async function renderCvPdfInternal(token: string): Promise<Uint8Array> {
  const deadline = Date.now() + EXPORT_TIMEOUT_MS
  const payload = verifyPayload(token)
  if (!payload || payload.kind !== 'cv_export') {
    throw new Error('Invalid or expired CV export payload')
  }

  const normalizedNodeEnv = (process.env.NODE_ENV ?? 'development').toLowerCase()
  const frontendBaseUrl = process.env.FRONTEND_URL?.trim() || 'http://localhost:3000'
  if (!process.env.FRONTEND_URL?.trim() && normalizedNodeEnv === 'production') {
    throw new Error('FRONTEND_URL env variable is required in production for PDF export')
  }

  const previewUrl = new URL(
    `/cv/preview?token=${encodeURIComponent(token)}`,
    frontendBaseUrl
  ).toString()

  let page: Page | null = null
  let timedOut = false
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const deadlineError = new Error(`CV PDF export exceeded ${EXPORT_TIMEOUT_MS}ms`)
  const deadlinePromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () => {
        timedOut = true
        void page?.close().catch(() => {})
        reject(deadlineError)
      },
      Math.max(0, deadline - Date.now())
    )
  })

  try {
    const renderPromise = (async () => {
      const browser = await getBrowser()
      const currentPage = await browser.newPage()
      if (timedOut) {
        await currentPage.close().catch(() => {})
        throw deadlineError
      }
      page = currentPage

      const navigationTimeout = Math.min(NAVIGATION_TIMEOUT_MS, Math.max(1, deadline - Date.now()))
      const response = await currentPage.goto(previewUrl, {
        waitUntil: 'domcontentloaded',
        timeout: navigationTimeout,
      })

      if (!response?.ok()) {
        throw new Error(`CV preview returned status ${response?.status() ?? 'no response'}`)
      }

      await currentPage.waitForSelector('[data-cv-ready="true"]', {
        timeout: Math.max(1, deadline - Date.now()),
      })
      await currentPage.emulateMediaType('print')
      await currentPage.evaluate(async () => {
        await document.fonts.ready
        await Promise.all(Array.from(document.images, (image) => image.decode().catch(() => {})))
      })

      return currentPage.pdf({ format: 'A4', printBackground: true })
    })()

    return await Promise.race([renderPromise, deadlinePromise])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
    await page?.close().catch(() => {})
  }
}
