// Ofertas con botón directo a tienda (/go/), armadas en el SERVIDOR: el
// cliente (components/DirectDeals.tsx) solo recibe unas pocas tarjetas y
// elige, por país, la primera oferta que envía allí. Nunca importar esto
// desde un componente "use client": arrastra los siete catálogos.
//
// Por qué existe (análisis de tráfico 2026-10-09): la home y los listados
// reciben el 75 % de las vistas y no daban NINGÚN clic a tienda; solo
// convertían las fichas. Con esto, home -> tienda es un toque.
import type { HubLocale } from "@/data/teamMeta";
import type { Product } from "@/data/products";
import { dealImage, dealName, historicLowRows, verifiedDropRows, type DealRow, type DealSection } from "@/lib/dealsData";
import { isComparableStore } from "@/lib/officialStores";
import { seasonSortValue, teamCategory } from "@/lib/productMeta";
import { goHref, type GoKind } from "@/lib/go";
import { bootOfferTotalInEUR, offerTotalInEUR, type BootCurrencyCode, type OfferCurrencyCode } from "@/lib/offerMoney";
import { gearName, jerseyName, type GearLike } from "@/lib/seoMeta";
import { productImage } from "@/lib/productPhoto";
import { CONV } from "@/lib/convStrings";

export interface DealOffer {
  store: string;
  /** URL de la oferta (para saber si el envío está medido; el clic va por `href`). */
  url: string;
  price: number;
  shipping: number;
  currency: OfferCurrencyCode;
  href: string;
}

export interface DirectDeal {
  key: string;
  /** Ruta de la ficha sin idioma (LocaleLink lo añade). */
  path: string;
  name: string;
  img: string;
  /** Precio anterior verificado (solo bajadas), mismo envío que el actual. */
  before?: number;
  tag?: string;
  /** De más barata a más cara; el cliente usa la primera que envía al país. */
  offers: DealOffer[];
}

const KIND: Record<DealSection, GoKind> = { camiseta: "j", botas: "b", tickets: "t", ropa: "a", guantes: "g", pelotas: "p", entrenamiento: "e" };
type Origin = "home" | "listado" | "alt";

function rowDeal(r: DealRow, locale: HubLocale, origin: Origin, n: number, tag: string, isDrop: boolean): DirectDeal {
  const shipping = r.item.offers.find((o) => o.url === r.offerUrl)?.shipping ?? 0;
  return {
    key: `${r.section}/${r.item.id}`,
    path: `/${r.section}/${r.item.id}`,
    name: dealName(r, locale),
    img: dealImage(r),
    before: isDrop ? r.before + shipping : undefined,
    tag,
    offers: [{ store: r.store, url: r.offerUrl, price: r.price, shipping, currency: r.currency, href: goHref({ kind: KIND[r.section], productId: r.item.id, url: r.offerUrl, locale, origin, position: n }) }],
  };
}

/**
 * "Mejores ofertas de hoy": bajadas verificadas y mínimos de 21+ días
 * (dealsData.ts, nada del "precio tachado" de las tiendas) de botas y de
 * camisetas actuales (temporada 2025 o posterior), solo en tiendas
 * comparables (sin marketplaces ni réplicas: el botón dice "mejor oferta").
 * Botas y camisetas se intercalan: las botas convierten más (44 % frente al
 * 7 % de las fichas de camiseta en GA4) pero la home vive de camisetas.
 */
export function todaysDeals(
  locale: HubLocale,
  sections: ("botas" | "camiseta")[],
  origin: Origin,
  /** Solo camisetas: clubes o selecciones (listados /clubes, /selecciones). */
  category?: "club" | "national",
  max = 24,
): DirectDeal[] {
  const t = CONV[locale];
  const ok = (r: DealRow) =>
    (sections as DealSection[]).includes(r.section) &&
    (!category || (r.section === "camiseta" && teamCategory[(r.item as unknown as Product).teamKey] === category)) &&
    (r.section !== "camiseta" || seasonSortValue((r.item as unknown as Product).season) >= 2025) &&
    isComparableStore(r.store) &&
    r.pct >= 5 &&
    r.eur <= 1000;
  const seen = new Set<string>();
  const per = new Map<DealSection, { r: DealRow; tag: string; drop: boolean }[]>();
  const add = (rows: DealRow[], drop: boolean) => {
    for (const r of rows) {
      const k = `${r.section}/${r.item.id}`;
      if (!ok(r) || seen.has(k)) continue;
      seen.add(k);
      const tag = drop ? `-${Math.round(r.pct)} %` : t.lowestInDays.replace("{days}", String(r.days));
      per.set(r.section, [...(per.get(r.section) ?? []), { r, tag, drop }]);
    }
  };
  add(verifiedDropRows(), true);
  add(historicLowRows(), false);
  const lists = sections.map((s) => per.get(s) ?? []);
  const out: { r: DealRow; tag: string; drop: boolean }[] = [];
  for (let i = 0; out.length < max && lists.some((l) => i < l.length); i++)
    for (const l of lists) if (l[i] && out.length < max) out.push(l[i]);
  return out.map((x, i) => rowDeal(x.r, locale, origin, i + 1, x.tag, x.drop));
}

type AnyOffer = { store: string; url: string; price: number; shipping?: number; currency: string; inStock?: boolean };

function offersOf(kind: GoKind, id: string, offers: readonly AnyOffer[], eur: (o: AnyOffer) => number, locale: HubLocale): DealOffer[] {
  return offers
    .filter((o) => o.inStock !== false && o.price > 0)
    .sort((a, b) => eur(a) - eur(b))
    .slice(0, 4)
    .map((o) => ({
      store: o.store,
      url: o.url,
      price: o.price,
      shipping: o.shipping ?? 0,
      currency: o.currency as OfferCurrencyCode,
      href: goHref({ kind, productId: id, url: o.url, locale, origin: "alt" }),
    }));
}

const jerseyEur = (o: AnyOffer) => offerTotalInEUR({ price: o.price, shipping: o.shipping ?? 0, currency: o.currency as OfferCurrencyCode });
const gearEur = (o: AnyOffer) => bootOfferTotalInEUR({ price: o.price, shipping: o.shipping ?? 0, currency: o.currency as BootCurrencyCode });

/** Camisetas del mismo equipo con stock (la ficha las muestra si la suya está agotada). */
export function jerseyAlternatives(list: readonly Product[], locale: HubLocale, max = 4): DirectDeal[] {
  return list
    .map((p) => ({ p, offers: offersOf("j", p.id, p.offers, jerseyEur, locale) }))
    .filter((x) => x.offers.length > 0)
    .slice(0, max)
    .map(({ p, offers }) => ({ key: `camiseta/${p.id}`, path: `/camiseta/${p.id}`, name: jerseyName(p, locale), img: productImage(p) ?? "", offers }));
}

const GEAR_KIND = { botas: "b", guantes: "g", pelotas: "p", ropa: "a", entrenamiento: "e" } as const;
const minEur = (item: GearLike) => Math.min(...item.offers.map(gearEur));

/**
 * Parecidas (botas: misma marca y terreno; resto: misma marca y tipo) que
 * salen al menos un 15 % más baratas que esta: la respuesta honesta a una
 * ficha cara. Las más cercanas en precio primero (más parecidas en gama).
 */
export function cheaperAlternatives(section: keyof typeof GEAR_KIND, item: GearLike, all: readonly GearLike[], locale: HubLocale, max = 3): DirectDeal[] {
  const offers = item.offers;
  if (!offers.length) return [];
  const limit = minEur(item) * 0.85;
  const similar = (x: GearLike) =>
    x.id !== item.id &&
    x.offers.length > 0 &&
    x.brand.toLowerCase() === item.brand.toLowerCase() &&
    (section === "botas" ? x.groundType === item.groundType : x.type === item.type);
  return all
    .filter(similar)
    .map((x) => ({ x, eur: minEur(x) }))
    .filter((c) => c.eur <= limit)
    .sort((a, b) => b.eur - a.eur)
    .slice(0, max)
    .map(({ x }) => ({
      key: `${section}/${x.id}`,
      path: `/${section}/${x.id}`,
      name: gearName(section, x, locale),
      img: x.offers.find((o) => o.imageUrl)?.imageUrl ?? "",
      offers: offersOf(GEAR_KIND[section], x.id, x.offers, gearEur, locale),
    }));
}
