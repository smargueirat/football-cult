import { archive, offerSeries, type Archive, type ArchivePoint } from "@/lib/priceArchive";
import { priceStudy, type StudyExample } from "@/lib/priceStudy";
import { leagueOfTeam } from "@/data/teamMeta";

// Índice de precios de camisetas, calculado EN BUILD con dos fuentes reales:
//  - corte transversal: las mismas filas del estudio /estudios/precios-camisetas
//    (misma prenda = mismo código de fabricante, solo EUR, solo minoristas
//    oficiales, temporada actual), agrupadas por liga y por marca;
//  - serie en el tiempo: el archivo durable data/price-history (solo
//    cambios), siguiendo EXACTAMENTE las mismas ofertas de cada fila.
//
// Cómo se mide la serie, para que sea defendible:
//  - Panel fijo: las filas cuyas ofertas tienen todas precio registrado en la
//    fecha base. Así el índice no cambia porque entren o salgan camisetas,
//    solo porque cambian precios.
//  - Fecha base = la primera en que >= 80% de las filas del estudio tienen
//    todas sus ofertas registradas. No se inventan datos anteriores.
//  - Para cada fila, el precio del día = el más bajo entre sus ofertas
//    (sin envío: el archivo guarda el precio de lista, el envío se asume
//    constante). Índice(d) = mediana de precio(d)/precio(base) * 100.
//  - Con solo ~2 semanas de archivo NO hay serie mensual todavía: se
//    publica la serie diaria y se dice. Los puntos mensuales aparecen
//    cuando el archivo cubre al menos dos meses calendario completos.

export const MIN_GROUP = 5;
const MIN_COVERAGE = 0.8;

export interface GroupRow {
  key: string;
  n: number;
  avgGapPct: number;
  medianGapPct: number;
  /** Variación mediana del precio más bajo desde la fecha base (%). null si no hay serie. */
  changePct: number | null;
}

export interface IndexPoint {
  date: string;
  index: number;
}

export interface PriceIndex {
  /** Filas del corte transversal (= filas del estudio). */
  sample: number;
  avgGapPct: number;
  medianGapPct: number;
  byLeague: GroupRow[];
  byBrand: GroupRow[];
  /** Serie. null si el archivo todavía no alcanza para una fecha base. */
  series: null | {
    baseDate: string;
    lastDate: string;
    /** Días calendario cubiertos, contando ambos extremos. */
    days: number;
    panel: number;
    points: IndexPoint[];
    /** Último punto de cada mes calendario CERRADO (hay datos del mes siguiente). */
    monthly: IndexPoint[];
    /** Cambio de la mediana entre base y último día (%). */
    changePct: number;
  };
  /** id de camiseta -> variación (%) de su precio más bajo desde la base. */
  changeById: Record<string, number>;
  /** Primer y último día con datos en el archivo, para decirlo en la página. */
  archiveFrom: string;
  archiveTo: string;
}

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

const DAY = 86_400_000;
const dayNum = (d: string) => Math.floor(Date.parse(d + "T00:00:00Z") / DAY);
const dateOf = (n: number) => new Date(n * DAY).toISOString().slice(0, 10);

/** Precio más bajo de una fila en una fecha, o null si alguna oferta no
 *  tiene registro todavía (o no está en EUR). */
function lowOn(series: ArchivePoint[][], date: string): number | null {
  let low = Infinity;
  for (const s of series) {
    let r: ArchivePoint | null = null;
    for (const pt of s) {
      if (pt.d <= date) r = pt;
      else break;
    }
    if (!r || r.c !== "EUR" || r.p <= 0) return null;
    if (r.p < low) low = r.p;
  }
  return Number.isFinite(low) ? low : null;
}

function groupRows(
  rows: StudyExample[],
  keyOf: (r: StudyExample) => string | null,
  change: Map<string, number>,
): GroupRow[] {
  const m = new Map<string, StudyExample[]>();
  for (const r of rows) {
    const k = keyOf(r);
    if (k) m.set(k, [...(m.get(k) ?? []), r]);
  }
  return [...m.entries()]
    .filter(([, rs]) => rs.length >= MIN_GROUP)
    .map(([key, rs]) => {
      const ch = rs.map((r) => change.get(r.id)).filter((x): x is number => x !== undefined);
      return {
        key,
        n: rs.length,
        avgGapPct: rs.reduce((a, r) => a + r.gapPct, 0) / rs.length,
        medianGapPct: median(rs.map((r) => r.gapPct)),
        changePct: ch.length >= MIN_GROUP ? (median(ch) - 1) * 100 : null,
      };
    })
    .sort((a, b) => b.n - a.n);
}

let cached: PriceIndex | null = null;

export function priceIndex(a: Archive = archive()): PriceIndex {
  if (cached && a === archive()) return cached;
  const study = priceStudy();
  const rows = study.rows;
  const per = rows.map((r) => ({ r, s: r.urls.map((u) => offerSeries(u, a)) }));

  let series: PriceIndex["series"] = null;
  const change = new Map<string, number>();

  if (a.firstDate && a.lastDate && rows.length) {
    const first = dayNum(a.firstDate);
    const last = dayNum(a.lastDate);
    // Fecha base: la primera con cobertura suficiente del panel.
    let base: string | null = null;
    for (let d = first; d <= last && !base; d++) {
      const date = dateOf(d);
      const covered = per.filter((x) => lowOn(x.s, date) !== null).length;
      if (covered / rows.length >= MIN_COVERAGE) base = date;
    }
    if (base) {
      const panel = per
        .map((x) => ({ id: x.r.id, s: x.s, base: lowOn(x.s, base!) }))
        .filter((x): x is { id: string; s: ArchivePoint[][]; base: number } => x.base !== null);
      const points: IndexPoint[] = [];
      for (let d = dayNum(base); d <= last; d++) {
        const date = dateOf(d);
        const ratios: number[] = [];
        for (const x of panel) {
          const v = lowOn(x.s, date);
          if (v !== null) ratios.push(v / x.base);
        }
        // Si se cae más del 10% del panel ese día, el punto no es comparable.
        if (ratios.length >= panel.length * 0.9) points.push({ date, index: median(ratios) * 100 });
      }
      for (const x of panel) {
        const v = lowOn(x.s, a.lastDate);
        if (v !== null) change.set(x.id, v / x.base);
      }
      const monthly: IndexPoint[] = [];
      for (let i = 0; i < points.length; i++) {
        const cur = points[i].date.slice(0, 7);
        const next = points[i + 1]?.date.slice(0, 7);
        if (next && next !== cur) monthly.push(points[i]);
      }
      if (points.length >= 2) {
        series = {
          baseDate: base,
          lastDate: a.lastDate,
          days: last - dayNum(base) + 1,
          panel: panel.length,
          points,
          monthly,
          changePct: points[points.length - 1].index - 100,
        };
      }
    }
  }

  const out: PriceIndex = {
    sample: rows.length,
    avgGapPct: study.avgGapPct,
    medianGapPct: study.medianGapPct,
    byLeague: groupRows(rows, (r) => leagueOfTeam(r.teamKey)?.slug ?? null, change),
    byBrand: groupRows(rows, (r) => r.brand || null, change),
    series,
    changeById: Object.fromEntries([...change].map(([id, r]) => [id, (r - 1) * 100])),
    archiveFrom: a.firstDate,
    archiveTo: a.lastDate,
  };
  if (a === archive()) cached = out;
  return out;
}
