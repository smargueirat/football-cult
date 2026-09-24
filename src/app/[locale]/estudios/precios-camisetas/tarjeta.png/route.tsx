import { ImageResponse } from "next/og";
import { LOCALES } from "@/lib/i18n/locales";
import { PORTRAIT, studyCard, studyFonts } from "@/lib/studyCard";
import { asLocale } from "@/lib/hubPages";

// Versión vertical (1000x1500) de la misma tarjeta. Existe aparte de la
// og:image porque Pinterest solo acepta imágenes entre 2:3 y 1:1: una
// apaisada de 1200x630 la rechaza. Se muestra en la página, en el bloque
// de "cómo citar", para que el lector pueda guardarla y para que el
// lector de Pinterest la encuentre (busca <img> en el HTML, no og:image).
//
// force-static + generateStaticParams => 5 PNG generados en build, cero
// invocaciones de función al servirlas.
export const dynamic = "force-static";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  const { title, body } = await studyFonts();
  return new ImageResponse(studyCard(locale, true), {
    ...PORTRAIT,
    fonts: [
      { name: "Alfa", data: title, style: "normal" },
      { name: "Cormorant", data: body, style: "normal" },
    ],
  });
}
