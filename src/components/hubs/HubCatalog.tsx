"use client";

import dynamic from "next/dynamic";
import type { SearchExplorerProps } from "@/components/SearchExplorer";

// Listado con buscador, Filtros (chips) y Ordenar de los hubs nuevos: el
// mismo SearchExplorer de /botas y /retro con el recorte del hub forzado por
// props (SSR correcto desde el primer render, ver CategoryCatalogPage.tsx).
// dynamic() como en BotasPageClient: el catálogo va en su propio chunk.
const SearchExplorer = dynamic(() => import("@/components/SearchExplorer"), {
  loading: () => (
    <div className="min-h-[100svh]">
      <div className="h-16 w-full animate-pulse rounded-2xl bg-[#f6efdd]" />
    </div>
  ),
});

export default function HubCatalog(props: SearchExplorerProps) {
  return (
    <div className="mb-10">
      <SearchExplorer {...props} />
    </div>
  );
}
