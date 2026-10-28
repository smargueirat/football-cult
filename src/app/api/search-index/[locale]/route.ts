import { LOCALES } from "@/lib/i18n/locales";
import { asLocale } from "@/lib/hubPages";
import { searchIndex } from "@/lib/searchIndex";

// Índice del autocompletado de la home (ver src/lib/searchIndex.ts). Un JSON
// estático por idioma generado en el build; cualquier otro idioma da 404.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return Response.json(searchIndex(asLocale(locale)));
}
