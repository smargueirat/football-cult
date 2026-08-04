import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images2.productserve.com" },
      { protocol: "https", hostname: "cdn.blazimg.com" },
      { protocol: "https", hostname: "b2c.spacefoot.com" },
      { protocol: "https", hostname: "www.sportspar.de" },
    ],
  },
};

export default nextConfig;
