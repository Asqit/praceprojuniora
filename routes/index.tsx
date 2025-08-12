import type { Listing } from "../lib/types.ts";
import { Footer } from "../components/footer/footer.tsx";
import { Navbar } from "../components/navbar/navbar.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import App from "../islands/app/index.tsx";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const res = await fetch("/api/listings");
    const { data } = await res.json();
    return ctx.render(data as Listing[]);
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
