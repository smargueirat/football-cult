import { products, teamNames, type Product } from "@/data/products";
import { ticketProducts, type TicketProduct } from "@/data/tickets";
import { leagueName, leagueOfTeam, type HubLocale } from "@/data/teamMeta";
import { isVintageRetro, kitOf, seasonSortValue, teamCategory } from "@/lib/productMeta";
import { bootOfferTotalInEUR, ticketOfferTotalInEUR, type BootCurrencyCode } from "@/lib/offerMoney";
import { translations } from "@/lib/i18n/translations";
import { brandFacets, brandGroundCombos, groundFacets, groundSlug, slugify, typeFacets, type GearSection } from "@/lib/gearHubs";
import { brandHeadline, groundHeadline, groundName, sectionNoun } from "@/lib/gearHubStrings";
import { seasonList, seasonSlug } from "@/lib/seasonHubs";
import { HUB } from "@/lib/hubStrings";
import { EXTRA } from "@/lib/extraHubStrings";
import { MIN_HUB_ITEMS } from "@/lib/gearHubs";
import { decadeOf, futsalItems, kidsBootItems, lineFacets, retroDecadeFacets, retroTeamFacets } from "@/lib/extraHubs";
import { bootLinesOf, isKidsBoot } from "@/lib/bootLines";
import { teamKeyForTicketName, ticketCompetitionFacets, ticketSlug, ticketTeamFacets, ticketTeams } from "@/lib/ticketHubs";
import { brandLabel, gearName, jerseyName, ticketName, type GearLike } from "@/lib/seoMeta";

// Migas de pan y enlaces "relacionados" de las fichas (2026-10-09, revisión
// SEO H04/H05/H07). SOLO servidor. El crawl del 08-10 midió 7.254 fichas
// colgando solo de /indice y 4.461 sin ningún enlace HTML: cada ficha
// enlaza ahora a su equipo/liga/sección (las migas, también en
// BreadcrumbList) y a 6-16 fichas hermanas reales, así que ninguna depende
// de una cadena de paginación.
//
// Los hubs de extraHubs.ts (líneas de bota, botas niño/sala, retro por
// equipo/década, entradas por equipo/competición) entran en las migas y en
// los enlaces solo si existen hoy para ESE producto (mismos facets que
// generan esas páginas), o la miga apuntaría a un 404.

export interface Crumb {
  name: string;
  /** Ruta sin el prefijo de idioma ("/botas/marca/nike"); el último va sin path. */
  path?: string;
}
export interface LinkItem {
  href: string; // con idioma
  label: string;
}
export interface Related {
  groups: { title: string; links: LinkItem[] }[];
  hubs: LinkItem[];
}

const T: Record<
  HubLocale,
  {
    nationalTeams: string;
    tickets: string;
    sameSeason: (x: string) => string;
    otherSeasons: (x: string) => string;
    sameLine: string;
    moreOf: (x: string) => string;
    competition: (x: string) => string;
    teamMatches: (x: string) => string;
    seeAlso: string;
  }
> = {
  es: {
    nationalTeams: "Selecciones",
    tickets: "Entradas",
    sameSeason: (x) => `Más camisetas ${x}`,
    otherSeasons: (x) => `${x}: otras temporadas`,
    sameLine: "Otros colores y versiones",
    moreOf: (x) => `Más ${x}`,
    competition: (x) => `Más partidos de ${x}`,
    teamMatches: (x) => `Próximos partidos de ${x}`,
    seeAlso: "Ver también",
  },
  en: {
    nationalTeams: "National teams",
    tickets: "Tickets",
    sameSeason: (x) => `More ${x} shirts`,
    otherSeasons: (x) => `${x}: other seasons`,
    sameLine: "Other colours and versions",
    moreOf: (x) => `More ${x}`,
    competition: (x) => `More ${x} matches`,
    teamMatches: (x) => `Upcoming ${x} matches`,
    seeAlso: "See also",
  },
  pt: {
    nationalTeams: "Seleções",
    tickets: "Ingressos",
    sameSeason: (x) => `Mais camisas ${x}`,
    otherSeasons: (x) => `${x}: outras temporadas`,
    sameLine: "Outras cores e versões",
    moreOf: (x) => `Mais ${x}`,
    competition: (x) => `Mais jogos de ${x}`,
    teamMatches: (x) => `Próximos jogos de ${x}`,
    seeAlso: "Veja também",
  },
  fr: {
    nationalTeams: "Sélections",
    tickets: "Billets",
    sameSeason: (x) => `Plus de maillots ${x}`,
    otherSeasons: (x) => `${x} : autres saisons`,
    sameLine: "Autres coloris et versions",
    moreOf: (x) => `Plus de ${x}`,
    competition: (x) => `Plus de matchs de ${x}`,
    teamMatches: (x) => `Prochains matchs de ${x}`,
    seeAlso: "Voir aussi",
  },
  it: {
    nationalTeams: "Nazionali",
    tickets: "Biglietti",
    sameSeason: (x) => `Altre maglie ${x}`,
    otherSeasons: (x) => `${x}: altre stagioni`,
    sameLine: "Altri colori e versioni",
    moreOf: (x) => `Altri ${x}`,
    competition: (x) => `Altre partite di ${x}`,
    teamMatches: (x) => `Prossime partite di ${x}`,
    seeAlso: "Vedi anche",
  },
};

const team = (k: string, l: HubLocale) => (teamNames as Record<string, Record<HubLocale, string>>)[k]?.[l] ?? k;
// Agotadas fuera de los enlaces relacionados (2026-10-09).
const hasItems = (p: Product) => p.offers.some((o) => o.inStock);

// ---------------------------------------------------------------- camisetas

export function jerseyTrail(p: Product, locale: HubLocale): Crumb[] {
  const s = HUB[locale];
  const league = leagueOfTeam(p.teamKey);
  const up: Crumb[] =
    league
      ? [{ name: team(league.country, locale), path: `/pais/${league.country}` }, { name: leagueName(league, locale), path: `/liga/${league.slug}` }]
      : teamCategory[p.teamKey] === "national"
        ? [{ name: T[locale].nationalTeams, path: "/selecciones" }]
        : [];
  // Retro (<= 2006): Inicio > Retro > Retro del equipo, si ese hub existe.
  if (isVintageRetro(p)) {
    const x = EXTRA[locale];
    const teamHub = retroTeamFacets().some((f) => f.team === p.teamKey);
    return [
      { name: s.home, path: "" },
      { name: x.retroAll, path: "/retro" },
      ...(teamHub ? [{ name: x.retroTeamH1(team(p.teamKey, locale), teamCategory[p.teamKey] === "national"), path: `/retro/${p.teamKey}` }] : []),
      { name: jerseyName(p, locale) },
    ];
  }
  return [{ name: s.home, path: "" }, ...up, { name: team(p.teamKey, locale), path: `/equipo/${p.teamKey}` }, { name: jerseyName(p, locale) }];
}

function retroHubs(p: Product, locale: HubLocale): LinkItem[] {
  if (!isVintageRetro(p)) return [];
  const x = EXTRA[locale];
  const d = decadeOf(p.season);
  return [
    ...(retroTeamFacets().some((f) => f.team === p.teamKey)
      ? [{ href: `/${locale}/retro/${p.teamKey}`, label: x.retroTeamH1(team(p.teamKey, locale), teamCategory[p.teamKey] === "national") }]
      : []),
    ...(retroDecadeFacets().some((f) => f.decade === d) ? [{ href: `/${locale}/retro/decada/${d}`, label: x.retroDecadeH1(d) }] : []),
  ];
}

let byTeam: Map<string, Product[]> | null = null;
function teamProducts(k: string): Product[] {
  if (!byTeam) {
    byTeam = new Map();
    for (const p of products) if (hasItems(p)) byTeam.set(p.teamKey, [...(byTeam.get(p.teamKey) ?? []), p]);
  }
  return byTeam.get(k) ?? [];
}

const jerseyLink = (p: Product, l: HubLocale): LinkItem => ({ href: `/${l}/camiseta/${p.id}`, label: jerseyName(p, l) });

export function jerseyRelated(p: Product, locale: HubLocale): Related {
  const mates = teamProducts(p.teamKey).filter((x) => x.id !== p.id);
  const sameSeason = mates.filter((x) => x.season === p.season).slice(0, 8);
  const kit = kitOf(p);
  const y = seasonSortValue(p.season);
  const otherSeasons = mates
    .filter((x) => x.season !== p.season && kitOf(x) === kit && (x.ageGroup ?? "men") === (p.ageGroup ?? "men"))
    .sort((a, b) => Math.abs(seasonSortValue(a.season) - y) - Math.abs(seasonSortValue(b.season) - y))
    .slice(0, 8);
  const name = team(p.teamKey, locale);
  const league = leagueOfTeam(p.teamKey);
  const season = seasonList().includes(p.season) ? p.season : undefined;
  return {
    groups: [
      { title: T[locale].sameSeason(`${name} ${p.season}`), links: sameSeason.map((x) => jerseyLink(x, locale)) },
      { title: T[locale].otherSeasons(name), links: otherSeasons.map((x) => jerseyLink(x, locale)) },
    ],
    hubs: [
      ...retroHubs(p, locale),
      { href: `/${locale}/equipo/${p.teamKey}`, label: HUB[locale].teamH1(name) },
      ...(league ? [{ href: `/${locale}/liga/${league.slug}`, label: HUB[locale].leagueH1(leagueName(league, locale)) }] : []),
      ...(season ? [{ href: `/${locale}/temporada/${seasonSlug(season)}`, label: `${HUB[locale].seasonLabel} ${season}` }] : []),
    ],
  };
}

// ---------------------------------------------------------------- equipamiento

const brandHub = (section: GearSection, brand: string) => brandFacets(section).find((b) => b.slug === slugify(brand));

export function gearTrail(section: GearSection, item: GearLike, locale: HubLocale): Crumb[] {
  const out: Crumb[] = [{ name: HUB[locale].home, path: "" }, { name: sectionNoun(section, locale), path: `/${section}` }];
  const b = brandHub(section, item.brand);
  const special = section === "botas" ? bootSpecialHub(item, locale) : undefined;
  if (special) {
    out.push({ name: special.label, path: special.path });
  } else if ((section === "ropa" || section === "entrenamiento") && item.type && typeFacets(section).some((t) => t.slug === item.type)) {
    const names = translations[locale][section].types as Record<string, string>;
    out.push({ name: names[item.type] ?? item.type, path: `/${section}/tipo/${item.type}` });
  } else if (b) {
    out.push({ name: brandLabel(b.name), path: `/${section}/marca/${b.slug}` });
    const g = item.groundType;
    const lines = section === "botas" ? bootLineHubs(item) : [];
    // Botas: Marca > línea ("Nike Mercurial" > "Nike Mercurial Superfly")
    // si existe; si no, Marca > terreno.
    if (lines.length) for (const l of lines) out.push({ name: l.name, path: `/botas/linea/${l.slug}` });
    else if (section === "botas" && g && brandGroundCombos().some((c) => c.brandSlug === b.slug && c.ground === g)) {
      out.push({ name: groundName(g, locale), path: `/botas/marca/${b.slug}/${groundSlug(g)}` });
    }
  }
  out.push({ name: gearName(section, item, locale) });
  return out;
}

/** Líneas con hub de esta bota, de la general a la concreta. */
const bootLineHubs = (item: GearLike) => {
  const mine = new Set(bootLinesOf(item));
  return lineFacets().filter((l) => mine.has(l.slug)).sort((a, b) => (a.parent ? 1 : 0) - (b.parent ? 1 : 0));
};

/** Botas de niño y de sala cuelgan de su propio hub, no del de marca/terreno. */
function bootSpecialHub(item: GearLike, locale: HubLocale): { path: string; label: string } | undefined {
  if (isKidsBoot(item) && kidsBootItems().length >= MIN_HUB_ITEMS) return { path: "/botas/ninos", label: EXTRA[locale].kidsH1 };
  if (item.groundType === "IC" && futsalItems().length >= MIN_HUB_ITEMS) return { path: "/botas/futbol-sala", label: EXTRA[locale].futsalH1 };
  return undefined;
}

// "Línea" = marca + las dos primeras palabras del modelo sin marca ni
// sustantivo ("Mercurial Vapor", "Predator Elite", "Copa Pure"): el mismo
// modelo en otros colores/tapones y sus hermanos de gama.
const lineKey = (item: GearLike) => {
  const words = gearName("botas", item, "es")
    .replace(/^Botas\s+/, "")
    .split(/\s+/);
  return words.slice(0, 3).join(" ").toLowerCase();
};
const eur = (item: GearLike) =>
  Math.min(...item.offers.map((o) => bootOfferTotalInEUR({ price: o.price, shipping: o.shipping ?? 0, currency: o.currency as BootCurrencyCode })));

export function gearRelated(section: GearSection, item: GearLike, all: readonly GearLike[], locale: HubLocale): Related {
  const others = all.filter((x) => x.id !== item.id && x.offers.length > 0);
  const price = eur(item);
  const near = (list: GearLike[]) => list.sort((a, b) => Math.abs(eur(a) - price) - Math.abs(eur(b) - price));
  const brand = slugify(item.brand);
  const link = (x: GearLike): LinkItem => ({ href: `/${locale}/${section}/${x.id}`, label: gearName(section, x, locale) });
  const groups: Related["groups"] = [];
  const used = new Set<string>();
  const take = (list: GearLike[], n: number) => {
    const out = list.filter((x) => !used.has(x.id)).slice(0, n);
    out.forEach((x) => used.add(x.id));
    return out.map(link);
  };
  if (section === "botas") {
    const line = lineKey(item);
    groups.push({ title: T[locale].sameLine, links: take(near(others.filter((x) => slugify(x.brand) === brand && lineKey(x) === line)), 8) });
    const sameGround = near(others.filter((x) => slugify(x.brand) === brand && x.groundType === item.groundType));
    groups.push({ title: T[locale].moreOf(item.groundType ? groundHeadline(item.groundType, locale, brandLabel(item.brand)) : brandHeadline(section, brandLabel(item.brand), locale)), links: take(sameGround, 8) });
  } else {
    const sameType = near(others.filter((x) => slugify(x.brand) === brand && x.type === item.type));
    groups.push({ title: T[locale].moreOf(brandHeadline(section, brandLabel(item.brand), locale)), links: take(sameType.length ? sameType : near(others.filter((x) => slugify(x.brand) === brand)), 8) });
    if (item.type) groups.push({ title: T[locale].seeAlso, links: take(near(others.filter((x) => x.type === item.type)), 8) });
  }
  const hubs: LinkItem[] = [];
  const b = brandHub(section, item.brand);
  if (b) hubs.push({ href: `/${locale}/${section}/marca/${b.slug}`, label: brandHeadline(section, brandLabel(b.name), locale) });
  if (section === "botas") {
    for (const l of bootLineHubs(item)) hubs.push({ href: `/${locale}/botas/linea/${l.slug}`, label: brandHeadline("botas", l.name, locale) });
    const sp = bootSpecialHub(item, locale);
    if (sp) hubs.push({ href: `/${locale}${sp.path}`, label: sp.label });
  }
  const g = item.groundType;
  if (section === "botas" && g) {
    if (b && brandGroundCombos().some((c) => c.brandSlug === b.slug && c.ground === g))
      hubs.push({ href: `/${locale}/botas/marca/${b.slug}/${groundSlug(g)}`, label: groundHeadline(g, locale, brandLabel(b.name)) });
    if (groundFacets().some((f) => f.name === g)) hubs.push({ href: `/${locale}/botas/terreno/${groundSlug(g)}`, label: groundHeadline(g, locale) });
  }
  if ((section === "ropa" || section === "entrenamiento") && item.type && typeFacets(section).some((t) => t.slug === item.type)) {
    const names = translations[locale][section].types as Record<string, string>;
    hubs.push({ href: `/${locale}/${section}/tipo/${item.type}`, label: names[item.type] ?? item.type });
  }
  hubs.push({ href: `/${locale}/${section}`, label: sectionNoun(section, locale) });
  return { groups, hubs };
}

// ---------------------------------------------------------------- entradas

const ticketComp = (t: TicketProduct) => ticketCompetitionFacets().find((c) => c.name === t.competition);

export function ticketTrail(t: TicketProduct, locale: HubLocale): Crumb[] {
  const c = ticketComp(t);
  return [
    { name: HUB[locale].home, path: "" },
    { name: T[locale].tickets, path: "/tickets" },
    ...(c ? [{ name: c.name, path: `/tickets/competicion/${c.slug}` }] : []),
    { name: ticketName(t, locale) },
  ];
}

function ticketHubs(t: TicketProduct, locale: HubLocale): LinkItem[] {
  const x = EXTRA[locale];
  const out: LinkItem[] = [];
  for (const n of ticketTeams(t.event)) {
    const f = ticketTeamFacets().find((f) => f.slug === ticketSlug(n));
    const k = teamKeyForTicketName(n);
    if (f) out.push({ href: `/${locale}/tickets/equipo/${f.slug}`, label: x.ticketsOf(k ? team(k, locale) : n) });
  }
  const c = ticketComp(t);
  if (c) out.push({ href: `/${locale}/tickets/competicion/${c.slug}`, label: x.ticketsOf(c.name) });
  return out;
}

const minEur = (t: TicketProduct) => Math.min(...t.offers.map((o) => ticketOfferTotalInEUR(o)));

export function ticketRelated(t: TicketProduct, locale: HubLocale): Related {
  const live = ticketProducts.filter((x) => x.id !== t.id && x.offers.length > 0);
  const byDate = (a: TicketProduct, b: TicketProduct) => a.date.localeCompare(b.date) || minEur(a) - minEur(b);
  const used = new Set<string>();
  const take = (list: TicketProduct[], n: number) => {
    const out = list.filter((x) => !used.has(x.id)).sort(byDate).slice(0, n);
    out.forEach((x) => used.add(x.id));
    return out.map((x) => ({ href: `/${locale}/tickets/${x.id}`, label: ticketName(x, locale) }));
  };
  const sides = t.event.split(/\s+vs\s+/i).map((s) => s.trim()).filter(Boolean);
  const groups: Related["groups"] = sides.map((side) => ({
    title: T[locale].teamMatches(side),
    links: take(live.filter((x) => x.event.split(/\s+vs\s+/i).some((s) => s.trim() === side)), 6),
  }));
  groups.push({ title: T[locale].competition(t.competition), links: take(live.filter((x) => x.competition === t.competition), 8) });
  return { groups, hubs: [...ticketHubs(t, locale), { href: `/${locale}/tickets`, label: T[locale].tickets }] };
}
