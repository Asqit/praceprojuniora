import type { Listing } from "../lib/types.ts";
import { Footer } from "../components/footer/footer.tsx";
import { Navbar } from "../components/navbar/navbar.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import ky from "ky";
import App from "../islands/app/index.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    try {
      const url = new URL("/api/listings", req.url);
      const res = await ky.get(url);
      const { data } = await res.json<{ data: Listing[] }>();
      return ctx.render(data);
    } catch (error) {
      console.error(error);
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
