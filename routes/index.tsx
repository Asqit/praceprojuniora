import type { Listing } from "../lib/types.ts";
import { Footer } from "../components/footer/footer.tsx";
import { Navbar } from "../components/navbar/navbar.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import ky from "ky";
import App from "../islands/app/index.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    try {
      const baseUrl = new URL(req.url);
      const url = new URL(
        "/api/listings",
        `${baseUrl.protocol}//${baseUrl.host}`,
      );
      const res = await ky.get(url, { timeout: 1000 });
      const { data } = await res.json<{ data: Listing[] }>();
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
  return (
    <>
      <Navbar />
      <App initialData={data} />
      <Footer />
    </>
  );
}
