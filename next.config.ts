import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify/Cloudflare deployment config
  output: "standalone",
  images: {
    unoptimized: true,
  },
  // Skip type checking during build to save memory
  typescript: {
    ignoreBuildErrors: true,
  },
  // Allow all hosts (for Cloudflare)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
