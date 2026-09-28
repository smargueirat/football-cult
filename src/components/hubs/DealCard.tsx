import Link from "next/link";
import { getDisplaySrc } from "@/lib/images";
import { formatOfferMoney, type OfferCurrencyCode } from "@/lib/offerMoney";

// Tarjeta de servidor para los listados de ofertas.
//
// La primera versión de /ofertas reusaba BootCard / GearCard / TicketCard,
// que son componentes de CLIENTE (favoritos, comparador, tilt): con 203
// fichas en la página, el HTML se fue a 863 KB contra los ~180 KB de un
// hub, porque cada tarjeta serializa su producto entero en la carga de
// React. En un comparador de precios eso se paga en ventas -- ver la
// regla de rendimiento móvil del proyecto.
//
// Esta es la misma tarjeta liviana que GearHub ya usa para sus listados:
// marcado plano, servidor, sin estado. Se pierden los botones de favorito
// y comparar, que viven en la ficha, a un clic de acá.
export default function DealCard({
  href,
  title,
  image,
  price,
  currency,
  pct,
  store,
  priority = false,
}: {
  href: string;
  title: string;
  image: string;
  price: number;
  currency: OfferCurrencyCode;
  /** Porcentaje de bajada. Sin él no se pinta la chapa: /regalos lista
   *  productos por presupuesto, no rebajas. */
  pct?: number;
  store: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#C9A24B]/35 bg-gradient-to-b from-[#fffdf8] to-[#f6efdd] shadow-sm transition-transform hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#fffdf8] p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getDisplaySrc(image, 400)}
          alt={title}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-contain"
        />
        {pct != null && (
          <span className="shadow-vintage-sm absolute left-2 top-2 rounded-full bg-[#B45309] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            -{pct}%
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-sm font-medium leading-snug text-[#1B3B2B]">{title}</span>
        <span className="mt-auto text-xs text-[#675c44]">
          {formatOfferMoney(price, currency)} · {store}
        </span>
      </div>
    </Link>
  );
}
