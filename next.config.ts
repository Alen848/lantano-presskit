import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static presskit: `next build` emits /out, deployable to any static host.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: {
    globalNotFound: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
