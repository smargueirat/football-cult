import Link from "next/link";

// Piezas de servidor para los hubs nuevos (2026-10-09): <a> reales, sin JS.

/** Fila de chips de enlace (mismo aspecto que GearHubLinks). */
export function LinkChipRow({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  if (!items.length) return null;
  return (
    <div className="mb-5">
      <h2 className="font-vintage mb-2 text-lg text-[#1B3B2B]">{title}</h2>
      <ul className="flex flex-wrap gap-2">
        {items.map((i) => (
          <li key={i.href}>
            <Link
              href={i.href}
              className="inline-block rounded-full border border-[#C9A24B]/40 bg-[#fffdf8] px-3 py-1.5 text-sm text-[#1B3B2B] transition-colors hover:border-[#C9A24B] hover:bg-[#f6efdd]"
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Bloque de enlaces a los hubs a los que pertenece una ficha (bota,
 *  camiseta retro, partido): sin esto la ficha no enlaza a su hub y el hub
 *  depende solo del menú para que Google lo encuentre. */
export function HubBacklinks({ label, items }: { label: string; items: { href: string; label: string }[] }) {
  if (!items.length) return null;
  return (
    <nav aria-label={label} className="mx-auto w-full max-w-[1800px] px-4 pb-8 sm:px-8">
      <LinkChipRow title={label} items={items} />
    </nav>
  );
}

/** Todos los productos del hub como enlaces de texto, plegados: el listado
 *  con filtros solo pinta la primera tanda en el HTML, y así ninguna ficha
 *  del hub queda sin un enlace rastreable. */
export function AllItemLinks({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  if (!items.length) return null;
  return (
    <details className="mb-10 rounded-2xl border border-[#C9A24B]/35 bg-[#fffdf8] px-4 py-3">
      <summary className="font-vintage cursor-pointer text-lg text-[#1B3B2B]">{title}</summary>
      <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="text-[#1B3B2B] underline decoration-[#C9A24B]/50 underline-offset-2 hover:text-[#8a6a1f]">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
