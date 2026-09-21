import Link from "next/link";
import type { HubLocale } from "@/data/teamMeta";
import { translations } from "@/lib/i18n/translations";
import { UI, groundName } from "@/lib/gearHubStrings";
import { brandFacets, groundFacets, typeFacets, type GearSection } from "@/lib/gearHubs";

// Bloque de enlaces rastreables al pie de las páginas de sección
// (botas / guantes / pelotas / ropa) hacia sus hubs por marca, terreno y tipo.
function Chips({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  if (!items.length) return null;
  return (
    <div className="mb-5">
      <h2 className="font-vintage mb-2 text-lg text-[#1B3B2B]">{title}</h2>
      <ul className="flex flex-wrap gap-2">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="inline-block rounded-full border border-[#C9A24B]/40 bg-[#fffdf8] px-3 py-1.5 text-sm text-[#1B3B2B] transition-colors hover:border-[#C9A24B] hover:bg-[#f6efdd]">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function GearHubLinks({ section, locale }: { section: GearSection; locale: HubLocale }) {
  const ui = UI[locale];
  return (
    <nav aria-label={ui.explore} className="mx-auto w-full max-w-[1800px] px-4 pb-10 sm:px-8">
      {section === "botas" && (
        <Chips title={ui.byGround} items={groundFacets().map((g) => ({ href: `/${locale}/botas/terreno/${g.slug}`, label: groundName(g.name, locale) }))} />
      )}
      {section === "ropa" && (
        <Chips
          title={ui.byType}
          items={typeFacets().map((t) => ({ href: `/${locale}/ropa/tipo/${t.slug}`, label: (translations[locale].ropa.types as Record<string, string>)[t.slug] ?? t.slug }))}
        />
      )}
      <Chips title={ui.byBrand} items={brandFacets(section).slice(0, 30).map((b) => ({ href: `/${locale}/${section}/marca/${b.slug}`, label: b.name }))} />
    </nav>
  );
}
