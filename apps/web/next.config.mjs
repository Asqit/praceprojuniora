/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  transpilePackages: ["@ppj/types"],
  rewrites: async () => [
    {
      source: "/api/:path",
      destination: "http://localhost:8000/:path",
    },
  ],
}

export default nextConfig
