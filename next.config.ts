import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Ada package-lock.json lain di folder home; pin root ke folder proyek ini.
  turbopack: { root: process.cwd() },
};

export default nextConfig;
