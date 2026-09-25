"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSearchFilter } from "@/lib/search/SearchFilterContext";

// Mantiene `?q=` y el estado de búsqueda en sincronía, en las dos
// direcciones. Hasta ahora la búsqueda era 100% de cliente: el texto
// tipeado no aparecía en ningún lado, así que un resultado no se podía
// compartir por link ni volver a él con el botón "atrás".
//
// Por qué es un componente aparte y no vive dentro de
// SearchFilterProvider: useSearchParams fuerza a renderizar en el cliente
// todo el árbol hasta el <Suspense> más cercano. El provider envuelve el
// sitio entero desde layout.tsx, así que llamarlo ahí dejaría TODAS las
// páginas sin HTML prerenderizado -- justo lo contrario de lo que
// necesitamos para indexar. Acá, con su propio <Suspense> pegado al lado
// y devolviendo null, el "bailout" abarca exactamente nada.
//
// Se escribe con window.history.replaceState y no con router.replace a
// propósito: replaceState está soportado por el router de Next (integra
// con useSearchParams, ver 01-app/01-getting-started/04-linking-and-navigating.md)
// y NO dispara navegación, así que tipear no genera un request por
// tanda al servidor. En Hobby eso importa: las invocaciones y los Edge
// Requests ya están al límite.
export default function SearchQueryUrlSync() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { query, setQuery } = useSearchFilter();

  const urlQuery = searchParams.get("q") ?? "";
  // Último valor que ESTE componente dejó en la URL. Es lo único que
  // distingue "la URL cambió por fuera" (link entrante, atrás/adelante)
  // de "el usuario tipeó y hay que reflejarlo".
  const written = useRef("");
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (pathname !== lastPath.current) {
      lastPath.current = pathname;
      written.current = urlQuery;
      // Una ruta nueva manda sobre el estado SOLO si trae ?q=. Si no lo
      // trae no se limpia nada: entrar a una ficha y volver atrás tiene
      // que conservar la búsqueda (ver el comentario de sortBy en
      // SearchFilterContext.tsx, es el mismo requisito).
      if (urlQuery && urlQuery !== query) {
        setQuery(urlQuery);
        // Llegó por un link con ?q=: lo que tiene que ver es el
        // resultado, no el hero. La <section id="catalogo"> la
        // renderiza el servidor en page.tsx, así que ya está en el DOM
        // aunque el chunk del buscador todavía esté cargando.
        document.getElementById("catalogo")?.scrollIntoView({ block: "start" });
      }
      return;
    }

    if (urlQuery === query) {
      written.current = urlQuery;
      return;
    }

    if (urlQuery !== written.current) {
      written.current = urlQuery;
      setQuery(urlQuery);
      return;
    }

    // Tipeó: la URL se actualiza al final de la tanda, no por tecla.
    const id = setTimeout(() => {
      written.current = query;
      const params = new URLSearchParams(window.location.search);
      if (query.trim()) params.set("q", query);
      else params.delete("q");
      const qs = params.toString();
      window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    }, 400);
    return () => clearTimeout(id);
  }, [pathname, urlQuery, query, setQuery]);

  return null;
}
