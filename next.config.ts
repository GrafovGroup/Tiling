import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep search and social metadata in the initial document head.
  htmlLimitedBots: /.*/,
};

export default nextConfig;
