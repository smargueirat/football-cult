// 2026-08-11: the team's free-tier Vercel Image Optimization quota (5K
// transformations/month) is exhausted -- Vercel hard-blocks (402
// OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED) any transformation it hasn't
// already cached, which was breaking product photos site-wide. Decision:
// stay on the free plan (see conversation), so instead of paying per
// transformation we shrink images ourselves, for free, before they ever
// reach next/image -- which then serves them `unoptimized` so Vercel's
// optimizer never touches them again:
//  - eBay (i.ebayimg.com) and the Awin proxy (images2.productserve.com)
//    already serve ~200-225px thumbnails at the source. Nothing to gain
//    from resizing further.
//  - Shopify CDN (cdn.shopify.com, MysteryShirtClub's ~1000px photos)
//    supports a native `?width=` resize param -- free, no third party.
//  - Everything else (mostly direct full-res store photos, 1800-2400px --
//    FootStoreFR/SportIsGoodFR/AdidasES etc.) gets routed through
//    images.weserv.nl, an open-source, free, production-permitted image
//    resize/cache proxy (backed by Cloudflare, edge-cached for a year).
//
// 2026-08-16: the short domain (wsrv.nl) started hanging indefinitely
// (connection timeout, confirmed via curl -- other Cloudflare-backed
// sites resolve and respond fine, so it's specific to that hostname),
// breaking product photos site-wide for anything not already small or
// Shopify-hosted. Switched to the original/alternate domain for the
// same service, images.weserv.nl, which responds normally.
const ALREADY_SMALL_HOSTS = ["i.ebayimg.com", "images2.productserve.com"];

export function getDisplaySrc(url: string, width: number): string {
  if (ALREADY_SMALL_HOSTS.some((h) => url.includes(`://${h}/`))) {
    return url;
  }
  if (url.includes("://cdn.shopify.com/")) {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}width=${width}`;
  }
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp`;
}

// La ficha de la camiseta pide la foto en anchos distintos (srcSet
// 500w/800w/1200w, ver JerseyGallery.tsx) a los que ya se cargaron en
// la card del catálogo -- por más que sea la misma foto, son URLs
// distintas, así que siempre es un pedido nuevo. Para wsrv.nl (el
// proxy que se usa para fotos que no vienen de Shopify/eBay/Awin) la
// PRIMERA vez que se pide un ancho puntual es un viaje real: wsrv tiene
// que ir a buscar la foto original y recién devolverla.
//
// Antes esto solo precargaba 1200w -- pero el navegador elige QUÉ ancho
// del srcSet pedir según el viewport real (en desktop, 45vw de una
// pantalla típica cae más cerca de 800w que de 1200w), así que en
// desktop la precarga casi siempre calentaba el tamaño equivocado y la
// demora seguía. Ahora precarga los tres, así el que el navegador
// termine eligiendo ya está listo.
const DETAIL_PHOTO_WIDTHS = [500, 800, 1200];

export function prefetchDetailPhoto(url: string | undefined): void {
  if (!url || typeof window === "undefined") return;
  for (const width of DETAIL_PHOTO_WIDTHS) {
    const img = new window.Image();
    img.src = getDisplaySrc(url, width);
  }
}
