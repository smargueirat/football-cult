// Chequeo del glosario de src/lib/gearText.ts:  npx tsx scripts/check_gear_text.mts
// Cubre lo que se rompió mientras se construía -- el orden del modificador
// en inglés, las traducciones malas del propio feed español, y que un
// prefijo desconocido caiga al texto original en vez de a medias.
import assert from "node:assert";
import { localizeGearModel as L, localizeGearColour as C } from "../src/lib/gearText";

const cases: [string, string, "es" | "en" | "pt" | "fr" | "it", string][] = [
  ["Pantalón corto Nike Dri-FIT - Noir", "Nike", "en", "Shorts Nike Dri-FIT - Black"],
  ["Pantalón corto Nike Dri-FIT - Noir", "Nike", "es", "Pantalón corto Nike Dri-FIT - Negro"],
  ["Cône d'entraînement Martes Termio - Multicolore", "Martes", "es", "Cono de entrenamiento Martes Termio - Multicolor"],
  // el feed español traduce mal desde el francés; el glosario lo corrige
  ["Cono de accionamiento Martes Termio - Multicolore", "Martes", "es", "Cono de entrenamiento Martes Termio - Multicolor"],
  ["Sudor Jako Base - Noir", "Jako", "es", "Sudadera Jako Base - Negro"],
  ["Gants de gardien Uhlsport Speed Contact - Blanc", "Uhlsport", "it", "Guanti da portiere Uhlsport Speed Contact - Bianco"],
  // modificador componible: "chasuble" + "reversible"
  ["Chasuble réversible Acerbis Gamos - Bleu", "Acerbis", "en", "Reversible training bib Acerbis Gamos - Blue"],
  // en inglés el modificador va delante, en el resto detrás
  ["Pantalón corto mujer Jako Power - Bleu", "Jako", "en", "Women's shorts Jako Power - Blue"],
  ["Pantalón corto mujer Jako Power - Bleu", "Jako", "es", "Pantalón corto de mujer Jako Power - Azul"],
  // el título ya empieza por la marca: solo cambia el color
  ["adidas COPA Gloves CLB Guantes JH3790 - plata", "adidas", "en", "adidas COPA Gloves CLB Guantes JH3790 - Silver"],
  // segunda tanda: basura del feed, no francés ("plots de marquage" ->
  // "implantes de marcapasos", "haie" -> "seto antilesión")
  ["Kit de 25 implantes de marcapasos Sporti Pro - Jaune", "Sporti", "es", "Kit de 25 discos de marcaje Sporti Pro - Amarillo"],
  ["Seto antilesión Sporti Soft - Rouge", "Sporti", "en", "Soft training hurdle Sporti Soft - Red"],
  ["escala rítmica Sporti Agility - Bleu", "Sporti", "it", "Scala per agilità Sporti Agility - Blu"],
  // prefijo desconocido -> texto original intacto, nunca traducido a medias
  ["Cacharro rarísimo Xyz Modelo - Bleu", "Xyz", "en", "Cacharro rarísimo Xyz Modelo - Blue"],
];

for (const [model, brand, locale, want] of cases) {
  assert.strictEqual(L(model, brand, locale), want, `[${locale}] ${model}`);
}
assert.strictEqual(C("Argenté", "pt"), "Prateado");
assert.strictEqual(C("Fucsia inventado", "en"), "Fucsia inventado");
console.log(`OK: ${cases.length + 2} casos`);

// Dos modificadores encadenados: "chaleco" + "reversible" + "de malla".
// Pelando uno solo esto quedaba sin traducir.
assert.strictEqual(
  L("Chaleco reversible de malla Precision - Rose", "Precision", "es"),
  "Chaleco reversible de malla Precision - Rosa",
);
assert.strictEqual(
  L("Chaleco reversible de malla Precision - Rose", "Precision", "it"),
  "Gilet reversibile in rete Precision - Rosa",
);
assert.strictEqual(
  L("Chaleco reversible de malla Precision - Rose", "Precision", "en"),
  "Reversible mesh gilet Precision - Pink",
);
console.log("OK: encadenado de modificadores");
