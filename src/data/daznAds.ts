// Publicidad de afiliado de DAZN (Awin). Un programa por país: los links
// solo valen para suscriptores de ese país, por eso se muestran únicamente
// a visitantes detectados allí (ver DaznLayout.tsx) y solo en las páginas
// de las ligas que DAZN dice tener en ese país.
//
// España (126263): DAZN España informa a sus afiliados que su plan de
// fútbol incluye LaLiga, Premier League, Bundesliga, Serie A y Ligue 1.
// Los banners de Awin de España son de partido/evento puntual (jornada 5,
// baloncesto...) y vencen, así que ahí va una tarjeta de texto con el link
// de la página de bienvenida que DAZN da a los afiliados. Cuando DAZN
// publique un banner genérico de fútbol, agregarlo en `banners`.
//
// Francia (126261): banners "DAZN - Ligue 1" (creatividades 4857837 /
// 4857836 / 4898878, q=611754), solo en la página de la Ligue 1.
//
// Códigos de Awin: publisher 3013769; cread.php = click, cshow.php = imagen.
export const AWIN_PUBLISHER = 3013769;

export interface DaznBanner {
  id: number;
  w: number;
  h: number;
}

export interface DaznProgramme {
  mid: number;
  leagues: string[];
  /** Landing para el link de texto (deeplink vía cread.php?awinmid&ued). */
  landing?: string;
  /** q= del código de creatividad de Awin (necesario para banners). */
  q?: number;
  banners: DaznBanner[];
}

export const DAZN_BY_COUNTRY: Record<string, DaznProgramme> = {
  ES: {
    mid: 126263,
    leagues: ["laliga", "premier-league", "serie-a", "bundesliga", "ligue-1"],
    landing: "https://www.dazn.com/es-ES/welcome",
    banners: [],
  },
  FR: {
    mid: 126261,
    leagues: ["ligue-1"],
    q: 611754,
    banners: [
      { id: 4857837, w: 300, h: 600 },
      { id: 4857836, w: 300, h: 250 },
    ],
  },
};

export function creativeHref(p: DaznProgramme, b: DaznBanner): string {
  return `https://www.awin1.com/cread.php?s=${b.id}&v=${p.mid}&q=${p.q}&r=${AWIN_PUBLISHER}`;
}
export function creativeImg(p: DaznProgramme, b: DaznBanner): string {
  return `https://www.awin1.com/cshow.php?s=${b.id}&v=${p.mid}&q=${p.q}&r=${AWIN_PUBLISHER}`;
}
export function landingHref(p: DaznProgramme): string {
  return `https://www.awin1.com/cread.php?awinmid=${p.mid}&awinaffid=${AWIN_PUBLISHER}&ued=${encodeURIComponent(p.landing ?? "")}`;
}
