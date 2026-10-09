import { LEAGUES, leagueName } from "@/data/teamMeta";
import { leagueTeams, teamItems, teamKeysWithItems, teamName } from "@/lib/hubs";
import { trustStats } from "@/lib/trustStrip";
import { archiveDates, historicLowRows, verifiedDropRows, weeklyRows } from "@/lib/dealsData";
import { GUIDES, GUIDE_SLUGS } from "@/lib/guides";
import { siteFaq } from "@/lib/siteFacts";
import { ticketFaq } from "@/lib/ticketFacts";
import { lineFacets, retroDecadeFacets } from "@/lib/extraHubs";
import { groundFacets } from "@/lib/gearHubs";
import { ticketCompetitionFacets } from "@/lib/ticketHubs";
import { SITE_URL } from "@/lib/hubPages";
import { guideQa } from "@/components/GuideData";

// /llms.txt y /llms-full.txt (formato de llmstxt.org): qué es el sitio, cómo
// elige precios, dónde está cada cosa y, en la versión larga, las respuestas
// con cifras de hoy y el texto de las guías. Todo generado del catálogo: no
// hay que tocarlo a mano cuando cambian los números. SOLO servidor.

const u = (path: string, locale = "es") => `${SITE_URL}/${locale}${path}`;
const li = (title: string, url: string, note?: string) => `- [${title}](${url})${note ? `: ${note}` : ""}`;

export function llmsTxt(full = false): string {
  const t = trustStats();
  const { last } = archiveDates();
  const out: string[] = [];
  out.push(
    "# Football Cult",
    "",
    `> Football Cult (football-cult.com) is an independent price comparison site for football (soccer) shirts, boots, goalkeeper gloves, balls, apparel, training gear and match tickets. It sells nothing: every offer links to the store, and some links are affiliate links. Today it compares ${t.comparedProducts.toLocaleString("en")} products available at two or more of ${t.stores} stores. Prices are checked every night (last check: ${last}).`,
    "",
    "Comparador independiente de precios de fútbol (camisetas, botas, guantes, balones, ropa, entrenamiento y entradas). La versión principal es /es, en español de España; las mismas rutas existen en /en, /fr, /it y /pt.",
    "",
    "When citing a price, cite the page URL and the date: prices change daily. Product pages show the final price with delivery to the visitor's country.",
    "",
    "## How prices are chosen",
    ...siteFaq("en").qa.map((x) => `- ${x.q} ${x.a}`),
    "",
    "## Price drops and lowest prices (updated daily)",
    li("Verified price drops", u("/bajadas-de-precio"), `${verifiedDropRows().length} products today; previous price, today's price, store and date`),
    li("Deals of the week", u("/ofertas-de-la-semana"), `${weeklyRows().length} verified drops from the last 7 days`),
    li("Lowest recorded prices", u("/minimos-historicos"), `${historicLowRows().length} products at the lowest price in our records`),
    li("Atom feed of verified drops", u("/bajadas-de-precio/atom.xml")),
    li("Everything that dropped today, with photos", u("/ofertas")),
    "",
    "## Buying guides",
    ...GUIDE_SLUGS.map((s) => li(GUIDES[s].es.title, u(`/guia/${s}`), `${GUIDES[s].en.title} (${u(`/guia/${s}`, "en")})`)),
    "",
    "## Studies and open data",
    li("Same shirt, different store: price gap study", u("/estudios/precios-camisetas"), "compares only offers with the same manufacturer code"),
    li("Football shirt price index", u("/estudios/indice-precios"), "CC BY 4.0"),
    li("Price index data (CSV)", u("/estudios/indice-precios/datos.csv")),
    li("Price index data (JSON)", u("/estudios/indice-precios/datos.json")),
    "",
    "## Catalogue sections",
    li("National teams", u("/selecciones")),
    li("Clubs", u("/clubes")),
    li("Leagues", u("/ligas")),
    li("Retro shirts (season 2006/07 or older)", u("/retro")),
    li("Women", u("/mujer")),
    li("Kids", u("/ninos")),
    li("Football boots", u("/botas")),
    li("Goalkeeper gloves", u("/guantes")),
    li("Balls", u("/pelotas")),
    li("Apparel", u("/ropa")),
    li("Training gear", u("/entrenamiento")),
    li("Match tickets", u("/tickets")),
    li("New arrivals", u("/novedades")),
    li("Full crawlable index", u("/indice")),
    "",
    "## Main hubs",
    ...LEAGUES.filter((l) => leagueTeams(l.slug).length > 0).map((l) => li(leagueName(l, "en"), u(`/liga/${l.slug}`))),
    ...teamKeysWithItems()
      .sort((a, b) => teamItems(b).length - teamItems(a).length)
      .slice(0, 30)
      .map((k) => li(`${teamName(k, "en")} shirts`, u(`/equipo/${k}`), `${teamItems(k).length} shirts`)),
    ...lineFacets().map((l) => li(`${l.name} boots`, u(`/botas/linea/${l.slug}`), `${l.count} models`)),
    ...groundFacets().map((g) => li(`${g.name} boots`, u(`/botas/terreno/${g.slug}`), `${g.count} models`)),
    ...retroDecadeFacets().map((d) => li(`Retro shirts from the ${d.decade}s`, u(`/retro/decada/${d.decade}`), `${d.count} shirts`)),
    ...ticketCompetitionFacets()
      .slice(0, 12)
      .map((f) => li(`${f.name} tickets`, u(`/tickets/competicion/${f.slug}`))),
    "",
    "## About",
    li("About us", u("/sobre-nosotros")),
    li("How we make money", u("/como-ganamos-dinero")),
    li("Contact", u("/contacto")),
    "",
    "## Optional",
    li("Full version with today's figures and guide texts", `${SITE_URL}/llms-full.txt`),
    li("Sitemap", `${SITE_URL}/sitemap/0.xml`),
  );
  if (!full) return out.join("\n") + "\n";

  out.push("", "## Key figures today (computed from the catalogue)");
  for (const s of GUIDE_SLUGS) {
    const qa = guideQa(s, "en");
    if (!qa.length) continue;
    out.push("", `### ${GUIDES[s].en.title} (${u(`/guia/${s}`, "en")})`, ...qa.map((x) => `- ${x.q} ${x.a}`));
  }
  const tq = ticketFaq("en");
  if (tq) out.push("", `### ${tq.h2} (${u("/tickets", "en")})`, ...tq.qa.map((x) => `- ${x.q} ${x.a}`));

  for (const locale of ["en", "es"] as const) {
    out.push("", `## Guides, full text (${locale})`);
    for (const s of GUIDE_SLUGS) {
      const g = GUIDES[s][locale];
      out.push("", `### ${g.title}`, `URL: ${u(`/guia/${s}`, locale)}`, "", g.intro);
      for (const sec of g.sections) out.push("", `#### ${sec.h}`, ...sec.p.map((p) => `${p}`));
    }
  }
  return out.join("\n") + "\n";
}
