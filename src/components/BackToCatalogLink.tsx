"use client";

import { useRouter } from "next/navigation";
import Link from "@/lib/i18n/LocaleLink";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { hasCatalogHistory } from "@/lib/search/catalogVisit";

const DEFAULT_CLASS =
  "mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#675c44] transition-colors hover:text-[#1B3B2B]";

// "Volver al catálogo", compartido por las ~10 páginas de detalle/listado
// que lo usaban. Antes cada una era un <Link href="/"> fijo -- entrar a
// una camiseta desde /retro y tocar esto mandaba siempre al home entero,
// perdiendo la sección/filtros (bug reportado: "el comportamiento siempre
// debe ser volver a donde estaba"). Ahora, si hay una página de catálogo
// real en el historial de ESTA pestaña (marcada por markCatalogVisited,
// ver catalogVisit.ts), un click hace router.back() -- vuelve exactamente
// a esa página, con su scroll/filtros intactos (SearchExplorer los
// restaura solo, viven en contexto/sessionStorage). Si no (URL externa,
// pestaña nueva, link compartido), queda el <a href> normal a
// `fallbackHref` -- por eso el handler no hace preventDefault salvo
// cuando de verdad va a reemplazarlo por back(), así con JS roto el link
// sigue funcionando.
export default function BackToCatalogLink({
  fallbackHref = "/",
  className = DEFAULT_CLASS,
}: {
  fallbackHref?: string;
  className?: string;
}) {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <Link
      href={fallbackHref}
      className={className}
      onClick={(e) => {
        if (hasCatalogHistory()) {
          e.preventDefault();
          router.back();
        }
      }}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {t.detail.backToCatalog}
    </Link>
  );
}
