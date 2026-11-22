import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build a fully static site into ./out, which is uploaded to S3.
  output: "export",
  // S3 serves folders as /path/index.html, so emit pages that way.
  trailingSlash: true,
  // The Next.js image optimizer needs a server; a static export serves images as-is.
  images: { unoptimized: true },
};

export default nextConfig;
