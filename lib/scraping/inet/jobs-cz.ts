import * as cheerio from "cheerio";
import ky from "ky";
import type { Listing } from "../types.ts";

const DOMAIN = "https://www.jobs.cz";
const BASE_URL = "https://www.jobs.cz/prace/is-it-vyvoj-aplikaci-a-systemu/";
//const BASE_URL = "https://www.jobs.cz/prace/?q%5B%5D=Frontend%20developer";

function getPageListings(html: string): Listing[] {
  const $ = cheerio.load(html);
  const cards = $("article.SearchResultCard");
  const result = new Set<Listing>();

  cards.each((_, element) => {
    const title = $(element).find(".SearchResultCard__titleLink").text().trim();
    const link = $(element).find(".SearchResultCard__titleLink").attr("href");
    const status = $(element).find(".SearchResultCard__status").text().trim();
    const location = $(element)
      .find(".SearchResultCard__footerItem")
      .last()
      .text()
      .trim();

    result.add({ title, status, link: link ?? "", location });
  });

  return Array.from(result);
}

function getNextLinks(html: string): string[] {
  const $ = cheerio.load(html);
  const paginationLinks = $(".Pagination__link");
  const urls: string[] = [];

  paginationLinks.each((_, element) => {
    const href = $(element).attr("href");
    const isNextButton = $(element).hasClass("Pagination__button--next");
    if (!isNextButton && href) {
      urls.push(href);
    }
  });

  return urls;
}

async function crawl() {
  const pending = new Set<string>([BASE_URL]);
  const history = new Set<string>();
  const listings: Listing[] = [];

  while (pending.size > 0) {
    const url = pending.values().next().value;
    if (!url) continue;
    console.log(`Crawling: ${url}`);

    if (history.has(url)) {
      pending.delete(url);
      continue;
    }

    try {
      const html = await (await ky.get(url)).text();
      const pagination = getNextLinks(html);

      for (const page of pagination) {
        pending.add(`${DOMAIN}${page}`);
      }

      for (const job of getPageListings(html)) {
        if (
          listings.find((i) =>
            i.link === job.link ||
            i.title.toLocaleLowerCase() === job.title.toLowerCase()
          )
        ) {
          continue;
        }

        listings.push(job);
      }

      pending.delete(url);
      history.add(url);
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      pending.delete(url);
    }
  }

  return listings;
}

export async function jobscz() {
  return await crawl();
}
