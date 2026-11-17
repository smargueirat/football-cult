import { offerHash } from "@/lib/go";

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
