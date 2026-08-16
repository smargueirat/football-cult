import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Largest actual render on the site is the detail page at ~90vw on a
    // ~1024px viewport (~920px); nothing needs the default 3840/2048px
    // buckets. Fewer buckets means fewer distinct Image Optimization
    // transformations per source image (each is billed once, then cached).
    deviceSizes: [400, 640, 828, 1080],
    imageSizes: [64, 128, 256],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images2.productserve.com" },
      { protocol: "https", hostname: "cdn.blazimg.com" },
      { protocol: "https", hostname: "b2c.spacefoot.com" },
      { protocol: "https", hostname: "www.sportspar.de" },
      { protocol: "https", hostname: "i.ebayimg.com" },
      { protocol: "https", hostname: "images.weserv.nl" },
    ],
  },
};

export default nextConfig;
