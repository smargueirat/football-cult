// Publicidad de afiliado de DAZN (Awin). Un programa por país: los links
// solo valen para suscriptores de ese país, por eso se muestran únicamente
// a visitantes detectados allí (ver DaznLayout.tsx) y solo en las páginas
// de las ligas que DAZN tiene ahí. Configuración escrita a mano (no la
// genera ningún script).
//
// CADUCIDAD: todo lo que puede vencer lleva fecha (último día válido,
// AAAA-MM-DD) y se oculta solo al pasar (isLive):
//   - cada liga, la fecha en que termina el derecho que conocemos (si no se
//     renueva, la tarjeta desaparece de esa liga en vez de prometer algo
//     que DAZN ya no emite);
//   - cada banner, la fecha de la promo que lleva pintada (el de Francia
//     decía "Jusqu'au 29 septembre" y se siguió sirviendo en octubre).
// Sin banner vigente se muestra la tarjeta de texto, que no lleva precio
// ni fecha.
//
// Programas (memoria project_awin_payments_sept2026.md) y derechos
// comprobados el 2026-10-09:
//   ES 126263: plan de fútbol con LaLiga, Premier, Bundesliga, Serie A y
//     Ligue 1 (lo que DAZN España informa a sus afiliados).
//   FR 126261: Ligue 1+ y Serie A (dazn.com/fr-FR; Serie A renovada en
//     Francia hasta 2028-29).
//   GB 126251 / IE 126269: Serie A, renovada para 2026-27 (advanced-
//     television.com, 2026-08-20).
//   CA 126237: Bundesliga y 2. Bundesliga hasta 2027-28 (sportcal, 2025-08-22).
//   JP 126245: J.League (contrato de DAZN hasta 2033).
// El enlace de texto es el deeplink estándar de Awin (cread.php?awinmid&
// awinaffid&ued); probado con curl para los seis: 302 a DAZN con `awc`.
// No hace falta generarlo en el panel.
//
// Códigos de Awin: publisher 3013769; cread.php = click, cshow.php = imagen.
export const AWIN_PUBLISHER = 3013769;

export interface DaznBanner {
  id: number;
  w: number;
  h: number;
  /** Último día de la promo que lleva la imagen (AAAA-MM-DD). */
  expires: string;
}

export interface DaznProgramme {
  mid: number;
  /** Liga (slug de LEAGUES) -> último día del derecho que conocemos. */
  leagues: Record<string, string>;
  /** Landing para el link de texto (deeplink vía cread.php?awinmid&ued). */
  landing: string;
  /** q= del código de creatividad de Awin (necesario para banners). */
  q?: number;
  banners: DaznBanner[];
}

const SEASON_2026_27 = "2027-06-30";

export const DAZN_BY_COUNTRY: Record<string, DaznProgramme> = {
  ES: {
    mid: 126263,
    leagues: {
      laliga: SEASON_2026_27,
      "premier-league": SEASON_2026_27,
      "serie-a": SEASON_2026_27,
      bundesliga: SEASON_2026_27,
      "ligue-1": SEASON_2026_27,
    },
    landing: "https://www.dazn.com/es-ES/welcome",
    banners: [],
  },
  FR: {
    mid: 126261,
    leagues: { "ligue-1": SEASON_2026_27, "serie-a": "2029-06-30" },
    landing: "https://www.dazn.com/fr-FR/welcome",
    q: 611754,
    banners: [
      // "DAZN - Ligue 1", promo "Jusqu'au 29 septembre" pintada en la imagen.
      { id: 4857837, w: 300, h: 600, expires: "2026-09-29" },
      { id: 4857836, w: 300, h: 250, expires: "2026-09-29" },
    ],
  },
  GB: {
    mid: 126251,
    leagues: { "serie-a": SEASON_2026_27 },
    landing: "https://www.dazn.com/en-GB/welcome",
    banners: [],
  },
  IE: {
    mid: 126269,
    leagues: { "serie-a": SEASON_2026_27 },
    landing: "https://www.dazn.com/en-IE/welcome",
    banners: [],
  },
  CA: {
    mid: 126237,
    leagues: { bundesliga: "2028-06-30", "2-bundesliga": "2028-06-30" },
    landing: "https://www.dazn.com/en-CA/welcome",
    banners: [],
  },
  JP: {
    mid: 126245,
    leagues: { "j-league": "2033-12-31" },
    landing: "https://www.dazn.com/ja-JP/welcome",
    banners: [],
  },
};

/** ¿Sigue vigente algo que vence el día `until` (inclusive)? */
export function isLive(until: string, today = new Date().toISOString().slice(0, 10)): boolean {
  return today <= until;
}

/** Programa para un país y una liga, con solo los banners vigentes; null si no toca. */
export function daznFor(country: string, league: string, today?: string): DaznProgramme | null {
  const p = DAZN_BY_COUNTRY[country];
  const until = p?.leagues[league];
  if (!p || !until || !isLive(until, today)) return null;
  return { ...p, banners: p.banners.filter((b) => isLive(b.expires, today)) };
}

export function creativeHref(p: DaznProgramme, b: DaznBanner): string {
  return `https://www.awin1.com/cread.php?s=${b.id}&v=${p.mid}&q=${p.q}&r=${AWIN_PUBLISHER}`;
}
export function creativeImg(p: DaznProgramme, b: DaznBanner): string {
  return `https://www.awin1.com/cshow.php?s=${b.id}&v=${p.mid}&q=${p.q}&r=${AWIN_PUBLISHER}`;
}
export function landingHref(p: DaznProgramme): string {
  return `https://www.awin1.com/cread.php?awinmid=${p.mid}&awinaffid=${AWIN_PUBLISHER}&ued=${encodeURIComponent(p.landing)}`;
}
