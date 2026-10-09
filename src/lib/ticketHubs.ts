import type { TeamKey } from "@/data/products";
import { ticketProducts, type TicketProduct } from "@/data/tickets";
import { teamNames } from "@/lib/productMeta";
import { ticketOfferTotalInEUR, ticketSellers } from "@/lib/offerMoney";

// Hubs de entradas (2026-10-09): por equipo y por competición. Aparte de
// extraHubs.ts a propósito: solo carga el catálogo de entradas, no el de
// camisetas ni el de botas (en `next dev` la página de entradas con los tres
// juntos llegó a 10 GB y la mató el OOM killer).

const slugify = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export { slugify as ticketSlug };

export const TICKET_MIN = 6; // mismo umbral que MIN_HUB_ITEMS de gearHubs
export const ticketTeams = (event: string) => event.split(/\s+vs\s+/i).map((s) => s.trim()).filter(Boolean);

// Nombre del feed ("Inter Milan", "FC Barcelona") -> clave de equipo del
// catálogo de camisetas, para enlazar entradas <-> camisetas del mismo club.
// Sin coincidencia exacta tras quitar siglas, no se enlaza: mejor nada que
// mandar al Sporting de Gijón desde el Sporting de Lisboa.
const normTeam = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\b(fc|cf|afc|sc|ac|as|ssc|club|de|cd|rcd|ud|sd|ca|sl|vfb|vfl|tsg|bv|rb)\b/g, "")
    .replace(/[^a-z0-9]+/g, "");
let teamIndex: Map<string, TeamKey> | null = null;
export function teamKeyForTicketName(name: string): TeamKey | undefined {
  if (!teamIndex) {
    teamIndex = new Map();
    for (const [k, v] of Object.entries(teamNames) as [TeamKey, Record<string, string>][]) {
      for (const n of Object.values(v)) if (!teamIndex.has(normTeam(n))) teamIndex.set(normTeam(n), k);
    }
  }
  return teamIndex.get(normTeam(name));
}

function ticketFacets(key: (t: TicketProduct) => string[]) {
  const m = new Map<string, { slug: string; name: string; count: number }>();
  for (const t of ticketProducts) {
    for (const name of key(t)) {
      const slug = slugify(name);
      if (!slug) continue;
      const f = m.get(slug) ?? { slug, name, count: 0 };
      f.count++;
      m.set(slug, f);
    }
  }
  return [...m.values()].filter((f) => f.count >= TICKET_MIN).sort((a, b) => b.count - a.count);
}
let teamFacetCache: ReturnType<typeof ticketFacets> | null = null;
let compFacetCache: ReturnType<typeof ticketFacets> | null = null;
export const ticketTeamFacets = () => (teamFacetCache ??= ticketFacets((t) => ticketTeams(t.event)));
export const ticketCompetitionFacets = () => (compFacetCache ??= ticketFacets((t) => [t.competition]));

const byDate = (a: TicketProduct, b: TicketProduct) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`);
export const ticketTeamItems = (slug: string) => ticketProducts.filter((t) => ticketTeams(t.event).some((n) => slugify(n) === slug)).sort(byDate);
export const ticketCompetitionItems = (slug: string) => ticketProducts.filter((t) => slugify(t.competition) === slug).sort(byDate);

export function ticketTeamSlugForKey(key: string): string | undefined {
  return ticketTeamFacets().find((f) => teamKeyForTicketName(f.name) === key)?.slug;
}

/** Datos del hub de entradas: nº de partidos, primera/última fecha, vendedores
 *  distintos y el precio más bajo (EUR, el que compara el resto del sitio). */
export function ticketStats(items: TicketProduct[]) {
  let min = Infinity;
  const sellers = new Set<string>();
  for (const t of items) {
    for (const s of ticketSellers(t.offers)) sellers.add(s);
    for (const o of t.offers) min = Math.min(min, ticketOfferTotalInEUR(o));
  }
  return { n: items.length, first: items[0]?.date ?? "", last: items[items.length - 1]?.date ?? "", sellers: sellers.size, minEur: min };
}

