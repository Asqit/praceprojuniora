import { describe, expect, test } from 'bun:test'
import { getNextPageUrl, parseListingsFromHtml } from './prace-cz'

describe('prace.cz provider', () => {
  test('parses listing fields from advert articles', () => {
    const html = `
      <article id="advert-123">
        <a data-testid="advert-link" href="/nabidka/junior-frontend/">Junior frontend developer</a>
        <span class="typography-body-medium-semibold">Praha</span>
        <span class="typography-body-medium-regular">Acme s.r.o.</span>
      </article>
    `

    const result = parseListingsFromHtml(html, 'https://www.prace.cz/nabidky/informatika/')

    expect(result.complete).toBe(true)
    expect(result.listings).toHaveLength(1)
    expect(result.listings[0]).toMatchObject({
      title: 'Junior frontend developer',
      company: 'Acme s.r.o.',
      location: 'Praha',
      link: 'https://www.prace.cz/nabidka/junior-frontend/',
      source: 'prace.cz',
    })
  })

  test('resolves the next-page URL relative to the listing page', () => {
    const html = '<a rel="next" href="?page=2">Další</a>'

    expect(getNextPageUrl(html)).toBe('https://www.prace.cz/nabidky/informatika/?page=2')
  })
})
