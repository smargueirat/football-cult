import type { NextConfig } from "next";
import path from "node:path";

// CSP en modo Report-Only (2026-10-09): no bloquea nada, solo avisa en la
// consola del navegador de lo que bloquearía. Next mete scripts en línea
// (hidratación, JSON-LD), GA4 y Skimlinks se cargan tras el consentimiento y
// las fotos vienen de decenas de CDNs de tiendas: activarla a ciegas puede
// romper la medición o los enlaces de afiliado. Cuando la consola quede limpia
// unos días, se pasa a "Content-Security-Policy".
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.skimresources.com https://*.skimlinks.com",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.skimresources.com https://*.skimlinks.com",
  "img-src 'self' data: blob: https:",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self' https://accounts.google.com",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // 4 workers de build, no 15: cada uno carga el catálogo entero y con 15 la PC
  // (14 GB) se quedaba sin memoria y el build moría (2026-10-09).
  experimental: { cpus: 4 },
  // Las 404 no se guardan en la caché ISR (ver cache-handler.mjs).
  cacheHandler: path.resolve("cache-handler.mjs"),
  // www y sin-www servían las dos 200 sin redirigir entre sí (confirmado
  // 2026-09-02) -- Google podía indexar el mismo contenido en dos
  // dominios distintos. sitemap.ts/robots.ts/feed.xml/el JSON-LD de
  // producto ya usan el dominio sin www como fuente de verdad, así que
  // acá se redirige hacia ese mismo destino en vez de al revés.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.football-cult.com" }],
        destination: "https://football-cult.com/:path*",
        permanent: true,
      },
      // http -> https. El túnel le entrega todo al origen por http, así que
      // el único dato del esquema real es X-Forwarded-Proto, que pone
      // Cloudflare ("http" si el visitante entró sin TLS). Sin la cabecera
      // (curl local, el health check de deploy_local.sh) no se redirige:
      // así no hay bucle posible. Va acá y no en proxy.ts porque el proxy
      // solo corre en URLs sin idioma y esto tiene que cubrir todas.
      {
        source: "/:path*",
        has: [{ type: "header", key: "x-forwarded-proto", value: "http" }],
        destination: "https://football-cult.com/:path*",
        statusCode: 301,
      },
      // Guía renombrada a "talla" (español de España, 2026-10-09). El slug es
      // el mismo en los cinco idiomas, así que redirigen los cinco.
      {
        source: "/:locale(es|en|pt|fr|it)/guia/talle-fan-vs-jugador",
        destination: "/:locale/guia/talla-fan-vs-jugador",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy-Report-Only", value: CSP },
        ],
      },
    ];
  },
  // Todas las <Image> del sitio llevan `unoptimized` (y las fotos de
  // producto pasan por weserv, ver src/lib/images.ts), así que /_next/image
  // no servía a nadie y era un proxy abierto: con images.weserv.nl en
  // remotePatterns descargaba y procesaba con sharp cualquier imagen de
  // internet (informe 2026-10-08, hallazgo 18). Con esto responde 404.
  images: { unoptimized: true },
};

export default nextConfig;
