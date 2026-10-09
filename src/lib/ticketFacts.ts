import { ticketProducts } from "@/data/tickets";
import type { HubLocale } from "@/data/teamMeta";
import { ticketHasRealComparison, ticketSellers } from "@/lib/offerMoney";
import { longDate } from "@/lib/dealsStrings";
import type { QA } from "@/lib/siteFacts";

// No groupThousands (trustStrip.ts importa los siete catálogos): esta página
// solo carga el de entradas.
const groupThousands = (n: number, locale: HubLocale) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, locale === "en" ? "," : ".");

// Preguntas de /tickets con cifras del catálogo de hoy (2026-10-09): refuerza
// "comparateur billets foot" (posición 2,2) con texto citable. SOLO servidor.

type F = { n: string; comps: number; sellers: string; s: number; two: string; from: string; to: string };

const TEXT: Record<HubLocale, { h2: string; qa: (f: F) => QA[] }> = {
  es: {
    h2: "Comparador de entradas de fútbol: las cifras",
    qa: (f) => [
      { q: "¿Qué entradas compara Football Cult?", a: `${f.n} partidos de ${f.comps} competiciones entre el ${f.from} y el ${f.to}, con precios de ${f.s} vendedores (${f.sellers}).` },
      { q: "¿Cuántos partidos se pueden comparar de verdad?", a: `${f.two} partidos tienen precio en dos vendedores distintos a la vez; en el resto solo hay uno.` },
      { q: "¿Son entradas oficiales?", a: "No: son vendedores del mercado de reventa. El precio lo fija el vendedor, puede superar el precio oficial del club y cambia a menudo. Lee sus condiciones (garantía, entrega y si la entrada va a tu nombre) antes de comprar." },
    ],
  },
  en: {
    h2: "Football ticket price comparison: the numbers",
    qa: (f) => [
      { q: "Which tickets does Football Cult compare?", a: `${f.n} matches from ${f.comps} competitions between ${f.from} and ${f.to}, with prices from ${f.s} sellers (${f.sellers}).` },
      { q: "How many matches can really be compared?", a: `${f.two} matches have a price from two different sellers at once; the rest have only one.` },
      { q: "Are these official tickets?", a: "No: these are resale marketplace sellers. The seller sets the price, which can be above the club's face value and changes often. Read their terms (guarantee, delivery and whether the ticket is in your name) before buying." },
    ],
  },
  pt: {
    h2: "Comparador de ingressos de futebol: os números",
    qa: (f) => [
      { q: "Que ingressos o Football Cult compara?", a: `${f.n} jogos de ${f.comps} competições entre ${f.from} e ${f.to}, com preços de ${f.s} vendedores (${f.sellers}).` },
      { q: "Quantos jogos se podem comparar de verdade?", a: `${f.two} jogos têm preço em dois vendedores diferentes ao mesmo tempo; nos restantes há só um.` },
      { q: "São ingressos oficiais?", a: "Não: são vendedores do mercado de revenda. O preço é definido pelo vendedor, pode ficar acima do preço oficial do clube e muda com frequência. Lê as condições (garantia, entrega e se o ingresso fica no teu nome) antes de comprar." },
    ],
  },
  fr: {
    h2: "Comparateur de billets de foot : les chiffres",
    qa: (f) => [
      { q: "Quels billets Football Cult compare-t-il ?", a: `${f.n} matchs de ${f.comps} compétitions entre le ${f.from} et le ${f.to}, avec les prix de ${f.s} vendeurs (${f.sellers}).` },
      { q: "Combien de matchs peut-on vraiment comparer ?", a: `${f.two} matchs ont un prix chez deux vendeurs différents à la fois ; pour les autres il n'y en a qu'un.` },
      { q: "S'agit-il de billets officiels ?", a: "Non : ce sont des vendeurs du marché de la revente. Le prix est fixé par le vendeur, peut dépasser le prix officiel du club et change souvent. Lisez leurs conditions (garantie, livraison, billet à votre nom ou non) avant d'acheter." },
    ],
  },
  it: {
    h2: "Comparatore di biglietti di calcio: i numeri",
    qa: (f) => [
      { q: "Quali biglietti confronta Football Cult?", a: `${f.n} partite di ${f.comps} competizioni tra il ${f.from} e il ${f.to}, con i prezzi di ${f.s} rivenditori (${f.sellers}).` },
      { q: "Quante partite si possono confrontare davvero?", a: `${f.two} partite hanno un prezzo presso due rivenditori diversi insieme; per le altre ce n'è uno solo.` },
      { q: "Sono biglietti ufficiali?", a: "No: sono rivenditori del mercato secondario. Il prezzo lo decide il rivenditore, può superare il prezzo ufficiale del club e cambia spesso. Leggi le loro condizioni (garanzia, consegna e se il biglietto è nominativo) prima di comprare." },
    ],
  },
};

export function ticketFaq(locale: HubLocale): { h2: string; qa: QA[] } | null {
  const live = ticketProducts.filter((t) => t.offers.some((o) => o.price > 0));
  if (!live.length) return null;
  const sellers = ticketSellers(live.flatMap((t) => t.offers));
  const dates = live.map((t) => t.date).sort();
  return {
    h2: TEXT[locale].h2,
    qa: TEXT[locale].qa({
      n: groupThousands(live.length, locale),
      comps: new Set(live.map((t) => t.competition)).size,
      sellers: sellers.join(", "),
      s: sellers.length,
      two: groupThousands(live.filter((t) => ticketHasRealComparison(t.offers)).length, locale),
      from: longDate(dates[0], locale),
      to: longDate(dates[dates.length - 1], locale),
    }),
  };
}
