// Enlaces salientes propios: /go/<hash>?k=...&p=...
//
// Todo clic a una tienda pasa por acá en vez de ir directo a la red de
// afiliados. Sirve para tres cosas que el enlace directo no permite:
// contar el clic aunque GA4 esté bloqueado o sin consentimiento, cambiar de
// red sin republicar el sitio, y detectar ofertas muertas.
//
// El destino NUNCA viaja en la URL (sería un redirect abierto): el servidor
// lo resuelve contra el catálogo. El id es un hash de la URL de la oferta,
// que se calcula igual en el navegador y en el servidor, y el producto va
// aparte para no tener que cargar los siete catálogos juntos.

export const GO_KINDS = {
  j: "camiseta",
  b: "botas",
  g: "guantes",
  p: "pelotas",
  a: "ropa",
  e: "entrenamiento",
  t: "tickets",
} as const;
export type GoKind = keyof typeof GO_KINDS;

// cyrb53: hash de 53 bits, sin dependencias y sincrónico (crypto.subtle no
// lo es). Colisión dentro de UN producto (3-30 URLs): despreciable.
export function offerHash(url: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < url.length; i++) {
    const c = url.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

export function goHref(p: {
  kind: GoKind;
  productId: string;
  url: string;
  locale: string;
  /** Tipo de página donde está el botón: ficha | comparar. */
  origin: "ficha" | "comparar";
  position?: number;
  isBest?: boolean;
}): string {
  const q = new URLSearchParams({ k: p.kind, p: p.productId, l: p.locale, o: p.origin });
  if (p.position != null) q.set("n", String(p.position));
  if (p.isBest) q.set("b", "1");
  return `/go/${offerHash(p.url)}?${q}`;
}

// Marca `j=1` en el /go/ que la persona toca (puntero: ratón, dedo, botón
// central o derecho; o clic/Enter). Un robot que sigue los href del HTML
// no la trae; en plena ráfaga es lo que separa a la persona (ver
// botReason en src/lib/goOut.ts). Se instala una vez, desde ConsentBanner.
let marking = false;
export function markGoClicks(): void {
  if (marking) return;
  marking = true;
  const mark = (e: Event) => {
    const a = (e.target as Element | null)?.closest?.('a[href^="/go/"]');
    const href = a?.getAttribute("href");
    if (a && href && !/[?&]j=1/.test(href)) a.setAttribute("href", `${href}&j=1`);
  };
  document.addEventListener("pointerdown", mark, true);
  document.addEventListener("click", mark, true);
}
