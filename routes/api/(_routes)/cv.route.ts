import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import { CSS, render as renderMarkdown } from "@deno/gfm";
import puppeteer from "puppeteer";

const router = new Hono();

// ------------------------------------------------------------------------------ Generate PDF
const pdfSchema = z.object({
  markdown: z.string().min(1),
});

router.post("/pdf", zValidator("json", pdfSchema), async (c) => {
  const { markdown } = c.req.valid("json");
  const html = renderMarkdown(markdown);

  const styledHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            ${CSS}
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 2rem;
            }
            @media print {
              body { margin: 0; padding: 1rem; }
              h1 { page-break-after: avoid; }
              h2, h3 { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-web-security",
      "--disable-features=VizDisplayCompositor",
    ],
    executablePath: Deno.env.get("PUPPETEER_EXECUTABLE_PATH"),
  });

  const page = await browser.newPage();
  await page.setContent(styledHtml, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "1cm",
      right: "1cm",
      bottom: "1cm",
      left: "1cm",
    },
  });

  await browser.close();

  return c.body(pdf as Uint8Array<ArrayBuffer>, 201, {
    "Content-Type": "application/pdf",
    "Content-Disposition": 'attachment; filename="cv.pdf"',
  });
});

export default router;
