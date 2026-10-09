import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { bootProducts } from "@/data/boots";
import bootAliases from "@/data/bootAliases.json";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { GearDetailFrame, gearDetailMetadata } from "@/components/GearDetailSeo";
import { brandFacets, brandGroundCombos, byBrand, byBrandGround, byGround, cheapestFirst, groundFacets } from "@/lib/gearHubs";
import BootDetailClient from "./BootDetailClient";
import { archiveStatsFor } from "@/lib/priceArchive";

function findBoot(id: string) {
  return bootProducts.find((p) => p.id === id);
}

// ISR (2026-09-20): sin generateStaticParams estas páginas eran ƒ
// (cache-control no-store): cada visita de un usuario o de Googlebot
// ejecutaba una función que carga el catálogo entero -- la causa más
// probable de que la cuenta Hobby llegara al 100% de Fluid Active CPU.
// Con esto no se prerenderiza nada (no suma storage al deploy), pero la
// primera visita a cada URL queda cacheada en el CDN por un día.
export const revalidate = 86400;

// Pre-generación parcial (2026-09-22, pedido explícito "si no afecta el
// rendimiento"). No hay señal real de popularidad guardada en el repo
// (sin Vercel Analytics ni log de click_offer persistido), así que el
// proxy usado es: qué botas están efectivamente linkeadas desde los hubs
// estáticos de marca/terreno (marca/[brand], terreno/[ground],
// marca/[brand]/[ground]) -- esas rutas están, según los logs de runtime
// que motivaron este cambio, entre las de más tráfico del sitio junto
// con esta. GearHub (src/components/hubs/GearHub.tsx) linkea las
// primeras 60 más baratas (cheapestFirst) de cada hub; acá se toman solo
// las primeras 20 de cada uno -- suficiente para ser "la parte de arriba
// de la parte de arriba" (lo primero que un click real o un crawler
// encuentra en cada hub) sin acercarse al límite de build de Vercel
// Hobby. Medido en este repo con `npm run build` (2026-09-22): sin esto,
// 53.8s de build / 162 páginas estáticas. Con tope 60 por hub: ~1677
// botas (8385 páginas x5 locales), 87.9s (+34s). Con el tope 20 de
// abajo: 734 botas (3670 páginas x5 locales), 74.6s (+21s) -- el elegido,
// bien dentro de "unos minutos" y lejos de los límites de Build Minutes
// de Vercel Hobby. El resto del catálogo (miles de botas) sigue
// generándose on-demand con el ISR de arriba, sin cambios.
export function generateStaticParams() {
  const ids = new Set<string>();
  const take = (items: ReturnType<typeof byBrand>) => cheapestFirst(items).slice(0, 20).forEach((i) => ids.add(i.id));
  for (const b of brandFacets("botas")) take(byBrand("botas", b.slug));
  for (const g of groundFacets()) take(byGround(g.name));
  for (const c of brandGroundCombos()) take(byBrandGround(c.brandSlug, c.ground));
  return [...ids].map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, id } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const boot = findBoot(id);
  if (!boot) return {};
  return gearDetailMetadata("botas", boot, locale);
}

export default async function BootDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const boot = findBoot(id);
  if (!boot?.offers.length) {
    // Ficha fundida con otra (misma bota en otra tienda, ver merge_by_code en
    // scripts/boots-mining/refresh_boots.py): su URL vieja redirige a la que
    // la absorbió en vez de dar 404.
    const target = (bootAliases as Record<string, string>)[id];
    if (target?.startsWith("/")) permanentRedirect(`/${locale}${target}`);
    if (target && findBoot(target)) permanentRedirect(`/${locale}/botas/${target}`);
    notFound();
  }

  return (
    <GearDetailFrame section="botas" item={boot} all={bootProducts} locale={isLocale(locale) ? locale : DEFAULT_LOCALE}>
      <BootDetailClient boot={boot} archiveStats={archiveStatsFor(boot.offers.map((o) => o.url))} />
    </GearDetailFrame>
  );
}
