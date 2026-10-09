import { LOCALES } from "@/lib/i18n/locales";
import { priceStudy, type StudyExample } from "@/lib/priceStudy";
import { teamNames, typeNames } from "@/lib/productMeta";
import { asLocale } from "@/lib/hubPages";
import type { HubLocale } from "@/data/teamMeta";

// La tabla completa del estudio, descargable.
//
// Es lo primero que pide quien quiere citar un dato: sin la tabla, el
// número no es verificable y no lo publica nadie. Se agregó el 2026-09-27,
// cuando el estudio pasó a ser la pieza con la que se toca la puerta de
// los medios -- el correo a Footy Headlines ofrece justamente esto.
//
// force-static + generateStaticParams => 5 archivos generados en build,
// cero invocaciones de función al servirlos (mismo criterio que
// tarjeta.png, al lado).
export const dynamic = "force-static";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const HEAD: Record<HubLocale, string[]> = {
  es: ["equipo", "temporada", "tipo", "publico", "version", "precio_mas_bajo_eur", "tienda_mas_barata", "precio_mas_alto_eur", "tienda_mas_cara", "diferencia_eur", "diferencia_pct", "ficha"],
  en: ["team", "season", "kit", "audience", "version", "lowest_price_eur", "cheapest_store", "highest_price_eur", "dearest_store", "gap_eur", "gap_pct", "page"],
  pt: ["time", "temporada", "tipo", "publico", "versao", "preco_mais_baixo_eur", "loja_mais_barata", "preco_mais_alto_eur", "loja_mais_cara", "diferenca_eur", "diferenca_pct", "pagina"],
  fr: ["equipe", "saison", "type", "public", "version", "prix_le_plus_bas_eur", "boutique_moins_chere", "prix_le_plus_haut_eur", "boutique_plus_chere", "ecart_eur", "ecart_pct", "page"],
  it: ["squadra", "stagione", "tipo", "pubblico", "versione", "prezzo_piu_basso_eur", "negozio_piu_economico", "prezzo_piu_alto_eur", "negozio_piu_caro", "differenza_eur", "differenza_pct", "pagina"],
};

// Público y versión: sin ellos, la de niño y la de adulto (o la de jugador y
// la de aficionado) del mismo equipo parecen dos precios de la misma camiseta.
const AUDIENCE: Record<HubLocale, Record<StudyExample["audience"], string>> = {
  es: { adult: "adulto", kids: "niño", women: "mujer" },
  en: { adult: "adult", kids: "kids", women: "women" },
  pt: { adult: "adulto", kids: "infantil", women: "feminina" },
  fr: { adult: "adulte", kids: "enfant", women: "femme" },
  it: { adult: "adulto", kids: "bambino", women: "donna" },
};
const VERSION: Record<HubLocale, Record<StudyExample["version"], string>> = {
  es: { player: "jugador", fan: "aficionado" },
  en: { player: "player", fan: "fan" },
  pt: { player: "jogador", fan: "torcedor" },
  fr: { player: "joueur", fan: "supporter" },
  it: { player: "giocatore", fan: "tifoso" },
};

// Comillas dobles duplicadas, que es como se escapa en CSV (RFC 4180).
function cell(v: string | number): string {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  const study = priceStudy();

  const lines = [HEAD[locale].join(",")];
  for (const r of study.rows) {
    lines.push(
      [
        teamNames[r.teamKey as keyof typeof teamNames]?.[locale] ?? r.teamKey,
        r.season,
        typeNames[r.typeKey as keyof typeof typeNames]?.[locale] ?? r.typeKey,
        AUDIENCE[locale][r.audience],
        VERSION[locale][r.version],
        r.low.toFixed(2),
        r.lowStore,
        r.high.toFixed(2),
        r.highStore,
        r.gapAbs.toFixed(2),
        r.gapPct.toFixed(1),
        `https://football-cult.com/${locale}/camiseta/${r.id}`,
      ]
        .map(cell)
        .join(",")
    );
  }

  return new Response("﻿" + lines.join("\n") + "\n", {
    headers: {
      // El BOM de arriba es para que Excel abra los acentos bien: sin él,
      // "Atlético" se ve roto y el dato deja de parecer serio.
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="football-cult-precios-camisetas.csv"`,
    },
  });
}
