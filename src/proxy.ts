import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, isLocale, LOCALES } from "@/lib/i18n/locales";

// ÚNICA tarea del proxy: mandar a una URL con idioma a quien entra sin
// uno. Nada más.
//
// Antes también dejaba una cookie con el país geolocalizado, y por eso
// corría en CADA request. Desde Next 16 el proxy dejó de correr en el
// edge y corre como función de Node (ver
// node_modules/next/dist/docs/.../proxy.md: "Proxy defaults to the
// Node.js runtime", y el runtime no se puede configurar), así que eso
// era una invocación de función por visita -- incluidos los bots, que
// son casi todo el tráfico y nunca iban a leer esa cookie. Se veía
// directo en el panel: Fluid Active CPU 193% del límite e invocaciones
// 120%, con "Edge Middleware Invocations" en 0 (2026-09-24).
//
// El país lo resuelve ahora el cliente contra /api/geo, una sola vez por
// visitante (ver CountryContext.tsx). La elección explícita del usuario
// en el CountrySelector sigue mandando: se guarda en localStorage.
const LOCALE_COOKIE = "football-cult-locale";

// El matcher de abajo tiene que ser un literal (Next lo analiza en build,
// no puede interpolar), así que la lista de idiomas está escrita a mano
// ahí. Esto avisa en desarrollo si alguna vez deja de coincidir con
// LOCALES, que es el bug silencioso obvio: un idioma nuevo que nunca
// recibe su redirección.
const MATCHER_LOCALES = "es|en|pt|fr|it";
if (process.env.NODE_ENV !== "production" && MATCHER_LOCALES !== LOCALES.join("|")) {
  throw new Error(
    `proxy.ts: el matcher ("${MATCHER_LOCALES}") no coincide con LOCALES ("${LOCALES.join("|")}")`,
  );
}

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

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Solo rutas que NO empiezan por un idioma: esas son las únicas que
    // hay que redirigir. Todo lo demás (el sitemap, los enlaces internos,
    // lo que rastrea Googlebot) ya viene con /es, /en, /pt, /fr o /it y
    // se sirve sin ejecutar nada.
    //
    // El `(?:/|$)` detrás de los idiomas es el detalle que importa: sin
    // él, "/estudios" empieza por "es" y se saltearía la redirección.
    // Así, "/es" y "/es/..." quedan fuera pero "/estudios" entra.
    //
    // Se excluyen además, como antes: rutas de API, los feeds de Merchant
    // Center (URLs fijas sin idioma que Google ya tiene registradas), los
    // archivos de metadata, los assets de Next y cualquier archivo con
    // extensión (favicon.ico, icon.png...).
    "/((?!(?:es|en|pt|fr|it)(?:/|$)|api|feed.*\\.xml|robots\\.txt|sitemap\\.xml|_next/static|_next/image|.*\\..*).*)",
  ],
};
