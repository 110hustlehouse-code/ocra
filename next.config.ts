import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.app.github.dev"],
  serverExternalPackages: ["@sparticuz/chromium", "playwright-core"],
};

export default nextConfig;
