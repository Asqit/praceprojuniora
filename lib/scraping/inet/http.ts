import ky from "ky";

export async function createHttpClient(): Promise<Deno.HttpClient> {
  const proxy = await (await ky.get(
    "https://cdn.jsdelivr.net/gh/proxifly/free-proxy-list@main/proxies/protocols/https/data.txt",
  )).text();

  return Deno.createHttpClient({
    proxy: {
      transport: "http",
      url: proxy,
    },
  });
}
