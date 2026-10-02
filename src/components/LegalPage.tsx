import { LEGAL, type LegalPageKey } from "@/lib/legalStrings";
import { LEGAL_ENTITY, entityValue } from "@/lib/legalEntity";
import type { Locale } from "@/lib/i18n/translations";
import CookieSettingsButton from "@/components/CookieSettingsButton";

// Plantilla de las tres páginas legales. Server component: son texto
// estático, no hace falta mandar JS. Los datos del titular se pintan desde
// legalEntity.ts y un campo pendiente (NIF, domicilio) se omite en
// producción en vez de mostrar el marcador.
export default function LegalPage({ locale, pageKey }: { locale: Locale; pageKey: LegalPageKey }) {
  const L = LEGAL[locale];
  const page = L.pages[pageKey];
  const email = LEGAL_ENTITY.email;
  const fill = (s: string) => s.replaceAll("{email}", email);
  const nif = entityValue("nif");
  const address = entityValue("address");
  const showEntity = pageKey !== "dinero";
  const rows: [string, string][] = [
    [L.entityLabels.owner, LEGAL_ENTITY.name],
    ...(nif ? ([[L.entityLabels.nif, nif]] as [string, string][]) : []),
    ...(address ? ([[L.entityLabels.address, address]] as [string, string][]) : []),
    [L.entityLabels.email, email],
    [L.entityLabels.site, LEGAL_ENTITY.domain],
  ];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="font-card-title text-4xl text-[#1a1a1a]">{page.h1}</h1>
      <div className="vintage-card flex flex-col gap-3 rounded-3xl p-8 text-[#3a3a36]">
        <p className="text-sm">
          {L.updatedLabel}: {L.dateLabel}
        </p>
        {showEntity && (
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-xl bg-black/5 p-4 text-sm">
            {rows.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="font-semibold">{k}</dt>
                <dd className="break-words">{v}</dd>
              </div>
            ))}
          </dl>
        )}
        {page.sections.map((s) => (
          <section key={s.h} className="flex flex-col gap-2">
            <h2 className="mt-2 text-xl font-semibold text-[#1a1a1a]">{s.h}</h2>
            {s.p.map((para) => (
              <p key={para}>{fill(para)}</p>
            ))}
          </section>
        ))}
        {pageKey === "privacidad" && (
          <CookieSettingsButton
            label={L.footer.cookies}
            className="mt-2 self-start rounded-full border border-[#8a6d1f] px-5 py-2 text-sm font-semibold text-[#1a1a1a] hover:bg-black/5"
          />
        )}
      </div>
    </div>
  );
}
