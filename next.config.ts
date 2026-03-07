import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages static export
  output: "export",
  distDir: "dist",
  images: {
    unoptimized: true,
  },
  // Skip type checking during build to save memory
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
