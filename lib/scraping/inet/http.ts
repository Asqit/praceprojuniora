export async function createHttpClient(): Promise<Deno.HttpClient> {
  return Deno.createHttpClient({
    proxy: {
      transport: "http",
      url: "http://epvaifeg-rotate:l36n27kiw7w4@p.webshare.io:80",
    },
  });
}
