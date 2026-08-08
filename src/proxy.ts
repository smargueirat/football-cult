import { NextRequest, NextResponse } from "next/server";
import { countries } from "@/data/products";

// Deja una cookie con el país detectado por geolocalización de IP (header
// que Vercel agrega automáticamente en el borde de su red, no depende de
// esta versión de Next.js) para que CountryContext la use como país por
// defecto en la primera visita. Solo se escribe una vez -- una elección
// explícita del usuario en el CountrySelector se guarda aparte, en
// localStorage, y esa siempre tiene prioridad (ver CountryContext.tsx).
const GEO_COOKIE = "football-cult-geo-country";
const VALID_CODES = new Set<string>(countries.map((c) => c.code));

export function proxy(request: NextRequest) {
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
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
