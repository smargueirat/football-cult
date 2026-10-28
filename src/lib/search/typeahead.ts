import type { HubLocale } from "@/data/teamMeta";

// Autocompletado del buscador de la home (2026-10-28). Este archivo lo
// importa HeroSearch ("use client"), así que NO puede importar nada de
// src/data/ (ver offerMoney.ts: un import así mete el catálogo entero en
// el bundle). Los datos llegan aparte, en el JSON de
// /api/search-index/[locale] que arma src/lib/searchIndex.ts.

/** t = equipo (club), l = liga, n = selección/país, p = producto. */
export type TypeaheadGroup = "t" | "l" | "n" | "p";

export interface TypeaheadEntry {
  g: TypeaheadGroup;
  /** Nombre que se muestra, ya en el idioma de la página. */
  n: string;
  /** Ruta sin el idioma delante ("/equipo/realmadrid"). */
  h: string;
  /** Foto real del catálogo (URL original; se achica con getDisplaySrc). */
  i?: string;
  /** Bandera (emoji) para selecciones y ligas. */
  f?: string;
  /** Otros nombres por los que se busca (los de los demás idiomas). */
  k?: string;
}

export const GROUP_ORDER: TypeaheadGroup[] = ["t", "n", "l", "p"];
const GROUP_LIMIT: Record<TypeaheadGroup, number> = { t: 5, n: 3, l: 3, p: 4 };

export const TYPEAHEAD_UI: Record<HubLocale, Record<TypeaheadGroup, string>> = {
  es: { t: "Equipos", l: "Ligas", n: "Selecciones", p: "Productos" },
  en: { t: "Teams", l: "Leagues", n: "National teams", p: "Products" },
  pt: { t: "Clubes", l: "Ligas", n: "Seleções", p: "Produtos" },
  fr: { t: "Clubs", l: "Championnats", n: "Sélections", p: "Produits" },
  it: { t: "Squadre", l: "Campionati", n: "Nazionali", p: "Prodotti" },
};

/** Sin acentos, sin mayúsculas y con todo lo que no es letra o número
 *  convertido en espacio: "Atlético de Madrid" -> "atletico de madrid". */
export function fold(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export type Prepared = TypeaheadEntry & { hay: string; name: string };

export function prepare(entries: TypeaheadEntry[]): Prepared[] {
  return entries.map((e) => ({ ...e, name: ` ${fold(e.n)}`, hay: ` ${fold(e.n)} ${e.k ? fold(e.k) : ""} ` }));
}

/** Cada palabra de la consulta tiene que ser el COMIENZO de alguna palabra
 *  del nombre ("real" encuentra "Real Betis", no "Cereal"). Primero los que
 *  empiezan por la consulta; dentro de eso se respeta el orden del índice,
 *  que ya viene de más a menos catálogo. Barrido lineal sobre unos pocos
 *  miles de entradas: menos de un milisegundo, no hace falta debounce. */
export function matchTypeahead(list: Prepared[], query: string): Prepared[] {
  const q = fold(query);
  if (q.length < 2) return [];
  const words = q.split(" ").map((w) => ` ${w}`);
  const hits: Prepared[] = [];
  for (const e of list) if (words.every((w) => e.hay.includes(w))) hits.push(e);
  const first = ` ${q}`;
  const ranked = [...hits.filter((e) => e.name.startsWith(first)), ...hits.filter((e) => !e.name.startsWith(first))];
  const out: Prepared[] = [];
  for (const g of GROUP_ORDER) out.push(...ranked.filter((e) => e.g === g).slice(0, GROUP_LIMIT[g]));
  return out;
}
