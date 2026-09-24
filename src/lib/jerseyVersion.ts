// Versión JUGADOR vs HINCHA de una camiseta.
//
// Las marcas venden dos prendas distintas del mismo equipo y temporada:
// la de jugador (adidas "Authentic", Nike "Match"/"Dri-FIT ADV", Puma
// "Authentic"), con corte ajustado y tejido de competición, y la de
// hincha ("Stadium", "Fan", "Replica"). Suelen separarlas 50-70 EUR.
//
// Estaban mezcladas en la misma ficha: 197 de 1.831 productos
// comparables (10%) tenían ofertas de las dos, así que el sitio decía
// "esta tienda la tiene 60 EUR más barata" comparando prendas distintas
// -- justo lo que un comparador no puede hacer. Detectado en la
// auditoría del 2026-09-24; mismo tipo de bug que el de colorways de
// botas (2026-09-14), dos productos distintos tratados como uno.
//
// Se resuelve leyendo el título de cada oferta, no migrando datos: la
// señal ya está ahí y así vale también para todo lo que entre mañana.

export type JerseyVersion = "player" | "fan";

// Inequívocas: si aparecen, es versión jugador en cualquier tienda.
const PLAYER_STRONG =
  /\b(player\s*issue|player\s*version|versi[oó]n\s*jugador|vers[aã]o\s*jogador|heat[\s.\-]*rdy|dri[\s.\-]*fit[\s.\-]*adv|on[\s.\-]*field|match\s*version)\b/;

// "Authentic" es el nombre comercial de la gama de jugador de adidas y
// Puma, PERO en un marketplace suele querer decir "no es una imitación":
// 428 títulos de eBay lo usan así, contra ~34 de tiendas oficiales.
// Tomarlo como versión jugador ahí habría etiquetado mal cientos de
// ofertas, así que solo cuenta fuera de los marketplaces.
const PLAYER_BRAND_LINE = /\b(authentic|authentique|aut[eé]ntic[ao])\b/;

const MARKETPLACES = new Set([
  "eBay",
  "eBay ES",
  "eBay IT",
  "eBay US",
  "Amazon",
  "FansJerseyHub",
]);

function normalize(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/** Versión de una oferta concreta. Sin título no se puede saber, y el
 *  reparto real es ~9 de cada 10 de hincha, así que ese es el supuesto. */
export function offerVersion(offer: { store: string; title?: string }): JerseyVersion {
  const title = normalize(offer.title ?? "");
  if (!title) return "fan";
  if (PLAYER_STRONG.test(title)) return "player";
  if (!MARKETPLACES.has(offer.store) && PLAYER_BRAND_LINE.test(title)) return "player";
  return "fan";
}

/** Agrupa las ofertas por versión. La de hincha va primero porque es la
 *  que busca la mayoría y la que marca el precio de referencia. */
export function splitByVersion<T extends { store: string; title?: string }>(
  offers: T[],
): { fan: T[]; player: T[]; mixed: boolean } {
  const fan: T[] = [];
  const player: T[] = [];
  for (const o of offers) (offerVersion(o) === "player" ? player : fan).push(o);
  return { fan, player, mixed: fan.length > 0 && player.length > 0 };
}
