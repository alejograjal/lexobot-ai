import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['www.chat.lexobot-ai.com'],
  },
};

export default nextConfig;
