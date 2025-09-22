import * as cheerio from "cheerio";
import type { Listing } from "../../types.ts";
import { randomDelay } from "./misc.ts";
import { USER_AGENT } from "../../misc.ts";

const DOMAIN = "https://www.prace.cz";
const BASE_URL = `${DOMAIN}/nabidky/informatika/`;

function getNextPageUrl(html: string): string | null {
  const $ = cheerio.load(html);
  const nextLink = $(
    ".pager .pager__next a, .pager a[title*='Další'], .pager a:contains('>')",
  ).first();
  if (!nextLink || !nextLink.attr) return null;
  const href = (nextLink.attr("href") || "").trim();
  if (!href) return null;
  try {
    return new URL(href, BASE_URL).toString();
  } catch {
    return href;
  }
}

function clean(s?: string) {
  return (s || "").replace(/\s+/g, " ").trim();
}

function parseListingsFromHtml(
  html: string,
): Listing[] {
  const $ = cheerio.load(html);
  const out: Listing[] = [];

  $("li.search-result__advert").each((_, li) => {
    const $li = $(li);

    const $linkEl = $li.find("h3 a.link, a[data-jd]").first();
    const href = clean($linkEl.attr("href") || "");
    const link = href
      ? (() => {
        try {
          return new URL(href, BASE_URL).toString();
        } catch {
          return href;
        }
      })()
      : "";

    let id = clean($linkEl.attr("id") || $linkEl.attr("data-jd") || "");
    if (!id && link) {
      try {
        const u = new URL(link);
        const parts = u.pathname.split("/").filter(Boolean);
        id = parts[parts.length - 1] || "";
      } catch {
        id = "";
      }
    }

    const title = clean(
      $linkEl.find("strong").first().text() || $linkEl.text(),
    );
    const company = clean(
      $li.find(".search-result__advert__box__item--company").first().text()
        .replace("•", ""),
    );
    const location = clean(
      $li.find(".search-result__advert__box__item--location strong").first()
        .text(),
    );
    const status = clean(
      $li.find(".text-label--important, .search-result__advert__supermax")
        .first().text(),
    );
    const descCandidate = clean(
      $li.find(
        ".search-result__advert__box__item--description, .search-result__advert__desc, p",
      ).first().text(),
    );
    const description = descCandidate || undefined;

    out.push({
      id: id || crypto.randomUUID(),
      title,
      company,
      link,
      status,
      location,
      description,
      expiredAt: "",
      createdAt: new Date().toISOString(),
      clicks: 0,
      source: "prace.cz",
    });
  });

  return out;
}

async function crawlPraceCz(): Promise<Listing[]> {
  const results: Listing[] = [];
  const queue = new Set<string>([BASE_URL]);
  const visited = new Set<string>();

  while (queue.size > 0) {
    const url = queue.values().next().value;
    if (!url) continue;
    queue.delete(url);

    if (!url || visited.has(url)) continue;
    try {
      await randomDelay(1000, 5000);
      console.log(`crawling: ${url}`);
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
      });
      const html = await res.text();
      const newUrl = getNextPageUrl(html);
      const jobs = parseListingsFromHtml(html);

      for (const job of jobs) {
        const isDuplicate = results.some(
          (j) =>
            j.link === job.link ||
            j.title.toLowerCase() === job.title.toLowerCase(),
        );

        if (!isDuplicate) results.push(job);
      }

      if (newUrl) {
        queue.add(newUrl);
      }

      visited.add(url);
    } catch (error) {
      console.error(`❌ Failed to fetch ${url}:`, error);
    }
  }

  return results;
}

export function pracecz(): Promise<Listing[]> {
  return crawlPraceCz();
}
