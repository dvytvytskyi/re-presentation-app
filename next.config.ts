import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true
  },
  // Experimental options if needed in the future
  experimental: {
    // turbo: { root: './' } 
  }
};

export default nextConfig;
