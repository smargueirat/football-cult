import { bestOffer, products, teamNames, type TeamKey } from "@/data/products";
import { bootProducts } from "@/data/boots";
import { COUNTRY_FLAGS, COUNTRY_SLUGS, LEAGUES, leagueName, type HubLocale } from "@/data/teamMeta";
import { countryTeams, leagueTeams, teamItems, teamKeysWithItems, teamName } from "@/lib/hubs";
import { getAgeGroup, kitTypeName, seasonSortValue, teamCategory } from "@/lib/productMeta";
import { countDistinctRetailers } from "@/lib/retailerFamily";
import { mainPhoto } from "@/lib/officialStores";
import { localizeGearModel } from "@/lib/gearText";
import { HUB } from "@/lib/hubStrings";
import type { TypeaheadEntry } from "@/lib/search/typeahead";

// Índice del autocompletado de la home, uno por idioma. SOLO servidor: lo
// sirve como JSON estático src/app/api/search-index/[locale]/route.ts y el
// cliente lo pide recién al enfocar el buscador.
//
// Los hubs salen de las MISMAS funciones que deciden si la página existe
// (y que usa el sitemap): equipo con teamItems, liga con leagueTeams, país
// con countryTeams. Así ninguna sugerencia lleva a un 404.
//
// Productos: solo las fichas que comparan en 2+ tiendas (986 camisetas y
// 1.463 botas el 2026-10-28). Con todas el JSON pasaba de largo el
// presupuesto, y una ficha de una sola tienda no es lo que el sitio hace.

const others = (names: Record<HubLocale, string>, shown: string) =>
  [...new Set(Object.values(names))].filter((n) => n !== shown).join(" ") || undefined;

/** Foto de la camiseta de local más reciente del equipo (adulto), o la que haya. */
function teamPhoto(team: string): string | undefined {
  const items = teamItems(team);
  const pick = items.find((it) => it.product.typeKey === "home" && getAgeGroup(it.product) === "men") ?? items[0];
  return pick && mainPhoto(pick.offer, pick.product.offers);
}

export function searchIndex(locale: HubLocale): TypeaheadEntry[] {
  const allNames = (k: string) => teamNames[k as TeamKey] as Record<HubLocale, string> | undefined;
  const byVolume = (keys: string[]) => keys.map((k) => ({ k, n: teamItems(k).length })).sort((a, b) => b.n - a.n).map((x) => x.k);

  const teams: TypeaheadEntry[] = byVolume(teamKeysWithItems().filter((k) => teamCategory[k as TeamKey] !== "national")).map((k) => {
    const n = teamName(k, locale);
    const names = allNames(k);
    return { g: "t", n, h: `/equipo/${k}`, i: teamPhoto(k), k: names && others(names, n) };
  });

  // Selecciones: la página de país (/pais/x) cuando existe -- lleva arriba
  // las camisetas de la selección y debajo sus ligas y clubes --, si no el
  // hub de la selección (/equipo/x).
  const nationalKeys = teamKeysWithItems().filter((k) => teamCategory[k as TeamKey] === "national");
  const countryPages = COUNTRY_SLUGS.filter((c) => countryTeams(c).length > 0);
  const nations: TypeaheadEntry[] = byVolume([...new Set([...nationalKeys, ...countryPages])]).map((k) => {
    const n = teamName(k, locale);
    const names = allNames(k);
    const flag = COUNTRY_FLAGS[k];
    return {
      g: "n",
      n,
      h: countryPages.includes(k) ? `/pais/${k}` : `/equipo/${k}`,
      ...(flag ? { f: flag } : { i: teamPhoto(k) }),
      k: names && others(names, n),
    };
  });

  const leagues: TypeaheadEntry[] = LEAGUES.filter((l) => leagueTeams(l.slug).length > 0).map((l) => {
    const n = leagueName(l, locale);
    return { g: "l", n, h: `/liga/${l.slug}`, f: COUNTRY_FLAGS[l.country], k: typeof l.name === "string" ? undefined : others(l.name, n) };
  });

  const s = HUB[locale];
  const jerseys: TypeaheadEntry[] = products
    .filter((p) => countDistinctRetailers(p.offers.filter((o) => o.inStock)) >= 2)
    // Temporada más nueva primero; dentro de ella, adulto antes que niño/mujer
    // y la de local antes que el resto.
    .sort(
      (a, b) =>
        seasonSortValue(b.season) - seasonSortValue(a.season) ||
        Number(getAgeGroup(a) !== "men") - Number(getAgeGroup(b) !== "men") ||
        Number(a.typeKey !== "home") - Number(b.typeKey !== "home"),
    )
    .map((p) => {
      const age = getAgeGroup(p);
      const n = `${teamName(p.teamKey, locale)} ${kitTypeName(p, locale)} ${p.season}${age === "men" ? "" : ` · ${age === "kids" ? s.kids : s.women}`}`;
      return { g: "p", n, h: `/camiseta/${p.id}`, i: mainPhoto(bestOffer(p), p.offers) };
    });

  const boots: TypeaheadEntry[] = bootProducts
    .filter((b) => b.offers.length && countDistinctRetailers(b.offers) >= 2)
    .sort((a, b) => countDistinctRetailers(b.offers) - countDistinctRetailers(a.offers))
    .map((b) => ({ g: "p", n: localizeGearModel(b.model, b.brand, locale), h: `/botas/${b.id}`, i: mainPhoto(undefined, b.offers) }));

  // Un producto por nombre: los colorways de una misma bota (y las versiones
  // de una misma camiseta) se llaman igual y en la lista serían filas
  // idénticas a la vista. Queda la primera, la de más tiendas.
  const seen = new Set<string>();
  const unique = [...jerseys, ...boots].filter((e) => !seen.has(e.n) && !!seen.add(e.n));

  // Sin claves vacías: cada byte cuenta en un JSON de unos miles de filas.
  return [...teams, ...nations, ...leagues, ...unique].map(
    (e) => Object.fromEntries(Object.entries(e).filter(([, v]) => v !== undefined)) as unknown as TypeaheadEntry,
  );
}
