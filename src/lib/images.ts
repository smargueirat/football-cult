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
//    FootStoreFR/SportIsGoodFR/AdidasES etc.) gets routed through wsrv.nl,
//    an open-source, free, production-permitted image resize/cache proxy
//    (https://wsrv.nl, backed by Cloudflare, edge-cached for a year).
const ALREADY_SMALL_HOSTS = ["i.ebayimg.com", "images2.productserve.com"];

export function getDisplaySrc(url: string, width: number): string {
  if (ALREADY_SMALL_HOSTS.some((h) => url.includes(`://${h}/`))) {
    return url;
  }
  if (url.includes("://cdn.shopify.com/")) {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}width=${width}`;
  }
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp`;
}

// La ficha de la camiseta pide la foto en un ancho distinto (1200w) al
// que ya se cargó en la card del catálogo (hasta 600w) -- por más que
// sea la misma foto, es una URL distinta, así que siempre es un pedido
// nuevo. Para wsrv.nl (el proxy que se usa para fotos que no vienen de
// Shopify/eBay/Awin) la PRIMERA vez que se pide un ancho puntual es un
// viaje real: wsrv tiene que ir a buscar la foto original y recién
// devolverla -- eso es lo que se sentía como demora al entrar a una
// camiseta desde el celular. Esto arranca esa descarga en cuanto el
// dedo toca la card (o el mouse entra, en desktop), así para cuando
// termina de cargar la página siguiente la foto ya está lista o casi.
export function prefetchDetailPhoto(url: string | undefined): void {
  if (!url || typeof window === "undefined") return;
  const img = new window.Image();
  img.src = getDisplaySrc(url, 1200);
}
