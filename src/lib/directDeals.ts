// Ofertas con botón directo a tienda (/go/), armadas en el SERVIDOR: el
// cliente (components/DirectDeals.tsx) solo recibe unas pocas tarjetas y
// elige, por país, la primera oferta que envía allí. Nunca importar esto
// desde un componente "use client": arrastra los siete catálogos.
//
// Por qué existe (análisis de tráfico 2026-10-09): la home y los listados
// reciben el 75 % de las vistas y no daban NINGÚN clic a tienda; solo
// convertían las fichas. Con esto, home -> tienda es un toque.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { TEAM_LEAGUE, type HubLocale } from "@/data/teamMeta";
import type { Product } from "@/data/products";
import type { CountryCode } from "@/data/countries";
import { dealImage, dealName, historicLowRows, verifiedDropRows, type DealRow, type DealSection } from "@/lib/dealsData";
import { isComparableStore } from "@/lib/officialStores";
import { getAgeGroup, offerShipsTo, seasonSortValue, teamCategory, teamNames } from "@/lib/productMeta";
import { bootTierInfo } from "@/lib/bootTier";
import { CLICK_LOG_DIR } from "@/lib/clickLog";
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

// ---- Popularidad (2026-10-17) ----------------------------------------------
// Ordenar solo por % ponía arriba unas zapatillas de sala de niño y la
// camiseta del AC Savoia 1908 (bajadas reales, pero la home parecía un
// saldo). Ahora puntuación = bajada (% y € ahorrados) × popularidad, con
// señales objetivas: equipo grande / liga top / Mundial 2026, equipo del
// idioma, adulto, línea de bota top, temporada en curso y clics humanos.

/** Clubes y selecciones con más afición (los atajos del buscador y sus pares). */
const GIANTS = new Set([
  "realmadrid", "barcelona", "atleticomadrid", "manutd", "mancity", "liverpool", "arsenal", "chelsea", "tottenham",
  "bayern", "dortmund", "psg", "marseille", "juventus", "acmilan", "intermilan", "napoli", "roma", "benfica", "porto",
  "sportingcp", "ajax", "boca", "riverplate", "flamengo", "palmeiras", "corinthians", "intermiami",
  "argentina", "brasil", "espana", "francia", "inglaterra", "alemania", "portugal", "italia", "paisesbajos", "belgica",
  "croacia", "uruguay", "mexico", "estadosunidos", "colombia", "marruecos", "japon",
]);
/** Selecciones clasificadas al Mundial 2026 a nov-2025 (sin la repesca). */
const WC2026 = new Set([
  "canada", "mexico", "estadosunidos", "japon", "iran", "uzbekistan", "coreadelsur", "jordania", "australia", "qatar",
  "argentina", "brasil", "ecuador", "uruguay", "colombia", "paraguay", "nuevazelanda", "marruecos", "tunez", "egipto",
  "argelia", "ghana", "caboverde", "sudafrica", "senegal", "costamarfil", "inglaterra", "francia", "croacia", "portugal",
  "noruega", "alemania", "paisesbajos", "espana", "belgica", "austria", "suiza", "escocia", "panama", "haiti", "curacao",
]);
const TOP_LEAGUES = new Set(["laliga", "premier-league", "serie-a", "bundesliga", "ligue-1"]);
/** Lo de casa para cada idioma: liga y selección. */
const LOCAL: Record<HubLocale, string[]> = {
  es: ["laliga", "espana"],
  en: ["premier-league", "inglaterra"],
  fr: ["ligue-1", "francia"],
  it: ["serie-a", "italia"],
  pt: ["primeira-liga", "brasileirao", "portugal", "brasil"],
};
/** País principal de cada idioma: lo que no envía allí va al final (el cliente filtra por el país real). */
const HOME_COUNTRY: Record<HubLocale, CountryCode> = { es: "ES", en: "GB", fr: "FR", it: "IT", pt: "PT" };
const TOP_LINE = /\b(mercurial|superfly|vapor|phantom|tiempo|predator|copa|f50|x crazyfast|x speed|future|ultra|king|morelia|alpha|tekela)\b/i;
const KIDS = /niñ|\bkids?\b|junior|\bjr\b|infantil|enfant|bambin|criança/i;
const CURRENT_SEASON = 2026;

/** Equipo grande nombrado en el texto (chaqueta de la Juventus, camiseta OM...), solo para equipamiento. */
const GIANT_IN_TEXT: [string, RegExp][] = [...GIANTS].map((k) => {
  const names = new Set(Object.values(teamNames[k as keyof typeof teamNames] ?? {}));
  if (k === "marseille") names.add("OM");
  if (k === "psg") names.add("PSG");
  if (k === "manutd") names.add("Man Utd");
  const alt = [...names].map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  return [k, new RegExp(`(^|[^\\p{L}])(${alt})($|[^\\p{L}])`, "iu")];
});

let clicksCache: Map<string, number> | null = null;
/** Clics de personas (h) que tocaron el enlace en la página (j=1), últimos 30 días, por "k/id". */
function humanClicks(): Map<string, number> {
  if (clicksCache) return clicksCache;
  const m = new Map<string, number>();
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString();
  try {
    for (const f of readdirSync(CLICK_LOG_DIR))
      if (f.endsWith(".jsonl"))
        for (const line of readFileSync(path.join(CLICK_LOG_DIR, f), "utf8").split("\n")) {
          if (!line.includes('"j":true')) continue;
          const c = JSON.parse(line) as { t: string; k: string; p: string; h?: boolean };
          if (c.h && c.t >= since) m.set(`${c.k}/${c.p}`, (m.get(`${c.k}/${c.p}`) ?? 0) + 1);
        }
  } catch {
    // Sin carpeta de clics (otra máquina, CI): se ordena sin esa señal.
  }
  return (clicksCache = m);
}

type Bucket = "club" | "national" | "botas" | "gear";
type Cand = { r: DealRow; tag: string; drop: boolean; score: number; bucket: Bucket; div: string; local: boolean; kids: boolean };

/** Popularidad de 0 a ~2 y clave de diversidad (equipo, o marca+línea en botas). */
function popularity(r: DealRow, locale: HubLocale, name: string): Omit<Cand, "r" | "tag" | "drop" | "score"> & { pop: number } {
  const clicks = humanClicks().get(`${KIND[r.section]}/${r.item.id}`) ?? 0;
  let pop: number, bucket: Bucket, div: string;
  let local = false;
  let kids: boolean;
  if (r.section === "camiseta") {
    const p = r.item as unknown as Product;
    const league = TEAM_LEAGUE[p.teamKey];
    bucket = teamCategory[p.teamKey] === "national" ? "national" : "club";
    div = p.teamKey;
    pop = GIANTS.has(p.teamKey) ? 1 : TOP_LEAGUES.has(league) || WC2026.has(p.teamKey) ? 0.5 : 0.15;
    const age = getAgeGroup(p);
    local = LOCAL[locale].includes(league) || LOCAL[locale].includes(p.teamKey);
    if (local) pop *= 1.6;
    kids = age === "kids";
    if (age === "women") pop *= 0.8;
    if (seasonSortValue(p.season) >= CURRENT_SEASON) pop *= 1.15;
    if (!["home", "away", "third"].includes(p.typeKey)) pop *= 0.6;
  } else {
    const g = r.item as unknown as GearLike;
    const text = `${g.brand} ${g.model}`;
    const line = text.match(TOP_LINE)?.[1]?.toLowerCase();
    if (r.section === "botas") {
      bucket = "botas";
      div = `${g.brand}/${line ?? g.id}`.toLowerCase();
      pop = line ? 1 : 0.3;
      const tier = bootTierInfo(g.id)?.tier;
      if (tier === "1+" || tier === "1") pop *= 1.2;
      else if (tier === "4") pop *= 0.8;
    } else {
      bucket = "gear";
      const team = GIANT_IN_TEXT.find(([, re]) => re.test(text))?.[0];
      div = team ?? g.id;
      pop = team ? 0.8 : line ? 0.5 : 0.2;
    }
    kids = g.ageGroup === "kids" || KIDS.test(`${text} ${name}`);
  }
  if (kids) pop *= 0.35;
  if (clicks) pop *= 1 + 0.3 * Math.log2(1 + clicks);
  return { pop, bucket, div, local, kids };
}

/** Bajada: % × log(€ ahorrados). -44 % sobre 9 € pesa menos que -36 % sobre 66 €. */
function discount(r: DealRow): number {
  const savedEur = r.price > 0 ? ((r.before - r.price) * r.eur) / r.price : 0;
  return (r.pct / 100) * Math.log1p(Math.max(0, savedEur));
}

/** Club, bota, selección, club, equipamiento, bota, club, selección (la mezcla de la home). */
const PATTERN: Bucket[] = ["club", "botas", "national", "club", "gear", "botas", "club", "national"];

/**
 * Por puntuación, siguiendo PATTERN cuando hay de esa clase; nunca repite
 * equipo/línea mientras quede otra cosa, ni tienda ni niño en las 4
 * primeras. El primer club y la primera selección son de casa (es: LaLiga y
 * España...) si hay uno con al menos 1/4 de la puntuación de la mejor: con
 * solo multiplicar, un -12 % de Brasil nunca le ganaba en /pt a un -30 % del
 * Bayern; sin el tope, un -5 % del Vasco abría la página.
 */
function arrange(cands: Cand[]): Cand[] {
  const left = [...cands].sort((a, b) => b.score - a.score);
  const out: Cand[] = [];
  const divs = new Set<string>();
  const stores = new Set<string>();
  while (left.length) {
    const i = out.length;
    const fresh = (c: Cand) => !divs.has(c.div) && (i >= 4 || (!stores.has(c.r.store) && !c.kids));
    const want = PATTERN[i % PATTERN.length];
    let j = left.findIndex((c) => c.bucket === want && fresh(c));
    const k = i < 3 && j >= 0 ? left.findIndex((c) => c.bucket === want && c.local && fresh(c)) : -1;
    if (k >= 0 && left[k].score >= left[j].score / 4) j = k;
    if (j < 0) j = left.findIndex(fresh);
    if (j < 0) j = 0;
    const [c] = left.splice(j, 1);
    out.push(c);
    divs.add(c.div);
    stores.add(c.r.store);
  }
  return out;
}

export type DealsSection = Exclude<DealSection, "tickets" | "entrenamiento">;

/**
 * "Mejores ofertas de hoy": bajadas verificadas y mínimos de 21+ días
 * (dealsData.ts, nada del "precio tachado" de las tiendas) de las secciones
 * pedidas, con camisetas solo actuales (temporada 2025 o posterior), solo en
 * tiendas comparables (sin marketplaces ni réplicas: el botón dice "mejor
 * oferta"). Orden: bajada × popularidad, mezclando clases (PATTERN) y sin
 * repetir equipo ni tienda arriba; lo que no envía al país del idioma, al final.
 */
export function todaysDeals(
  locale: HubLocale,
  sections: DealsSection[],
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
  const home: Cand[] = [];
  const away: Cand[] = [];
  const add = (rows: DealRow[], drop: boolean) => {
    for (const r of rows) {
      const k = `${r.section}/${r.item.id}`;
      if (!ok(r) || seen.has(k)) continue;
      seen.add(k);
      const tag = drop ? `-${Math.round(r.pct)} %` : t.lowestInDays.replace("{days}", String(r.days));
      const { pop, ...rest } = popularity(r, locale, dealName(r, locale));
      (offerShipsTo(r.store, HOME_COUNTRY[locale]) ? home : away).push({ r, tag, drop, score: discount(r) * pop, ...rest });
    }
  };
  add(verifiedDropRows(), true);
  add(historicLowRows(), false);
  return [...arrange(home), ...arrange(away)]
    .slice(0, max)
    .map((x, i) => rowDeal(x.r, locale, origin, i + 1, x.tag, x.drop));
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
