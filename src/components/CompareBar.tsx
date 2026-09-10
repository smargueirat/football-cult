"use client";

import dynamic from "next/dynamic";
import { useCompare } from "@/lib/compare/CompareContext";

// CompareBar se manda en TODAS las páginas (layout.tsx de [locale]),
// pero para la enorme mayoría de las visitas compareList está vacío --
// nadie puso nada a comparar. El contenido real (CompareBarContent)
// necesita findProduct/teamNames/etc. de products.ts, el archivo de
// 5.9MB/76 mil líneas con el catálogo completo. A diferencia de
// FavoritesButton/CountrySelector en Header.tsx (que SIEMPRE se
// renderizan, un dynamic() ahí no evita cargar el chunk, sólo lo hace
// async), acá SÍ hay un punto real donde no renderizar nada -- el early
// return de siempre -- así que dynamic() import recién carga
// CompareBarContent (y products.ts con él) cuando compareList
// realmente tiene algo adentro, no en cada página del sitio.
const CompareBarContent = dynamic(() => import("./CompareBarContent"), { ssr: false });

export default function CompareBar() {
  const { compareList } = useCompare();
  if (compareList.length === 0) return null;
  return <CompareBarContent />;
}
