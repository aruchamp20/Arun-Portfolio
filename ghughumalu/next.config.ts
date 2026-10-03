import type { NextConfig } from "next";

/**
 * `STATIC_EXPORT=1 npm run build` writes a fully static site to ./out.
 * Set BASE_PATH=/some/prefix when the site is hosted under a sub-path
 * (the portfolio's GitHub Pages workflow builds it at /Arun-Portfolio/ghughumalu).
 */
const basePath = process.env.BASE_PATH || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: process.env.STATIC_EXPORT ? "export" : undefined,
  basePath: basePath || undefined,
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: true },
  transpilePackages: ["three"],
};

export default nextConfig;
