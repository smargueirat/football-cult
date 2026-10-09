import { bestOffer, type Product } from "@/data/products";
import { mainPhoto } from "@/lib/officialStores";

// Foto principal de la ficha para og:image y Product.image: la de la mejor
// oferta, salvo que sea de una tienda con marca de agua y otra oferta tenga
// foto limpia (ver mainPhoto). Reemplaza a productImage() de products.ts,
// que tomaba siempre la de la oferta más barata. Solo servidor: importa el
// catálogo entero.
export function productImage(product: Product): string | undefined {
  return mainPhoto(bestOffer(product), product.offers);
}
