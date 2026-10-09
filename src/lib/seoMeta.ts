import { products, teamNames, type Product } from "@/data/products";
import { bootProducts } from "@/data/boots";
import { gloveProducts } from "@/data/gloves";
import { ballProducts } from "@/data/balls";
import { apparelProducts } from "@/data/apparel";
import { trainingProducts } from "@/data/training";
import type { TicketProduct } from "@/data/tickets";
import { findCountry, type CountryCode } from "@/data/countries";
import type { HubLocale } from "@/data/teamMeta";
import { brandNames, isVintageRetro, kitOf, offerShipsTo, typeNames } from "@/lib/productMeta";
import { formatOfferMoney, type OfferCurrencyCode } from "@/lib/offerMoney";
import { countDistinctRetailers } from "@/lib/retailerFamily";
import { localizeGearModel, localizeGearColour } from "@/lib/gearText";
import { productCode, productMpn } from "@/lib/offerGtin";
import { bootColorKey, COLOR_LABEL_KEY } from "@/lib/colorClassify";
import { upsizeBootDetailPhoto } from "@/lib/images";
import { translations } from "@/lib/i18n/translations";
import { shortDate } from "@/lib/newStrings";
import type { GearSection } from "@/lib/gearHubs";

// <title>, meta description y piezas del JSON-LD de las fichas (2026-10-09,
// revisión SEO H02/H03/H06/H08/H12). SOLO servidor: importa los catálogos.
//
// Reglas: el título dice lo que la gente busca ("Camiseta {equipo}
// {equipación} {temporada}", "Botas {marca} {modelo} {tapón}", "Entradas
// {partido} {fecha}"); es único en todo el catálogo por idioma (los
// duplicados se desambiguan con datos reales: color, código del fabricante,
// formato de temporada…); "| Football Cult" solo si cabe en 60 caracteres; y
// la descripción lleva el precio mínimo y el nº de tiendas reales. El precio
// se da solo en EUR y solo de ofertas que envían al mercado del idioma: un
// "desde USD 25" en /es es una réplica o una tienda que no envía a España.
// Comprobación ejecutable: scripts/check_seo_titles.mts.

export const SITE_URL = "https://football-cult.com";
const BRAND = " | Football Cult";
export const TITLE_MAX = 60;

/** Mercado de cada idioma para el "desde X €". */
export const MARKET: Record<HubLocale, CountryCode> = { es: "ES", en: "IE", pt: "PT", fr: "FR", it: "IT" };

/** og:locale en formato idioma_PAÍS. */
export const OG_LOCALE: Record<HubLocale, string> = { es: "es_ES", en: "en_IE", pt: "pt_PT", fr: "fr_FR", it: "it_IT" };

export const withBrand = (t: string) => (t.length + BRAND.length <= TITLE_MAX ? t + BRAND : t);

interface MoneyOffer {
  store: string;
  price: number;
  shipping?: number;
  currency: string;
  inStock?: boolean;
}

const live = <T extends MoneyOffer>(offers: readonly T[]) => offers.filter((o) => o.price > 0 && o.inStock !== false);

/** "29,99 €": total más barato (precio + envío) entre las ofertas en EUR que
 *  envían al mercado del idioma. undefined si no hay ninguna. */
export function fromPrice(offers: readonly MoneyOffer[], locale: HubLocale): string | undefined {
  const country = MARKET[locale];
  let min = Infinity;
  for (const o of live(offers)) {
    if (o.currency !== "EUR" || !offerShipsTo(o.store, country)) continue;
    min = Math.min(min, o.price + (o.shipping ?? 0));
  }
  return min < Infinity ? eurText(min, locale) : undefined;
}

const NUM_LOCALE: Record<HubLocale, string> = { es: "es-ES", en: "en-IE", pt: "pt-PT", fr: "fr-FR", it: "it-IT" };
/** "29,99 €" / "€29.99" según el idioma (sin decimales desde 100). */
export const eurText = (amount: number, locale: HubLocale) =>
  new Intl.NumberFormat(NUM_LOCALE[locale], { style: "currency", currency: "EUR", maximumFractionDigits: amount >= 100 ? 0 : 2 }).format(amount);

/** El "desde" de un hub de camisetas (equipo, liga, país, temporada), "" si
 *  ninguna oferta en EUR envía al mercado del idioma. */
export const hubFrom = (items: readonly { product: Product }[], locale: HubLocale) =>
  fromPrice(items.flatMap((i) => i.product.offers), locale) ?? "";

/** Lo mismo para un hub de equipamiento (marca, terreno, tipo). */
export function gearHubFrom(section: GearSection, ids: readonly string[], locale: HubLocale): string {
  const want = new Set(ids);
  return fromPrice(SECTION_ITEMS[section].filter((i) => want.has(i.id)).flatMap((i) => i.offers), locale) ?? "";
}

/** Tiendas distintas con precio vigente (FootStoreES + FootStoreFR = una). */
export const liveStores = (offers: readonly MoneyOffer[]) => countDistinctRetailers(live(offers));

const DESC: Record<
  HubLocale,
  (o: { subject: string; n: number; price?: string; country: string }) => string
> = {
  es: ({ subject, n, price, country }) =>
    `${subject}: ${n > 1 ? `compara ${n} tiendas` : "precio en 1 tienda"}${price ? `, desde ${price} con envío a ${country}` : ""}. Precios revisados a diario y enlace directo a la tienda.`,
  en: ({ subject, n, price, country }) =>
    `${subject}: ${n > 1 ? `compare ${n} stores` : "price at 1 store"}${price ? `, from ${price} delivered to ${country}` : ""}. Prices checked daily, direct link to the store.`,
  pt: ({ subject, n, price, country }) =>
    `${subject}: ${n > 1 ? `compare ${n} lojas` : "preço em 1 loja"}${price ? `, a partir de ${price} com envio para ${country}` : ""}. Preços revistos todos os dias e link direto para a loja.`,
  fr: ({ subject, n, price, country }) =>
    `${subject} : ${n > 1 ? `comparez ${n} boutiques` : "prix dans 1 boutique"}${price ? `, dès ${price} livré en ${country}` : ""}. Prix vérifiés chaque jour, lien direct vers la boutique.`,
  it: ({ subject, n, price, country }) =>
    `${subject}: ${n > 1 ? `confronta ${n} negozi` : "prezzo in 1 negozio"}${price ? `, da ${price} con spedizione in ${country}` : ""}. Prezzi controllati ogni giorno, link diretto al negozio.`,
};

const CODE_LABEL: Record<HubLocale, string> = { es: "Código del fabricante:", en: "Manufacturer code:", pt: "Código do fabricante:", fr: "Référence fabricant :", it: "Codice produttore:" };

export function describe(subject: string, offers: readonly MoneyOffer[], locale: HubLocale, code?: string): string {
  const d = DESC[locale]({
    subject,
    n: Math.max(1, liveStores(offers)),
    price: fromPrice(offers, locale),
    country: findCountry(MARKET[locale]).name[locale],
  });
  return code ? `${d} ${CODE_LABEL[locale]} ${code}.` : d;
}

// ---------------------------------------------------------------- unicidad

/** Nombre base de cada ficha y, para los que chocan, se les agrega el
 *  primer dato real que los distinga (en orden). Lo que siga repetido tras
 *  todos los pasos queda repetido: lo cuenta check_seo_titles.mts. */
function uniqueTitles<T extends { id: string }>(
  items: readonly T[],
  base: (i: T) => string,
  extras: ((i: T) => string | undefined)[],
): Map<string, string> {
  const names = new Map(items.map((i) => [i.id, base(i)]));
  for (const extra of extras) {
    const groups = new Map<string, T[]>();
    for (const i of items) {
      const k = names.get(i.id)!.toLowerCase();
      groups.set(k, [...(groups.get(k) ?? []), i]);
    }
    for (const g of groups.values()) {
      if (g.length < 2) continue;
      for (const i of g) {
        const e = extra(i)?.trim();
        const cur = names.get(i.id)!;
        if (e && !cur.toLowerCase().includes(e.toLowerCase())) names.set(i.id, `${cur} ${e}`);
      }
    }
  }
  // Lo que sigue chocando: las palabras del id (el texto original de la
  // tienda) que el resto del grupo no tiene ("femme", "chaussettes").
  const groups = new Map<string, T[]>();
  for (const i of items) {
    const k = names.get(i.id)!.toLowerCase();
    groups.set(k, [...(groups.get(k) ?? []), i]);
  }
  for (const g of groups.values()) {
    if (g.length < 2) continue;
    const words = g.map((i) => new Set(i.id.split("-")));
    g.forEach((i, n) => {
      const own = [...words[n]].filter((w) => words.every((ws, m) => m === n || !ws.has(w)));
      // "-2" de un segundo colorway: el número ya aparece en otra parte del id.
      const last = i.id.split("-").pop()!;
      if (!own.length && g.every((x) => x === i || x.id.split("-").pop() !== last)) own.push(last);
      if (own.length) names.set(i.id, `${names.get(i.id)} (${own.slice(0, 2).join(" ")})`);
    });
  }
  return names;
}

const cache = new Map<string, Map<string, string>>();
function memo(key: string, build: () => Map<string, string>) {
  let m = cache.get(key);
  if (!m) cache.set(key, (m = build()));
  return m;
}

// ---------------------------------------------------------------- camisetas

type Kit = NonNullable<ReturnType<typeof kitOf>>;

// {t} = equipo. Las de portero/entrenamiento/prepartido llevan la variante
// delante ("Camiseta de portero Real Madrid") porque así se busca.
const KIT_TITLE: Record<HubLocale, Record<Kit | "none", string>> = {
  es: {
    home: "Camiseta {t} primera equipación",
    away: "Camiseta {t} segunda equipación",
    third: "Camiseta {t} tercera equipación",
    goalkeeper: "Camiseta de portero {t}",
    training: "Camiseta de entrenamiento {t}",
    prematch: "Camiseta prepartido {t}",
    none: "Camiseta {t}",
  },
  en: {
    home: "{t} home shirt",
    away: "{t} away shirt",
    third: "{t} third shirt",
    goalkeeper: "{t} goalkeeper shirt",
    training: "{t} training shirt",
    prematch: "{t} pre-match shirt",
    none: "{t} shirt",
  },
  pt: {
    home: "Camisa {t} titular",
    away: "Camisa {t} reserva",
    third: "Camisa {t} terceira",
    goalkeeper: "Camisa de goleiro {t}",
    training: "Camisa de treino {t}",
    prematch: "Camisa pré-jogo {t}",
    none: "Camisa {t}",
  },
  fr: {
    home: "Maillot {t} domicile",
    away: "Maillot {t} extérieur",
    third: "Maillot {t} third",
    goalkeeper: "Maillot gardien {t}",
    training: "Maillot d'entraînement {t}",
    prematch: "Maillot avant-match {t}",
    none: "Maillot {t}",
  },
  it: {
    home: "Maglia {t} home",
    away: "Maglia {t} away",
    third: "Maglia {t} third",
    goalkeeper: "Maglia portiere {t}",
    training: "Maglia allenamento {t}",
    prematch: "Maglia pre-partita {t}",
    none: "Maglia {t}",
  },
};
const RETRO_WORD: Record<HubLocale, string> = { es: "retro", en: "retro", pt: "retrô", fr: "rétro", it: "retrò" };
const AGE: Record<HubLocale, { women: string; kids: string }> = {
  es: { women: "mujer", kids: "niño" },
  en: { women: "women's", kids: "kids" },
  pt: { women: "feminina", kids: "infantil" },
  fr: { women: "femme", kids: "enfant" },
  it: { women: "donna", kids: "bambino" },
};

function jerseyBase(p: Product, locale: HubLocale): string {
  const team = teamNames[p.teamKey]?.[locale] ?? p.teamKey;
  let t = KIT_TITLE[locale][kitOf(p) ?? "none"];
  // "Retro" solo para las vintage (temporada <= 2006, isVintageRetro).
  if (p.typeKey === "retro" && isVintageRetro(p)) {
    t = locale === "en" ? t.replace("{t}", `{t} ${RETRO_WORD.en}`) : t.replace(/^(\S+)/, `$1 ${RETRO_WORD[locale]}`);
  }
  t = t.replace("{t}", team);
  // en: "Real Madrid 2026/27 home shirt"; el resto: temporada al final.
  t = locale === "en" ? t.replace(team, `${team} ${p.season}`) : `${t} ${p.season}`;
  const age = p.ageGroup === "women" || p.ageGroup === "kids" ? AGE[locale][p.ageGroup] : "";
  return age ? `${t} ${age}` : t;
}

/** Marca real de la camiseta para mostrar ("adidas", "New Balance"). La
 *  "other" del feed no es una marca: se busca en los títulos reales de las
 *  ofertas y, si no aparece ninguna conocida, no se declara. */
const KNOWN_BRANDS = [
  ...Object.entries(brandNames).filter(([k]) => k !== "other").map(([, v]) => v),
  "Le Coq Sportif", "Castore", "Diadora", "Admiral", "Charly", "Penalty", "Topper", "Marathon", "Capelli",
  "Athleta", "Givova", "Zeus", "Spyder", "Retro Kits", "Copa", "Masita", "Patrick", "Hungaria", "Meyba",
];
const brandRe = new RegExp(`\\b(${KNOWN_BRANDS.map((b) => b.replace(/ /g, "\\s?")).join("|")})\\b`, "i");
export function jerseyBrand(p: Product): string | undefined {
  if (p.brand && p.brand !== "other") return p.brand === "adidas" ? "adidas" : brandNames[p.brand];
  const votes = new Map<string, number>();
  for (const o of p.offers) {
    const m = o.title?.match(brandRe);
    if (!m) continue;
    const name = KNOWN_BRANDS.find((b) => b.replace(/ /g, "").toLowerCase() === m[1].replace(/\s/g, "").toLowerCase())!;
    votes.set(name, (votes.get(name) ?? 0) + 1);
  }
  const best = [...votes.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  return best === "Adidas" ? "adidas" : best;
}

function jerseyTitles(locale: HubLocale) {
  return memo(`camisetas:${locale}`, () =>
    uniqueTitles(products, (p) => jerseyBase(p, locale), [
      // Retro de segunda mano (2007+) contra la ficha actual de la misma
      // temporada, o dos colorways del mismo equipo: el resto del id
      // ("-heritage", "-halfzip") es el dato real que las separa.
      (p) => jerseyBrand(p),
      (p) => {
        const kit = kitOf(p);
        const tail = p.id
          .replace(/^[^-]+-/, "")
          .split("-")
          .filter((w) => w !== kit && !/^(retro|\d{4,6}|women|kids|mens)$/.test(w))
          .map((w) => (w in typeNames ? typeNames[w as keyof typeof typeNames][locale].toLowerCase() : w));
        return tail.length ? tail.join(" ") : undefined;
      },
      (p) => productCode(p.offers),
    ]),
  );
}

/** Nombre canónico de la ficha (sin la marca del sitio): H1 secundario,
 *  JSON-LD `name`, migas. */
export const jerseyName = (p: Product, locale: HubLocale) => jerseyTitles(locale).get(p.id) ?? jerseyBase(p, locale);
export const jerseyTitle = (p: Product, locale: HubLocale) => withCode(jerseyName(p, locale), productCode(p.offers));
export const jerseyDescription = (p: Product, locale: HubLocale) => describe(jerseyName(p, locale), p.offers, locale, productCode(p.offers));

/** El código del fabricante es una consulta real ("893873 euros", posición
 *  6,8 en Search Console): va en el <title> si cabe en TITLE_MAX; si no, el
 *  nombre manda y el código queda en la descripción y en la ficha. */
function withCode(name: string, code: string | undefined): string {
  if (!code || name.toLowerCase().includes(code.toLowerCase())) return withBrand(name);
  const t = `${name} ${code}`;
  return t.length <= TITLE_MAX ? withBrand(t) : withBrand(name);
}

// ---------------------------------------------------------------- equipamiento

export interface GearLike {
  id: string;
  brand: string;
  model: string;
  colour?: string;
  groundType?: string;
  ageGroup?: string;
  type?: string;
  offers: readonly (MoneyOffer & { url: string; imageUrl?: string })[];
}

const SECTION_ITEMS: Record<GearSection, readonly GearLike[]> = {
  botas: bootProducts,
  guantes: gloveProducts,
  pelotas: ballProducts,
  ropa: apparelProducts,
  entrenamiento: trainingProducts,
};

/** Marca con su grafía real: "adidas" en minúscula, "KIPSTA" -> "Kipsta". */
export function brandLabel(raw: string): string {
  const b = raw.trim();
  if (b.toLowerCase() === "adidas") return "adidas";
  if (/^[A-Z]{4,}$/.test(b)) return b[0] + b.slice(1).toLowerCase();
  return b.charAt(0).toUpperCase() + b.slice(1);
}

const BOOT_NOUN = /^(?:(?:las?\s+)?(?:botas?|chaussures?|crampons?|scarpe|scarpini|chuteiras?|football\s+boots?|boots?)(?:\s+de|\s+da)?(?:\s+(?:fútbol|futbol|foot(?:ball)?|calcio|futebol))?)\s+/i;
const GROUND_IN_TEXT = /\b(FG|AG|SG|MG|TF|IC|IN|HG|FG\/AG|FG\/MG|MG\/AG|TURF|IND)\b/i;
const BOOT_TITLE: Record<HubLocale, (b: string, m: string) => string> = {
  es: (b, m) => `Botas ${b} ${m}`,
  en: (b, m) => `${b} ${m} football boots`,
  pt: (b, m) => `Chuteiras ${b} ${m}`,
  fr: (b, m) => `Crampons ${b} ${m}`,
  it: (b, m) => `Scarpe da calcio ${b} ${m}`,
};

/** "COPA PURE IV ELITE" -> "Copa Pure IV Elite" (las siglas cortas y los
 *  números romanos quedan como están). */
const tame = (s: string) =>
  s.replace(/\b[A-ZÁÉÍÓÚÑ]{4,}\b/g, (w) => (/^[IVXL]+$/.test(w) ? w : w[0] + w.slice(1).toLowerCase()));

function bootCore(item: GearLike): string {
  const brand = item.brand.trim();
  let m = item.model.replace(/\s+-\s+[^-]+$/, ""); // " - Black/Red": el color va aparte
  // DeporteOutlet mete el sustantivo en medio: "adidas Predator Club FG/MG
  // Hombre Botas de fútbol ID1324".
  m = m.replace(BOOT_NOUN, "").replace(/\s+(?:hombre|botas?\s+de\s+f[uú]tbol)\b/gi, "");
  if (brand) m = m.replace(new RegExp(`\\b${brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"), " ");
  m = tame(m.replace(/\s+/g, " ").trim());
  if (item.groundType && !GROUND_IN_TEXT.test(m)) m = `${m} ${item.groundType}`;
  return m.trim();
}

// Fútbol sala (groundType IC): se buscan como "zapatillas", no "botas".
const FUTSAL_TITLE: Record<HubLocale, (b: string, m: string) => string> = {
  es: (b, m) => `Zapatillas de fútbol sala ${b} ${m}`,
  en: (b, m) => `${b} ${m} futsal shoes`,
  pt: (b, m) => `Chuteiras de futsal ${b} ${m}`,
  fr: (b, m) => `Chaussures de futsal ${b} ${m}`,
  it: (b, m) => `Scarpe da calcetto ${b} ${m}`,
};
const KIDS_IN_TEXT = /\b(niñ[oa]s?|kids?|junior|jr|enfants?|bambin[oi]|infantil|criança)\b/i;

function gearBase(section: GearSection, item: GearLike, locale: HubLocale): string {
  const brand = brandLabel(item.brand);
  if (section === "botas") {
    const raw = bootCore(item) || item.model;
    const core = item.groundType === "IC" ? raw.replace(/\s+IC$/, "") : raw;
    const t = (item.groundType === "IC" ? FUTSAL_TITLE : BOOT_TITLE)[locale](brand, core);
    // Botas de niño (ageGroup "kids"): que el título lo diga, o chocan con
    // la de adulto del mismo modelo.
    return item.ageGroup === "kids" && !KIDS_IN_TEXT.test(t) ? `${t} ${AGE[locale].kids}` : t;
  }
  // Equipamiento: el glosario ya traduce el sustantivo y el color
  // ("Chaqueta de chándal Acerbis 4 étoiles - Azul"). Se le mete la marca si
  // el texto del feed no la trae.
  let t = localizeGearModel(item.model, item.brand, locale);
  const cut = t.lastIndexOf(" - ");
  const colour = cut > 0 ? ` ${t.slice(cut + 3).toLowerCase()}` : "";
  if (cut > 0) t = t.slice(0, cut);
  if (brand && !t.toLowerCase().includes(brand.toLowerCase())) t = `${t} ${brand}`;
  return t + colour;
}

// Nike "fq8331-800", Puma "109139-01", adidas "ie1802", y el genérico.
const SKU_TAIL = /-([a-z]{2}\d{4}-\d{3}|\d{6}-\d{2}|(?=[a-z0-9]*\d)(?=[a-z0-9]*[a-z])[a-z0-9]{5,12}|\d{6,})$/;
/** Código de fabricante de una ficha de equipamiento que se puede MOSTRAR
 *  (texto, <title>, JSON-LD `mpn`): el MPN del feed o, si no, el de gearCode
 *  solo con forma de código real de adidas ("IE1802"), Nike ("FQ8331-800",
 *  "893873-100") o Puma ("107771-01"). gearCode a secas también devuelve
 *  restos del nombre de la foto ("2025-12", "033200-FTW") que sirven para
 *  desempatar títulos pero no como dato. */
export function gearMpn(item: GearLike): string | undefined {
  const mpn = productMpn([...item.offers]);
  if (mpn) return mpn.toUpperCase();
  const c = gearCode(item);
  return c && /^(?:[A-Z]{2}\d{4}(?:-\d{3})?|\d{6}-\d{2,3})$/.test(c) ? c : undefined;
}

function gearCode(item: GearLike): string | undefined {
  const mpn = productMpn([...item.offers]);
  if (mpn) return mpn.toUpperCase();
  const m = item.id.match(SKU_TAIL);
  if (m) return m[1].toUpperCase();
  // Ropa/equipamiento: la referencia del fabricante va en el nombre de la
  // foto ("acerbis_0012185.041_...", "3814_89_glasgow_2_0"), la misma clave
  // estable de gear_ids.json.
  for (const o of item.offers) {
    const raw = o.imageUrl ?? "";
    const inner = raw.includes("url=") ? (new URLSearchParams(raw.slice(raw.indexOf("?") + 1)).get("url") ?? raw) : raw;
    const file = inner.split("?")[0].split(/[/:]/).pop()?.replace(/\.(jpe?g|png|webp)$/i, "") ?? "";
    const rest = file.replace(/^[a-z]+[_-]/i, "");
    const m = rest.match(/^([a-z]{0,3}\d{3,}[a-z0-9]*)[_.-]([0-9a-z]{2,3})(?=[_.-]|$)/i) ?? rest.match(/()([a-z]{1,3}\d{4,}[a-z0-9]*)/i);
    if (m) return (m[1] ? `${m[1]}-${m[2]}` : m[2]).toUpperCase();
  }
  return undefined;
}

function colourOf(item: GearLike, locale: HubLocale): string | undefined {
  if (item.colour) return localizeGearColour(item.colour, locale).toLowerCase();
  const k = bootColorKey(item.id);
  return k ? String(translations[locale].search[COLOR_LABEL_KEY[k]]).toLowerCase() : undefined;
}

function gearTitles(section: GearSection, locale: HubLocale) {
  return memo(`${section}:${locale}`, () =>
    uniqueTitles(SECTION_ITEMS[section], (i) => gearBase(section, i, locale), [
      (i) => colourOf(i, locale),
      (i) => (section === "botas" ? undefined : i.groundType),
      (i) => gearCode(i),
      // Misma prenda en dos fichas sin fundir (espejo ES/FR, dos tiendas):
      // la tienda es el dato real que las separa.
      (i) => {
        const o = [...live(i.offers)].sort((a, b) => a.price + (a.shipping ?? 0) - b.price - (b.shipping ?? 0))[0] ?? i.offers[0];
        return o ? `· ${o.store}` : undefined;
      },
    ]),
  );
}

export const gearName = (section: GearSection, item: GearLike, locale: HubLocale) =>
  gearTitles(section, locale).get(item.id) ?? gearBase(section, item, locale);
export const gearTitle = (section: GearSection, item: GearLike, locale: HubLocale) => withCode(gearName(section, item, locale), gearMpn(item));
export const gearDescription = (section: GearSection, item: GearLike, locale: HubLocale) =>
  describe(gearName(section, item, locale), item.offers, locale, gearMpn(item));

// ---------------------------------------------------------------- entradas

const TICKET_TITLE: Record<HubLocale, (e: string, d: string) => string> = {
  es: (e, d) => `Entradas ${e}, ${d}`,
  en: (e, d) => `${e} tickets, ${d}`,
  pt: (e, d) => `Ingressos ${e}, ${d}`,
  fr: (e, d) => `Billets ${e}, ${d}`,
  it: (e, d) => `Biglietti ${e}, ${d}`,
};
// "9 oct 2026" en todos los idiomas, con los meses de newStrings.ts (el ICU
// del servidor no es fiable; el formato largo de pt dejaba 637 títulos > 60).
const ticketDate = (t: TicketProduct, locale: HubLocale) => `${shortDate(t.date, locale)} ${t.date.slice(0, 4)}`;

export const ticketName = (t: TicketProduct, locale: HubLocale) => TICKET_TITLE[locale](t.event, ticketDate(t, locale));
export const ticketTitle = (t: TicketProduct, locale: HubLocale) => withBrand(ticketName(t, locale));

const TICKET_DESC: Record<HubLocale, (o: { comp: string; place: string; when: string; price?: string; n: number }) => string> = {
  es: ({ comp, place, when, price, n }) => `${comp} · ${place}, ${when}.${price ? ` Desde ${price}` : ""} ${n > 1 ? `en ${n} vendedores` : "en 1 vendedor"}, enlace directo a la venta.`,
  en: ({ comp, place, when, price, n }) => `${comp} · ${place}, ${when}.${price ? ` From ${price}` : ""} ${n > 1 ? `across ${n} sellers` : "at 1 seller"}, direct link to buy.`,
  pt: ({ comp, place, when, price, n }) => `${comp} · ${place}, ${when}.${price ? ` A partir de ${price}` : ""} ${n > 1 ? `em ${n} vendedores` : "em 1 vendedor"}, link direto para a compra.`,
  fr: ({ comp, place, when, price, n }) => `${comp} · ${place}, ${when}.${price ? ` Dès ${price}` : ""} ${n > 1 ? `chez ${n} vendeurs` : "chez 1 vendeur"}, lien direct vers l'achat.`,
  it: ({ comp, place, when, price, n }) => `${comp} · ${place}, ${when}.${price ? ` Da ${price}` : ""} ${n > 1 ? `su ${n} rivenditori` : "su 1 rivenditore"}, link diretto all'acquisto.`,
};

export function ticketDescription(t: TicketProduct, locale: HubLocale, sellers: number, cheapest?: { price: number; currency: OfferCurrencyCode }): string {
  return TICKET_DESC[locale]({
    comp: t.competition,
    place: t.city ? `${t.venue} (${t.city})` : t.venue,
    when: `${ticketDate(t, locale)} ${t.time.slice(0, 5)}`,
    price: cheapest ? formatOfferMoney(cheapest.price, cheapest.currency) : undefined,
    n: Math.max(1, sellers),
  });
}

// ---------------------------------------------------------------- JSON-LD

/** Foto grande para JSON-LD/OG: las del proxy de Awin vienen fijadas a
 *  200x200 en la propia URL del feed y el mismo proxy da la foto real a
 *  1200x1200 (ver upsizeBootDetailPhoto). */
export function ldImage(url: string | undefined): { url: string; width?: number; height?: number } | undefined {
  if (!url) return undefined;
  const big = upsizeBootDetailPhoto(url);
  return big !== url ? { url: big, width: 1200, height: 1200 } : { url };
}

export function ogImages(url: string | undefined) {
  const img = ldImage(url);
  return img ? [img] : undefined;
}

/** AggregateOffer de UNA moneda. El HTML que ve Google se renderiza con el
 *  país por defecto (ES, ver CountryContext): las ofertas que cuentan son
 *  las que envían ahí, y la moneda es la de la más barata de ellas -- la
 *  que la ficha muestra como mejor precio. Las ofertas en otra moneda no se
 *  declaran (mezclarlas era el 73 % de las fichas con lowPrice incoherente). */
export function aggregateOfferLd<T extends MoneyOffer & { url: string }>(
  offers: readonly T[],
  pageUrl: string,
  toEur: (o: T) => number,
  extra?: (o: T) => Record<string, unknown>,
) {
  const priced = offers.filter((o) => o.price > 0);
  const ships = priced.filter((o) => offerShipsTo(o.store, "ES"));
  const pool = ships.length ? ships : priced;
  if (!pool.length) return undefined;
  const avail = pool.filter((o) => o.inStock !== false);
  const best = [...(avail.length ? avail : pool)].sort((a, b) => toEur(a) - toEur(b))[0];
  const same = pool.filter((o) => o.currency === best.currency);
  // El rango sale de lo que se puede comprar; las agotadas siguen listadas
  // como OutOfStock (mismo criterio que main, 2026-10-09).
  const buyable = same.filter((o) => o.inStock !== false);
  const prices = (buyable.length ? buyable : same).map((o) => o.price);
  return {
    "@type": "AggregateOffer",
    priceCurrency: best.currency,
    lowPrice: Math.min(...prices),
    highPrice: Math.max(...prices),
    offerCount: same.length,
    offers: same.map((o) => ({
      "@type": "Offer",
      url: pageUrl,
      price: o.price,
      priceCurrency: o.currency,
      availability: o.inStock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      seller: { "@type": "Organization", name: o.store },
      ...(extra ? extra(o) : {}),
    })),
  };
}
