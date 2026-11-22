import { describe, expect, test } from 'bun:test'
import { parseInworkDetailHtml, parseSitemapBody } from './inwork-cz'

describe('inwork.cz provider', () => {
  test('parses current job-detail fields', () => {
    const url = 'https://www.inwork.cz/prace/olomouc/junior-frontend/'
    const html = `
      <div class="iw-offer-detail__headline"><h1>Junior Frontend Developer</h1></div>
      <div class="rich-text-content">
        <p class="__texty_v_inzeratu">Vývoj webové aplikace v Reactu.</p>
      </div>
      <div class="iw-offer-detail__info">
        <div class="iw-offer-detail__info__item">
          <span class="__tabulka_nadpisek">Pracoviště:</span>
          <span class="__tabulka_text">Olomouc</span>
        </div>
        <div class="iw-offer-detail__info__item">
          <span class="__tabulka_nadpisek">Mzda:</span>
          <span class="__tabulka_text">40 000 - 50 000 Kč/měs.</span>
        </div>
        <div class="iw-offer-detail__info__item">
          <span class="__tabulka_nadpisek">Firma:</span>
          <span class="__tabulka_text">Acme s.r.o.</span>
        </div>
        <div class="iw-offer-detail__info__bottom">
          <div><span>Vloženo:</span>24.09.2026</div>
        </div>
      </div>
    `

    expect(parseInworkDetailHtml(html, url)).toMatchObject({
      title: 'Junior Frontend Developer',
      company: 'Acme s.r.o.',
      location: 'Olomouc',
      description: 'Vývoj webové aplikace v Reactu.',
      salaryMin: 40000,
      salaryMax: 50000,
      createdAt: '2026-09-24T00:00:00.000Z',
      link: url,
      source: 'inwork.cz',
    })
  })

  test('parses detail pages with the current unwrapped title and description layout', () => {
    const url = 'https://www.inwork.cz/prace/brno/devops-cloud-platform-engineer/'
    const html = `
      <main>
        <h1 class="__nadpis_inzeratu">DevOps Cloud Platform Engineer</h1>
        <div class="rich-text-content">
          <h2>Informace o pracovním místě</h2>
          <p class="__texty_v_inzeratu"></p>
          <p>Správa cloudové infrastruktury.</p>
        </div>
        <div class="iw-offer-detail__info">
          <div class="iw-offer-detail__info__item">
            <span class="__tabulka_nadpisek">Pracoviště:</span>
            <span class="__tabulka_text">Brno</span>
          </div>
          <div class="iw-offer-detail__info__item">
            <span class="__tabulka_nadpisek">Firma:</span>
            <span class="__tabulka_text">Manpower</span>
          </div>
          <div class="iw-offer-detail__info__bottom">
            <div><span>Vloženo:</span>13.11.2026</div>
          </div>
        </div>
      </main>
    `

    const listing = parseInworkDetailHtml(html, url)

    expect(listing).toMatchObject({
      title: 'DevOps Cloud Platform Engineer',
      company: 'Manpower',
      location: 'Brno',
      createdAt: '2026-11-13T00:00:00.000Z',
    })
    expect(listing.description).toContain('Správa cloudové infrastruktury.')
  })

  test('streams sitemap URLs and filters out irrelevant jobs', async () => {
    const xml = `
      <urlset>
        <url><loc>https://www.inwork.cz/prace/junior-frontend-developer/</loc></url>
        <url><loc>https://www.inwork.cz/prace/ridic-nakladniho-automobilu/</loc></url>
      </urlset>
    `
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(xml))
        controller.close()
      },
    })

    await expect(parseSitemapBody(body)).resolves.toEqual({
      urls: ['https://www.inwork.cz/prace/junior-frontend-developer/'],
      totalLocs: 2,
    })
  })
})
