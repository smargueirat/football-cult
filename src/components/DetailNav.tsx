import Link from "next/link";
import type { HubLocale } from "@/data/teamMeta";
import { breadcrumbLd } from "@/lib/hubPages";
import { Crumbs, JsonLd } from "@/components/hubs/HubParts";
import type { Crumb, Related } from "@/lib/detailLinks";

// Piezas de servidor de las fichas: migas visibles + BreadcrumbList y el
// bloque de enlaces relacionados. HTML con <a> reales (ver detailLinks.ts).

export function DetailCrumbs({ locale, trail, current }: { locale: HubLocale; trail: Crumb[]; current: string }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-3 pt-4 sm:px-6">
      <JsonLd data={breadcrumbLd(locale, trail, current)} />
      <Crumbs
        locale={locale}
        trail={trail.slice(1).map((c) => ({ label: c.name, href: c.path !== undefined ? `/${locale}${c.path}` : undefined }))}
      />
    </div>
  );
}

export function RelatedLinks({ related }: { related: Related }) {
  const groups = related.groups.filter((g) => g.links.length > 0);
  if (!groups.length && !related.hubs.length) return null;
  return (
    <nav className="mx-auto w-full max-w-6xl px-3 pb-10 sm:px-6">
      {groups.map((g) => (
        <section key={g.title} className="mb-6">
          <h2 className="font-vintage mb-3 text-lg text-[#1B3B2B]">{g.title}</h2>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
            {g.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[#1B3B2B] underline decoration-[#C9A24B]/50 underline-offset-2 hover:decoration-[#C9A24B]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {related.hubs.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {related.hubs.map((h) => (
            <li key={h.href}>
              <Link
                href={h.href}
                className="inline-block rounded-full border border-[#C9A24B]/40 bg-[#fffdf8] px-3 py-1.5 text-sm text-[#1B3B2B] transition-colors hover:border-[#C9A24B] hover:bg-[#f6efdd]"
              >
                {h.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
