import type { NextConfig } from "next";

/**
 * `STATIC_EXPORT=1 ASSET_PREFIX=./ npm run build` writes a fully static copy of
 * the site to ./out that works from any folder or sub-path (no server needed).
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: process.env.STATIC_EXPORT ? "export" : undefined,
  assetPrefix: process.env.ASSET_PREFIX || undefined,
  images: { unoptimized: true },
};

export default nextConfig;
