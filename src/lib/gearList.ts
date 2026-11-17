import { offerHash } from "@/lib/go";
import { offerTotalInEUR } from "@/lib/offerMoney";

// Versión liviana de una ficha de equipamiento para los listados: el
// servidor la arma y la pasa como prop, en vez de que el cliente importe
// el array entero (apparel.ts pesaba 1,07 MB gzip en el chunk de /ropa).
// Fuera: sizePrices, la URL de cada oferta (va su hash de /go/) y una
// foto por oferta (las ofertas de una ficha son el mismo producto, ya
// fundido por EAN/foto: alcanza una).
type Currency = "EUR" | "GBP" | "CLP" | "MXN" | "COP";
type FullOffer = { store: string; price: number; priceMax?: number; shipping: number; currency: Currency; url: string; imageUrl: string; sizes: string[] };
type FullItem = { id: string; brand: string; model: string; colour: string; type?: string; offers: FullOffer[] };
export type SlimGearItem = Omit<FullItem, "offers" | "type"> & {
  type: string;
  img: string;
  offers: { store: string; price: number; priceMax?: number; shipping: number; currency: Currency; sizes: string[]; h: string }[];
};

export function slimGear(items: readonly FullItem[]): SlimGearItem[] {
  return items.map((p) => ({
    id: p.id,
    brand: p.brand,
    model: p.model,
    colour: p.colour,
    type: p.type ?? "",
    img: p.offers[0]?.imageUrl ?? "",
    offers: p.offers.map((o) => ({
      store: o.store,
      price: o.price,
      ...(o.priceMax != null && { priceMax: o.priceMax }),
      shipping: o.shipping,
      currency: o.currency,
      sizes: o.sizes,
      h: offerHash(o.url),
    })),
  }));
}

export type GearListSection = "ropa" | "entrenamiento" | "guantes" | "pelotas";
export type GearListProps = { initial: SlimGearItem[]; total: number; url: string };

// Primera pintada: las INITIAL más baratas viajan en el HTML; el resto llega
// del JSON estático /api/gear-list/[section] (src/lib/useGearList.ts). Antes
// las 8.385 fichas de ropa iban en el HTML: 829 KB gzip en cada visita.
const INITIAL = 48;
const totalEUR = (p: SlimGearItem) => Math.min(...p.offers.map((o) => offerTotalInEUR(o)));

export function gearListProps(items: SlimGearItem[], section: GearListSection): GearListProps {
  // ?v= cambia con los datos: el JSON se cachea un año en el navegador sin servir uno viejo.
  const v = offerHash(items.map((p) => `${p.id}:${p.offers.map((o) => `${o.h}${o.price}${o.shipping}`).join()}`).join("|"));
  return { initial: [...items].sort((a, b) => totalEUR(a) - totalEUR(b)).slice(0, INITIAL), total: items.length, url: `/api/gear-list/${section}?v=${v}` };
}
