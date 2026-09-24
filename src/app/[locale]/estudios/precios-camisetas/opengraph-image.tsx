import { ImageResponse } from "next/og";
import { LANDSCAPE, studyCard, studyFonts } from "@/lib/studyCard";
import { asLocale } from "@/lib/hubPages";
import { LOCALES } from "@/lib/i18n/locales";

// La página no tenía og:image: compartirla en WhatsApp, X o LinkedIn
// mostraba solo texto. Se genera en build (no usa APIs de request), así
// que son 5 archivos estáticos y no cuesta ninguna función -- que es la
// diferencia con la og:image de camiseta/[id], donde hay miles de URLs.
export const alt = "Football Cult";
export const size = LANDSCAPE;
export const contentType = "image/png";

// Sin esto la ruta sale ƒ (dinámica) y cada scraper de red social paga
// una función + el render de satori, que es CPU cara. Con los 5 idiomas
// declarados se prerenderiza en build y se sirve como archivo.
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = asLocale(raw);
  const { title, body } = await studyFonts();
  return new ImageResponse(studyCard(locale, false), {
    ...size,
    fonts: [
      { name: "Alfa", data: title, style: "normal" },
      { name: "Cormorant", data: body, style: "normal" },
    ],
  });
}
