import type { Listing } from "../lib/types.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import ky from "ky";
import App from "../islands/app/index.tsx";
import GamificationTracker from "../islands/gamification-stats.tsx";
import Guestbook from "../islands/guestbook.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    try {
      const baseUrl = new URL(req.url);
      const url = new URL(
        "/api/listings",
        `${baseUrl.protocol}//${baseUrl.host}`
      );
      const res = await ky.get(url, {
        timeout: 1000,
        headers: { Origin: "https://praceprojuniora.cz" },
      });
      const { data } = await res.json<{ data: Listing[]; total: number; hasMore: boolean }>();
      return ctx.render(data);
    } catch (error) {
      console.error("Failed to fetch listings:", {
        error: (error as Error)?.message ?? "unknown error",
        url: req.url,
        timestamp: new Date().toISOString(),
        userAgent: req.headers.get("user-agent"),
      });
      return ctx.render([]);
    }
  },
};

export default function RootPage({ data }: PageProps<Listing[]>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Práce Pro Juniora",
    description:
      "Najděte si práci vhodnou pro juniory v IT oboru – aktuální nabídky juniorních pozic, frontend, backend a další vývojářské role.",
    url: "https://praceprojuniora.cz",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://praceprojuniora.cz/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const jobPostingsData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Junior IT Job Listings",
    numberOfItems: data.length,
    itemListElement: data.slice(0, 10).map((job, index) => ({
      "@type": "JobPosting",
      position: index + 1,
      title: job.title,
      hiringOrganization: {
        "@type": "Organization",
        name: job.company,
      },
      jobLocation: {
        "@type": "Place",
        address: job.location,
      },
      url: job.link,
      datePosted: job.createdAt,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingsData) }}
      />

      <main>
        <section aria-label="Junior IT job listings">
          <h1 className="sr-only">
            Práce Pro Juniora - Aktuální nabídky práce pro juniory v IT
          </h1>
          <App initialData={data} />
          <GamificationTracker />
          <Guestbook />
        </section>
      </main>
    </>
  );
}
