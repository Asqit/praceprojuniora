import { CSS, render as renderMarkdown } from "@deno/gfm";
import puppeteer from "puppeteer";

export async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { markdown } = await req.json();

    if (!markdown) {
      return new Response("Markdown content required", { status: 400 });
    }

    // Convert markdown to HTML
    const html = renderMarkdown(markdown);

    // Create styled HTML document
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

    // Generate PDF with Puppeteer
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

    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="cv.pdf"',
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new Response("PDF generation failed", { status: 500 });
  }
}
