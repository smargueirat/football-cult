// Chequeo de la limpieza de títulos de oferta (src/lib/displayTitle.ts).
//
// El título real de la tienda es la fuente de verdad y NUNCA se reemplaza por
// uno armado por nosotros (ver feedback_realname_primary.md). La limpieza solo
// saca ruido de vendedor. Este chequeo existe para que esa frontera no se
// mueva sin darse cuenta: la mitad de los casos comprueba que SÍ se saca lo
// que sobra, y la otra mitad que NO se toca lo que nombra algo real.
import { cleanDisplayTitle } from "../src/lib/displayTitle";

const CASOS: [string, string][] = [
  // saca jerga de estado de eBay
  ["Bari Errea Home Camiseta 2025-2026 Bnib Bnwt", "Bari Errea Home Camiseta 2025-2026"],
  ["New Balance Athletic Shirt NWT", "New Balance Athletic Shirt"],
  // saca promesas de envío y de autenticidad
  ["Saudi Arabia 2016 Home Jersey Size S - Free Domestic Shipping", "Saudi Arabia 2016 Home Jersey Size S"],
  ["Camiseta Real Madrid 2025/26 100% Original", "Camiseta Real Madrid 2025/26"],
  // recompone el separador que queda al sacar algo del medio
  ["Wales 2022 Home Jersey - Size M - Brand New Tags On - Bought in Qatar", "Wales 2022 Home Jersey - Size M - Bought in Qatar"],
  // NO toca "New" cuando es parte de un nombre real
  ["New York City FC Home Jersey 2025/26", "New York City FC Home Jersey 2025/26"],
  // NO toca la temporada con guion ni la talla
  ["Napoli 2008 - 2009 Away Diadora size S/M", "Napoli 2008 - 2009 Away Diadora size S/M"],
  // si la limpieza se comería el título entero, se devuelve el original
  ["BNWT NWT", "BNWT NWT"],
];

let fallos = 0;
for (const [entra, espera] of CASOS) {
  const sale = cleanDisplayTitle(entra);
  if (sale !== espera) {
    fallos++;
    console.error(`  esperaba: ${espera}\n  obtuvo  : ${sale}\n  entrada : ${entra}\n`);
  }
}
if (fallos) {
  console.error(`FALLA check_display_title: ${fallos} de ${CASOS.length}`);
  process.exit(1);
}
console.log(`check_display_title ok (${CASOS.length} casos)`);
