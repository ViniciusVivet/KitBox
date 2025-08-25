import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    ppr: false,
    useCache: false,
    inlineCss: false,
  },
}

export default nextConfig
