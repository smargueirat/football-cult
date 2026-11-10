import type { HubLocale } from "@/data/teamMeta";
import { shortDate } from "@/lib/newStrings";

// Calendario de las páginas estacionales (/black-friday, /regalos-futbol) y
// del aviso que las anuncia en la home y en los hubs. Sin datos del catálogo:
// lo importa un componente de cliente.
//
// Las fechas se CALCULAN para cada año (Black Friday = viernes después del
// cuarto jueves de noviembre; Cyber Monday = el lunes siguiente; Navidad y
// Reyes son fijas), así que nada caduca a mano el año que viene. El aviso
// se ve desde 4 semanas antes del primer día del evento hasta 1 día después
// del último, igual que los banners de DAZN (isLive en daznAds.ts): fecha
// ISO comparada como texto, día final incluido.

export type SeasonalId = "black-friday" | "regalos";

export interface SeasonalEvent {
  id: SeasonalId;
  path: "/black-friday" | "/regalos-futbol";
  /** Primer y último día del evento (ISO). */
  start: string;
  end: string;
  year: number;
}

const iso = (y: number, m: number, d: number) => new Date(Date.UTC(y, m - 1, d)).toISOString().slice(0, 10);
const addDays = (isoDate: string, n: number) => new Date(Date.parse(isoDate + "T00:00:00Z") + n * 86_400_000).toISOString().slice(0, 10);

export function blackFriday(year: number): { bf: string; cm: string } {
  const nov1 = new Date(Date.UTC(year, 10, 1)).getUTCDay();
  const firstThu = 1 + ((4 - nov1 + 7) % 7);
  const bf = iso(year, 11, firstThu + 22);
  return { bf, cm: addDays(bf, 3) };
}

export function eventsOf(year: number): SeasonalEvent[] {
  const { bf, cm } = blackFriday(year);
  return [
    { id: "black-friday", path: "/black-friday", start: bf, end: cm, year },
    // Navidad (25-dic) y Reyes (6-ene del año siguiente) son una sola campaña.
    { id: "regalos", path: "/regalos-futbol", start: iso(year, 12, 25), end: iso(year + 1, 1, 6), year },
  ];
}

export const LEAD_DAYS = 28;
export const TAIL_DAYS = 1;

/** Eventos cuyo aviso está vigente `today` (ISO), por fecha de inicio. */
export function activeSeasonal(today: string): SeasonalEvent[] {
  const y = Number(today.slice(0, 4));
  return [...eventsOf(y - 1), ...eventsOf(y)]
    .filter((e) => today >= addDays(e.start, -LEAD_DAYS) && today <= addDays(e.end, TAIL_DAYS))
    .sort((a, b) => a.start.localeCompare(b.start));
}

/** Black Friday al que se refiere la página: el de este año hasta el día
 *  después del Cyber Monday; luego, el del año siguiente. */
export function currentBlackFriday(today: string): { year: number; bf: string; cm: string } {
  const y = Number(today.slice(0, 4));
  const now = blackFriday(y);
  return today <= addDays(now.cm, TAIL_DAYS) ? { year: y, ...now } : { year: y + 1, ...blackFriday(y + 1) };
}

/** Navidad/Reyes de la página de regalos: hasta el día después de Reyes. */
export function currentGiftSeason(today: string): { year: number; xmas: string; kings: string } {
  const y = Number(today.slice(0, 4));
  const year = today <= iso(y, 1, 6 + TAIL_DAYS) ? y - 1 : y;
  return { year, xmas: iso(year, 12, 25), kings: iso(year + 1, 1, 6) };
}

export const todayIso = () => new Date().toISOString().slice(0, 10);

const dm = shortDate;

/** Texto del aviso (home y hubs). */
export function bannerText(e: SeasonalEvent, l: HubLocale): string {
  if (e.id === "black-friday") {
    const span = `${dm(e.start, l)} – ${dm(e.end, l)}`;
    return {
      es: `Black Friday ${e.year} (${span}): bajadas reales verificadas en camisetas y botas`,
      en: `Black Friday ${e.year} (${span}): verified real price drops on shirts and boots`,
      pt: `Black Friday ${e.year} (${span}): baixas reais verificadas em camisas e chuteiras`,
      fr: `Black Friday ${e.year} (${span}) : vraies baisses vérifiées sur maillots et chaussures`,
      it: `Black Friday ${e.year} (${span}): ribassi reali verificati su maglie e scarpe`,
    }[l];
  }
  return {
    es: "Regalos de fútbol para Navidad y Reyes, por presupuesto y con precios reales",
    en: "Football gifts for Christmas, by budget and with real prices",
    pt: "Presentes de futebol para o Natal e Reis, por orçamento e com preços reais",
    fr: "Cadeaux foot pour Noël, par budget et avec de vrais prix",
    it: "Regali di calcio per Natale e la Befana, per budget e con prezzi reali",
  }[l];
}

type L5 = Record<HubLocale, string>;
const BF_TAG: L5 = { es: "Bajadas reales verificadas", en: "Verified real price drops", pt: "Baixas reais verificadas", fr: "Vraies baisses vérifiées", it: "Ribassi reali verificati" };
const BF_HEAD: L5 = {
  es: "Camisetas y botas al mejor precio, comprobado",
  en: "Shirts and boots at their best price, checked",
  pt: "Camisas e chuteiras ao melhor preço, comprovado",
  fr: "Maillots et chaussures au meilleur prix, vérifié",
  it: "Maglie e scarpe al miglior prezzo, verificato",
};
const BF_CTA: L5 = { es: "Ver las ofertas", en: "See the deals", pt: "Ver as ofertas", fr: "Voir les offres", it: "Vedi le offerte" };
const GIFT_TAG: L5 = { es: "Navidad y Reyes", en: "Christmas gifts", pt: "Natal e Reis", fr: "Noël", it: "Natale e Befana" };
const GIFT_CTA: L5 = { es: "Ver los regalos", en: "See the gifts", pt: "Ver os presentes", fr: "Voir les cadeaux", it: "Vedi i regali" };

/** Piezas del aviso grande: etiqueta, fechas, titular y botón. */
export function bannerParts(e: SeasonalEvent, l: HubLocale): { eyebrow: string; dates: string; headline: string; tag: string; cta: string } {
  if (e.id === "black-friday") {
    return { eyebrow: `Black Friday ${e.year}`, dates: `${dm(e.start, l)} – ${dm(e.end, l)}`, headline: BF_HEAD[l], tag: BF_TAG[l], cta: BF_CTA[l] };
  }
  return { eyebrow: GIFT_TAG[l], dates: `${dm(e.start, l)} – ${dm(e.end, l)}`, headline: bannerText(e, l), tag: "", cta: GIFT_CTA[l] };
}
