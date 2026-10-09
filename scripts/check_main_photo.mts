// Chequeo de la foto principal (mainPhoto/photoOrder, src/lib/officialStores.ts):
// la foto con marca de agua de una tienda de réplicas no es la principal si
// otra oferta de la ficha trae foto limpia, y sí lo es si es la única.
// Uso: npx tsx scripts/check_main_photo.mts
import { mainPhoto, photoOrder } from "../src/lib/officialStores";

const fjh = { store: "FansJerseyHub", imageUrl: "fjh.jpg", inStock: true };
const pro = { store: "Pro:Direct Soccer", imageUrl: "pro.jpg", inStock: true };
const sinFoto = { store: "AdidasES", inStock: true };
const agotada = { store: "eBay", imageUrl: "ebay.jpg", inStock: false };

const CASOS: [string, string | undefined, string | undefined][] = [
  ["réplica más barata + oficial con foto -> oficial", mainPhoto(fjh, [fjh, pro]), "pro.jpg"],
  ["réplica sola -> réplica", mainPhoto(fjh, [fjh, sinFoto]), "fjh.jpg"],
  ["oferta elegida limpia -> la suya", mainPhoto(pro, [fjh, pro]), "pro.jpg"],
  ["elegida sin foto -> primera limpia", mainPhoto(sinFoto, [sinFoto, fjh, agotada]), "ebay.jpg"],
  ["sin oferta elegida -> limpia", mainPhoto(undefined, [fjh, pro]), "pro.jpg"],
  ["nadie con foto -> nada", mainPhoto(sinFoto, [sinFoto]), undefined],
];
const mal = CASOS.filter(([, got, want]) => got !== want);
const orden = photoOrder(fjh, [fjh, agotada, pro]).map((o) => o.store).join(",");
if (orden !== "Pro:Direct Soccer,eBay,FansJerseyHub") mal.push(["orden de galería", orden, "Pro:Direct Soccer,eBay,FansJerseyHub"]);
if (mal.length) {
  console.error("FALLA:", mal);
  process.exit(1);
}
console.log(`ok: ${CASOS.length + 1} casos`);
