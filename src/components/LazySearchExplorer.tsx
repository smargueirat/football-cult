"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSearchFilter } from "@/lib/search/SearchFilterContext";

// Mismo patrón que FloatingFilterButton.tsx: SearchExplorer necesita el
// catálogo completo del cliente (~1.1MB JS/315KB gzip) para poder buscar
// al instante, así que en el home (donde es una sección más, no el
// contenido principal) no hay razón para pedir ese chunk antes de que el
// usuario esté cerca de llegar a la sección de catálogo. Se muestra un
// skeleton simple mientras tanto para no dejar un salto de layout cuando
// el chunk real entra.
const SearchExplorer = dynamic(() => import("./SearchExplorer"), {
  ssr: false,
  loading: () => (
    <div className="h-16 w-full animate-pulse rounded-2xl bg-[#f6efdd]" />
  ),
});

export default function LazySearchExplorer() {
  const [visible, setVisible] = useState(false);
  // Si hay algo buscado, el chunk se pide ya, sin esperar el scroll: o el
  // usuario está tipeando en el buscador del hero (y va a apretar Enter
  // en un segundo), o entró por un link con ?q= y los resultados son lo
  // único que vino a ver.
  const { query } = useSearchFilter();
  const wanted = query.trim().length > 0;

  useEffect(() => {
    if (visible) return;
    function onScroll() {
      if (window.scrollY > 420) setVisible(true);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [visible]);

  if (!visible && !wanted) return <div className="h-16 w-full animate-pulse rounded-2xl bg-[#f6efdd]" />;
  return <SearchExplorer />;
}
