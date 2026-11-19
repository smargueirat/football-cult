import { offerHash } from "@/lib/go";
import { offerTotalInEUR } from "@/lib/offerMoney";
import { teamNames } from "@/lib/productMeta";

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

export function slimGear(items: readonly FullItem[], section?: GearListSection): SlimGearItem[] {
  const slim = items.map((p) => ({
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
  return section === "ropa" ? byRelevance(slim) : slim;
}

export type GearListSection = "ropa" | "entrenamiento" | "guantes" | "pelotas";
export type GearListProps = { initial: SlimGearItem[]; total: number; url: string };
const totalEUR = (p: SlimGearItem) => Math.min(...p.offers.map((o) => offerTotalInEUR(o)));

// Orden por defecto de /ropa ("relevancia"): primero lo atado a un club o
// selección, después lo genérico (camisetas lisas, brazaletes, medias); en
// cada grupo las prendas antes que los accesorios, las marcas conocidas
// antes que el resto, y el precio como desempate. Se aplica UNA vez acá, en el servidor, a la lista
// entera: tanto las 48 del HTML como el JSON completo salen ya en este
// orden, así que el cliente solo conserva el orden del array y no hay
// salto cuando llega el listado completo.
const norm = (s: string) => s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
// Nombres de clubes y selecciones del catálogo (en los cinco idiomas) + las
// formas cortas que traen los títulos de ropa ("PSG", "OM", "OL", "Barcelone"...).
// "Jordan" es una marca de Nike, no la selección.
const TEAM_TERMS = [
  ...new Set(Object.values(teamNames).flatMap((n) => Object.values(n).map(norm))),
]
  .filter((t) => t.length >= 4 && t !== "jordan")
  .concat("psg om ol asse benfica tottenham roma barcelone barcelona madrid manchester bayern werder caen munich lisboa lisbonne equipacion seleccion".split(" "));
const TEAM_RE = new RegExp(`\\b(${TEAM_TERMS.sort((a, b) => b.length - a.length).join("|").replace(/ /g, "\\s")})\\b`);
// Accesorios: baratos y por eso primeros por precio, pero no son lo que busca quien abre /ropa.
const ACCESSORIES = new Set(["socks", "shinguards", "bag", "armband"]);
const MAJOR_BRANDS = new Set("adidas nike puma umbro hummel kappa macron joma castore under armour new balance reebok jordan mizuno errea".split(" "));

function byRelevance(items: SlimGearItem[]): SlimGearItem[] {
  const rank = (p: SlimGearItem) =>
    (TEAM_RE.test(norm(`${p.brand} ${p.model}`)) ? 0 : 4) + (ACCESSORIES.has(p.type) ? 2 : 0) + (MAJOR_BRANDS.has(norm(p.brand).split(" ")[0]) ? 0 : 1);
  const key = new Map(items.map((p) => [p, [rank(p), totalEUR(p)] as const]));
  return [...items].sort((a, b) => key.get(a)![0] - key.get(b)![0] || key.get(a)![1] - key.get(b)![1] || (a.id < b.id ? -1 : 1));
}

// Primera pintada: las INITIAL primeras viajan en el HTML (las más baratas, o
// en ropa las más relevantes, que ya vienen primero en `items`); el resto llega
// del JSON estático /api/gear-list/[section] (src/lib/useGearList.ts). Antes
// las 8.385 fichas de ropa iban en el HTML: 829 KB gzip en cada visita.
const INITIAL = 48;

export function gearListProps(items: SlimGearItem[], section: GearListSection): GearListProps {
  // ?v= cambia con los datos: el JSON se cachea un año en el navegador sin servir uno viejo.
  const v = offerHash(items.map((p) => `${p.id}:${p.offers.map((o) => `${o.h}${o.price}${o.shipping}`).join()}`).join("|"));
  const first = section === "ropa" ? items : [...items].sort((a, b) => totalEUR(a) - totalEUR(b));
  return { initial: first.slice(0, INITIAL), total: items.length, url: `/api/gear-list/${section}?v=${v}` };
}
