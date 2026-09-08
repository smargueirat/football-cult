import { NextRequest, NextResponse } from "next/server";
import { countries } from "@/data/products";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/locales";

// Deja una cookie con el país detectado por geolocalización de IP (header
// que Vercel agrega automáticamente en el borde de su red, no depende de
// esta versión de Next.js) para que CountryContext la use como país por
// defecto en la primera visita. Solo se escribe una vez -- una elección
// explícita del usuario en el CountrySelector se guarda aparte, en
// localStorage, y esa siempre tiene prioridad (ver CountryContext.tsx).
const GEO_COOKIE = "football-cult-geo-country";
const VALID_CODES = new Set<string>(countries.map((c) => c.code));

const LOCALE_COOKIE = "football-cult-locale";

// Parsea "Accept-Language: fr-FR,fr;q=0.9,en;q=0.8" -> primer idioma
// soportado por orden de preferencia real del navegador. Sin librerías
// nuevas (negotiator/intl-localematcher) -- el formato es simple y solo
// nos importan 5 valores fijos.
function negotiateLocale(header: string | null): string | null {
  if (!header) return null;
  const langs = header
    .split(",")
    .map((part) => part.trim().split(";")[0].toLowerCase().split("-")[0])
    .filter(Boolean);
  for (const lang of langs) {
    if (isLocale(lang)) return lang;
  }
  return null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];

  // Toda URL de página real vive bajo /es, /en, /pt, /fr o /it -- una
  // visita sin locale en el path se manda ahí antes de renderizar nada,
  // así Google (y cualquier visitante) siempre ve una URL indexable por
  // idioma en vez de todo bajo una sola URL con el idioma decidido
  // después, client-side.
  if (!isLocale(firstSegment)) {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    const locale =
      (cookieLocale && isLocale(cookieLocale) && cookieLocale) ||
      negotiateLocale(request.headers.get("accept-language")) ||
      DEFAULT_LOCALE;

    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url, 308);
  }

  if (request.cookies.has(GEO_COOKIE)) {
    return NextResponse.next();
  }
  const geoCountry = request.headers.get("x-vercel-ip-country");
  if (!geoCountry || !VALID_CODES.has(geoCountry)) {
    return NextResponse.next();
  }
  const response = NextResponse.next();
  response.cookies.set(GEO_COOKIE, geoCountry, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return response;
}

export const config = {
  matcher: [
    // Todo excepto: rutas de API, los feeds de Merchant Center (URLs
    // fijas que Google ya tiene registradas, sin locale), los archivos
    // especiales de metadata, assets estáticos de Next y cualquier
    // archivo con extensión (favicon.ico, icon.png, etc).
    "/((?!api|feed.*\\.xml|robots\\.txt|sitemap\\.xml|_next/static|_next/image|.*\\..*).*)",
  ],
};
