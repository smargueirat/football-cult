// eBay (i.ebayimg.com) and the Awin image proxy (images2.productserve.com)
// already serve fixed ~200-225px thumbnails -- running them through Vercel's
// Image Optimization again burns transformation quota for zero quality gain
// (there's nothing bigger to downscale). Shopify/spacefoot/blazimg sources
// are full-res (1000-2400px) and would normally benefit from optimization.
//
// 2026-08-11: the team's free-tier Image Optimization quota is fully
// exhausted for the month -- Vercel now hard-blocks (402
// OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED) any transformation not already
// cached, which was breaking product photos site-wide. Until the quota
// resets or the plan changes, ALL remote photos are served unoptimized
// (bypassing Vercel's optimizer entirely) so nothing 402s. Revisit once
// that's resolved -- the Shopify/spacefoot/blazimg sources are still worth
// optimizing normally when the quota allows it again.
export function isPreOptimizedImage(_url: string | undefined | null): boolean {
  return true;
}
