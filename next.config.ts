import type { NextConfig } from "next";

/**
 * `STATIC_EXPORT=1 npm run build` writes a fully static copy of the site to ./out
 * (no server needed). Set BASE_PATH=/repo-name when hosting under a sub-path,
 * e.g. GitHub Pages (see .github/workflows/deploy-pages.yml).
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: process.env.STATIC_EXPORT ? "export" : undefined,
  basePath: process.env.BASE_PATH || undefined,
  images: { unoptimized: true },
};

export default nextConfig;
