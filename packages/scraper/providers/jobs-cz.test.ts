import { describe, expect, test } from 'bun:test'
import { getPaginationUrls, parseJobCards } from './jobs-cz'

describe('jobs.cz provider', () => {
  test('parses listing fields from current job-card attributes', () => {
    const html = `
      <article class="SearchResultCard">
        <h2 data-test-ad-title="Junior frontend developer">
          <a data-link="jd-detail" href="/rpd/123/?tracking=1">Junior frontend developer</a>
        </h2>
        <div data-test-ad-status="active">Nová nabídka</div>
        <footer>
          <ul>
            <li class="SearchResultCard__footerItem">Acme s.r.o.</li>
            <li class="SearchResultCard__footerItem" data-test="serp-locality">Praha</li>
          </ul>
        </footer>
      </article>
    `

    const result = parseJobCards(html, 'https://www.jobs.cz/prace/it/')

    expect(result.complete).toBe(true)
    expect(result.listings).toHaveLength(1)
    expect(result.listings[0]).toMatchObject({
      title: 'Junior frontend developer',
      status: 'Nová nabídka',
      company: 'Acme s.r.o.',
      location: 'Praha',
      link: 'https://www.jobs.cz/rpd/123/',
      source: 'jobs.cz',
    })
  })

  test('collects pagination links and ignores the next button', () => {
    const html = `
      <a class="Pagination__link" href="/prace/it/?page=1">1</a>
      <a class="Pagination__link" href="/prace/it/?page=2">2</a>
      <a class="Pagination__link Pagination__button--next" href="/prace/it/?page=2">Další</a>
    `

    expect(getPaginationUrls(html)).toEqual([
      'https://www.jobs.cz/prace/it/?page=1',
      'https://www.jobs.cz/prace/it/?page=2',
    ])
  })
})
