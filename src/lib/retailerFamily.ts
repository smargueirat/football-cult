// Una sola definición de "minorista distinto".
//
// El catálogo guarda la tienda como el nombre del feed: "FootStoreES" y
// "FootStoreFR" son DOS valores de `store`, pero una sola empresa (misma
// web, mismo stock, el mismo precio en otro dominio). Contarlos como dos
// tiendas hacía que el sitio dijera "comparando 2 tiendas" frente a un
// espejo de sí mismo. Auditoría 2026-10-02: en ropa, 6.918 de 7.588 fichas
// tenían ≥2 ofertas y 0 tenían ≥2 minoristas distintos; en entrenamiento
// 1.357 contra 0; en tickets, las 2.588 fichas eran FootballTicketNet UK +
// US.
//
// Familia = la empresa detrás del nombre, sin la variante regional:
//   FootStoreES / FootStoreFR            -> footstore
//   eBay / eBay ES / eBay IT / eBay GB   -> ebay   (marketplace)
//   Pro:Direct ES / Pro:Direct Soccer    -> prodirect
//   AdidasES / AdidasPT, NikeCL / NikeAR -> adidas, nike ...
//
// Sin imports a propósito: lo usan el sitemap, componentes "use client" y
// scripts, y no debe arrastrar el catálogo (ver el aviso en productMeta.ts).

// Sufijos regionales que el feed pega al nombre (en mayúsculas, sin
// espacio -- "FootStoreES" -- o separados -- "eBay ES").
const REGION_SUFFIX = /(ES|FR|IT|DE|UK|GB|US|PT|CH|BR|AR|CL|IE|MX)$/;

// Casos que la regla general no cubre (nombres que difieren de verdad).
const FAMILY_ALIASES: Record<string, string> = {
  prodirectsoccer: "prodirect",
};

// Nombre para mostrar de las familias conocidas. Las no listadas muestran
// el nombre del feed sin el sufijo regional.
const FAMILY_LABEL: Record<string, string> = {
  ebay: "eBay",
  footstore: "FootStore",
  sportisgood: "SportIsGood",
  prodirect: "Pro:Direct",
  adidas: "adidas",
  nike: "Nike",
  puma: "Puma",
  futbolemotion: "FutbolEmotion",
  planetfoot: "PlanetFoot",
  forumsport: "Forum Sport",
  amazon: "Amazon",
  fansjerseyhub: "FansJerseyHub",
  bstn: "BSTN",
  gigasport: "Gigasport",
  decathlon: "Decathlon",
  cloviscalcados: "Clovis Calçados",
  footballticketnet: "Football TicketNet",
  futbolfactory: "Futbol Factory",
  deporteoutlet: "DeporteOutlet",
};

function stripRegion(store: string): string {
  const raw = store.trim();
  const m = REGION_SUFFIX.exec(raw);
  // Solo se quita si queda un nombre de verdad ("BSTNIT" -> "BSTN").
  return m && raw.length - m[1].length >= 3 ? raw.slice(0, raw.length - m[1].length).trim() : raw;
}

/** Clave estable de la empresa detrás de `store` (minúsculas, sin región). */
export function getRetailerFamily(store: string): string {
  const key = stripRegion(store).toLowerCase().replace(/[^a-z0-9]/g, "");
  return FAMILY_ALIASES[key] ?? key;
}

/** Nombre legible de la familia ("FootStoreFR" -> "FootStore"). */
export function getRetailerLabel(store: string): string {
  return FAMILY_LABEL[getRetailerFamily(store)] ?? stripRegion(store);
}

type HasStore = { store: string };

/** Minoristas distintos entre las ofertas (espejos regionales cuentan 1). */
export function countDistinctRetailers(offers: readonly HasStore[]): number {
  return new Set(offers.map((o) => getRetailerFamily(o.store))).size;
}

/** Nombres legibles de los minoristas distintos, en orden de aparición. */
export function distinctRetailerLabels(offers: readonly HasStore[]): string[] {
  const seen = new Map<string, string>();
  for (const o of offers) {
    const f = getRetailerFamily(o.store);
    if (!seen.has(f)) seen.set(f, getRetailerLabel(o.store));
  }
  return [...seen.values()];
}

/** Una oferta por familia (la que gane según `better`), p. ej. la más barata. */
export function bestPerRetailer<T extends HasStore>(
  offers: readonly T[],
  better: (a: T, b: T) => boolean,
): T[] {
  const m = new Map<string, T>();
  for (const o of offers) {
    const f = getRetailerFamily(o.store);
    const cur = m.get(f);
    if (!cur || better(o, cur)) m.set(f, o);
  }
  return [...m.values()];
}

/**
 * Texto honesto de cuántas tiendas hay: una sola -> "Solo en <tienda>",
 * 2+ distintas -> "Comparando N tiendas". `s` es t.product (sin importarlo,
 * para que este archivo siga sin dependencias).
 */
export function retailerCountText(
  offers: readonly HasStore[],
  s: { onlyIn: string; comparingStores: string },
): string {
  const labels = distinctRetailerLabels(offers);
  if (labels.length === 0) return "";
  return labels.length === 1
    ? s.onlyIn.replace("{store}", labels[0])
    : s.comparingStores.replace("{n}", String(labels.length));
}
