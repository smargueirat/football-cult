import SearchExplorer from "./SearchExplorer";
import { AgeGroup, CategoryKey, TypeKey } from "@/data/products";

interface Props {
  title: string;
  subtitle: string;
  category?: CategoryKey;
  type?: TypeKey;
  ageGroup?: AgeGroup;
}

// Página delgada para cada sección de camisetas (clubes, selecciones,
// retro, mujer, niños): reusa el mismo SearchExplorer del home, pero con
// el filtro de esa sección FORZADO vía props en vez de vía un efecto que
// escribe en el contexto compartido -- un efecto solo corre después de
// hidratar, así que el HTML servido (y lo que ve un crawler, o cualquier
// curl/fetch) mostraría el catálogo entero sin filtrar por un instante
// antes de "saltar" a lo correcto. Al forzarlo por prop, el filtro es
// correcto ya en el primer render, tanto en el server como en el
// cliente.
export default function CategoryCatalogPage({ title, subtitle, category, type, ageGroup }: Props) {
  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-8">
      <h1 className="font-vintage text-2xl text-[#1B3B2B] sm:text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-[#675c44]">{subtitle}</p>
      <div className="mt-5">
        <SearchExplorer forcedCategory={category} forcedType={type} forcedAgeGroup={ageGroup} forcedSection="jerseys" />
      </div>
    </div>
  );
}
