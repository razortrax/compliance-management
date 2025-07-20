import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Minimal config for development stability
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable problematic optimizations in development
      config.optimization.splitChunks = false;
    }
    return config;
  }
};

export default nextConfig;
