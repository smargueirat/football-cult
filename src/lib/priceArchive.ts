import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

// Archivo DURABLE de precios: append-only, solo cambios, un .jsonl por mes
// en data/price-history/AAAA-MM.jsonl.
//
// Por qué existe: priceHistory.json es una ventana móvil de 14 días de
// camisetas (8-10 MB) pensada para la sparkline. No sirve para decir
// "mínimo histórico" ni para publicar un índice mensual: a los 14 días el
// dato se pierde. Este archivo no se recorta nunca.
//
// Formato, una línea por cambio:  ["2026-10-02","a1b2c3d4e5f6",1999,"EUR"]
//   [fecha, clave, precio, moneda]
// La clave es el sha1 de la URL de la oferta (12 hex): la URL completa pesa
// ~150 bytes x 48.000 ofertas y el archivo inicial pasaría de 9 MB. Con
// 48 bits la probabilidad de colisión entre 48.000 claves es ~1e-3 y el
// escritor la detecta (ver appendChanges).
//
// Lo escribe scripts/catalog-mining/track_price_drops.mts (el último paso
// del scan nocturno). Es idempotente: compara contra el último precio
// archivado de cada oferta, no contra "ayer", así que correrlo dos veces el
// mismo día, o saltearse un día, no duplica ni inventa nada.
//
// Este módulo lo importan tanto el script (tsx) como las páginas del
// servidor: por eso usa rutas relativas al cwd y no el alias "@/".

export type ArchivePoint = { d: string; p: number; c: string };

export const ARCHIVE_DIR = path.join(process.cwd(), "data", "price-history");

/** Día en que se importó el historial previo. Una primera línea ANTERIOR a
 *  esta fecha es solo "desde cuándo tenemos registro" (la ventana vieja
 *  recortaba lo anterior), no un evento real de la oferta. */
export const SEED_DATE = "2026-10-02";

export function offerKey(url: string): string {
  return createHash("sha1").update(url).digest("hex").slice(0, 12);
}

type Line = [string, string, number, string];

function monthFile(date: string, dir = ARCHIVE_DIR): string {
  return path.join(dir, `${date.slice(0, 7)}.jsonl`);
}

function listFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /^\d{4}-\d{2}\.jsonl$/.test(f))
    .sort()
    .map((f) => path.join(dir, f));
}

function readLines(file: string): Line[] {
  const out: Line[] = [];
  for (const raw of fs.readFileSync(file, "utf-8").split("\n")) {
    if (!raw) continue;
    try {
      const l = JSON.parse(raw) as Line;
      if (Array.isArray(l) && l.length === 4) out.push(l);
    } catch {
      // Una línea cortada (corte de luz a mitad de escritura) no debe
      // tumbar el sitio: se ignora y el próximo append sigue normal.
    }
  }
  return out;
}

export interface Archive {
  byKey: Map<string, ArchivePoint[]>;
  /** Fecha de la última corrida registrada (el "hoy" del archivo). */
  lastDate: string;
  firstDate: string;
  points: number;
}

/** Lee todo el archivo ordenado por fecha. ~2 MB, se indexa una vez por
 *  proceso (las páginas ISR lo reutilizan). */
export function loadArchive(dir = ARCHIVE_DIR): Archive {
  const byKey = new Map<string, ArchivePoint[]>();
  let lastDate = "";
  let firstDate = "9999-99-99";
  let points = 0;
  for (const file of listFiles(dir)) {
    for (const [d, k, p, c] of readLines(file)) {
      const arr = byKey.get(k);
      const pt = { d, p, c };
      if (!arr) byKey.set(k, [pt]);
      else if (arr[arr.length - 1].d === d) arr[arr.length - 1] = pt; // mismo día: gana la última
      else arr.push(pt);
      if (d > lastDate) lastDate = d;
      if (d < firstDate) firstDate = d;
      points++;
    }
  }
  return { byKey, lastDate, firstDate: points ? firstDate : "", points };
}

let cached: Archive | null = null;
export function archive(): Archive {
  return (cached ??= loadArchive());
}

/**
 * Anota los cambios de hoy. `offers` = todas las ofertas vivas del
 * catálogo. Solo se escribe una línea si el precio (o la moneda) difiere
 * del último archivado. Devuelve cuántas líneas agregó.
 */
export function appendChanges(
  offers: readonly { url: string; price: number; currency: string }[],
  date: string,
  dir = ARCHIVE_DIR,
): { added: number; firstSeen: number; changed: number } {
  fs.mkdirSync(dir, { recursive: true });
  const known = loadArchive(dir).byKey;
  const keyOwner = new Map<string, string>();
  const lines: string[] = [];
  let firstSeen = 0;
  let changed = 0;
  for (const o of offers) {
    if (!o.url || !(o.price > 0)) continue;
    const k = offerKey(o.url);
    const owner = keyOwner.get(k);
    if (owner !== undefined && owner !== o.url) {
      throw new Error(`Colisión de claves de precio: ${owner} y ${o.url} -> ${k}`);
    }
    keyOwner.set(k, o.url);
    const arr = known.get(k);
    const last = arr?.[arr.length - 1];
    if (last && last.p === o.price && last.c === o.currency) continue;
    if (last) changed++;
    else firstSeen++;
    lines.push(JSON.stringify([date, k, o.price, o.currency]));
  }
  if (lines.length) fs.appendFileSync(monthFile(date, dir), lines.join("\n") + "\n");
  return { added: lines.length, firstSeen, changed };
}

// ---------------------------------------------------------------- lecturas

/** Evento real de una oferta (no el inicio del registro). Devuelve la
 *  fecha del último, o null si nunca cambió desde que la vemos. */
export function lastChangeDate(url: string, a: Archive = archive()): string | null {
  const arr = a.byKey.get(offerKey(url));
  if (!arr) return null;
  for (let i = arr.length - 1; i >= 0; i--) {
    const isFirst = i === 0;
    if (!isFirst || arr[i].d > SEED_DATE) return arr[i].d;
  }
  return null;
}

export interface OfferPriceStats {
  currency: string;
  /** Días con registro (de la primera línea de la oferta a la última corrida). */
  coverageDays: number;
  min: number;
  minDate: string;
  /** Mediana ponderada por tiempo: cuántos días estuvo cada precio vigente. */
  median: number;
  current: number;
  /** Cantidad de precios distintos que tuvo. */
  distinct: number;
  /** Variación del precio actual contra la mediana, en %. */
  vsMedianPct: number;
  /** Días que lleva el precio actual sin moverse. */
  daysAtCurrent: number;
}

/** Con menos días que estos NO se muestra ningún "mínimo histórico": un
 *  mínimo sobre dos semanas es una anécdota, no un historial. */
export const MIN_COVERAGE_DAYS = 14;

const DAY = 86_400_000;
const dayNum = (d: string) => Math.floor(Date.parse(d + "T00:00:00Z") / DAY);

function weightedMedian(segs: { p: number; w: number }[]): number {
  const s = [...segs].sort((x, y) => x.p - y.p);
  const half = s.reduce((t, x) => t + x.w, 0) / 2;
  let acc = 0;
  for (const x of s) {
    acc += x.w;
    if (acc >= half) return x.p;
  }
  return s[s.length - 1].p;
}

/** Estadísticas de una oferta. null si todavía no hay datos suficientes. */
export function offerPriceStats(
  url: string,
  a: Archive = archive(),
  minCoverage = MIN_COVERAGE_DAYS,
): OfferPriceStats | null {
  const all = a.byKey.get(offerKey(url));
  if (!all?.length || !a.lastDate) return null;
  const cur = all[all.length - 1].c;
  // Solo el tramo en la moneda vigente: un cambio de moneda no es un
  // cambio de precio y mezclarlos inventaría mínimos.
  let start = all.length - 1;
  while (start > 0 && all[start - 1].c === cur) start--;
  const arr = all.slice(start);
  const end = dayNum(a.lastDate) + 1;
  const coverageDays = end - dayNum(arr[0].d);
  if (coverageDays < minCoverage) return null;
  const segs = arr.map((pt, i) => ({
    p: pt.p,
    w: (i + 1 < arr.length ? dayNum(arr[i + 1].d) : end) - dayNum(pt.d),
  }));
  const min = arr.reduce((m, pt) => (pt.p < m.p ? pt : m), arr[0]);
  const current = arr[arr.length - 1].p;
  const median = weightedMedian(segs);
  return {
    currency: cur,
    coverageDays,
    min: min.p,
    minDate: min.d,
    median,
    current,
    distinct: new Set(arr.map((x) => x.p)).size,
    vsMedianPct: median > 0 ? ((current - median) / median) * 100 : 0,
    daysAtCurrent: end - dayNum(arr[arr.length - 1].d),
  };
}

// ------------------------------------------------------ bajadas verificadas

export interface VerifiedDrop {
  /** Precio que la oferta mantuvo justo antes de bajar (el "antes" que se muestra). */
  previous: number;
  /** Días que estuvo vigente ese precio anterior en NUESTRO archivo. */
  previousDays: number;
  /** Días desde que se vio el precio actual por primera vez (1 = hoy). */
  daysAtCurrent: number;
  /** Fecha de la bajada (para cruzar con massDropDays). */
  since: string;
  /** Bajada en %, sin redondear. */
  pct: number;
}

/** Ventana para "mínimo reciente": el precio actual tiene que ser el más bajo
 *  que vimos en estos días, si no es un vaivén (sube y vuelve), no una bajada. */
export const DROP_WINDOW_DAYS = 30;
/** Días mínimos que el precio anterior tiene que haber estado vigente. */
export const MIN_PREVIOUS_DAYS = 5;
/** Cuánto puede separarse el precio anterior de la mediana de la ventana. */
const USUAL_TOLERANCE = 0.05;

/**
 * Bajada REAL de una oferta, medida solo con nuestro propio archivo (nunca con
 * el "precio tachado" del feed): el precio anterior estuvo vigente al menos
 * `minPreviousDays` días, el actual es el que tiene hoy el catálogo y es el
 * más bajo de los últimos DROP_WINDOW_DAYS días. null si no se cumple.
 *
 * Por qué tanto: el rastreo comparaba contra "ayer", y una entrada de reventa
 * que sube y baja cada día (o una tienda que alterna dos precios) salía como
 * "-45 %" todas las semanas.
 */
export function verifiedDrop(
  url: string,
  price: number,
  currency: string,
  a: Archive = archive(),
  minPreviousDays = MIN_PREVIOUS_DAYS,
): VerifiedDrop | null {
  const arr = a.byKey.get(offerKey(url));
  if (!arr || arr.length < 2 || !a.lastDate) return null;
  const cur = arr[arr.length - 1];
  // El archivo tiene que estar al día con el catálogo (mismo precio y moneda).
  if (cur.p !== price || cur.c !== currency) return null;
  const prev = arr[arr.length - 2];
  if (prev.c !== currency || !(prev.p > price)) return null;
  const previousDays = dayNum(cur.d) - dayNum(prev.d);
  if (previousDays < minPreviousDays) return null;
  // Mínimo de la ventana: ningún precio de los últimos N días (incluido el que
  // regía al empezar la ventana) puede ser igual o menor que el actual.
  // Y el precio anterior tiene que ser el HABITUAL de esa ventana (mediana
  // por días), no un pico: Foot-Store ES tuvo una camiseta a 50 € casi un
  // mes, la subió a 77 € cinco días y la "bajó" a 47,42: eso es -5 %, no -38 %.
  const from = dayNum(a.lastDate) - DROP_WINDOW_DAYS;
  const segs: { p: number; w: number }[] = [];
  for (let i = 0; i < arr.length - 1; i++) {
    const until = dayNum(arr[i + 1].d); // ese precio rigió hasta este día
    if (until <= from || arr[i].c !== currency) continue;
    if (arr[i].p <= price) return null;
    segs.push({ p: arr[i].p, w: until - Math.max(dayNum(arr[i].d), from) });
  }
  if (!segs.length) return null;
  const usual = weightedMedian(segs);
  if (Math.abs(prev.p - usual) / usual > USUAL_TOLERANCE) return null;
  return {
    previous: prev.p,
    previousDays,
    daysAtCurrent: dayNum(a.lastDate) - dayNum(cur.d) + 1,
    since: cur.d,
    pct: ((prev.p - price) / prev.p) * 100,
  };
}

/** Parte de las ofertas de una tienda (en una sección) que tienen que bajar el
 *  mismo día para considerarlo un cambio del feed o de nuestra minería y no
 *  una rebaja: p. ej. el 2026-10-09 las botas de Foot-Store FR pasaron del
 *  precio de lista al de venta (1.636 de 1.932, -30 % de mediana). */
export const MASS_DROP_SHARE = 0.25;
const MASS_DROP_MIN = 20;

/** Días "tienda|fecha" en que bajó de golpe una parte grande de la tienda.
 *  Se llama por sección: `offers` = las ofertas vivas de UNA sección. */
export function massDropDays(
  offers: readonly { store: string; url: string }[],
  a: Archive = archive(),
): Set<string> {
  const total = new Map<string, number>();
  const drops = new Map<string, number>();
  for (const o of offers) {
    total.set(o.store, (total.get(o.store) ?? 0) + 1);
    const arr = a.byKey.get(offerKey(o.url));
    if (!arr) continue;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].c !== arr[i - 1].c || arr[i].p >= arr[i - 1].p) continue;
      const k = `${o.store}|${arr[i].d}`;
      drops.set(k, (drops.get(k) ?? 0) + 1);
    }
  }
  const out = new Set<string>();
  for (const [k, n] of drops) {
    const t = total.get(k.slice(0, k.lastIndexOf("|"))) ?? 0;
    if (n >= MASS_DROP_MIN && n >= t * MASS_DROP_SHARE) out.add(k);
  }
  return out;
}

/** Serie de una oferta, para quien arme índices (fecha, precio). */
export function offerSeries(url: string, a: Archive = archive()): ArchivePoint[] {
  return a.byKey.get(offerKey(url)) ?? [];
}

/** Precio vigente de una oferta en una fecha (forward-fill), o null. */
export function priceOn(arr: ArchivePoint[], date: string): ArchivePoint | null {
  let r: ArchivePoint | null = null;
  for (const pt of arr) {
    if (pt.d <= date) r = pt;
    else break;
  }
  return r;
}

/** Stats de varias ofertas de una vez, solo las que ya tienen cobertura
 *  suficiente. Es lo que las fichas (server) le pasan al cliente: el cliente
 *  elige la mejor oferta según país y talla, así que se mandan todas las de
 *  la ficha (unas pocas, ~200 bytes cada una). */
export function archiveStatsFor(urls: readonly string[]): Record<string, OfferPriceStats> {
  const a = archive();
  const out: Record<string, OfferPriceStats> = {};
  for (const u of urls) {
    const s = offerPriceStats(u, a);
    if (s) out[u] = s;
  }
  return out;
}
