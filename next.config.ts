import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["pdfjs-dist"],
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
