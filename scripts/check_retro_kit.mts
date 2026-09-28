// Chequeo del nombre de equipación de las fichas retro:
//   npx tsx scripts/check_retro_kit.mts
//
// Real bug found (2026-09-28): psg-retro-202324-home, -away, -third,
// -goalkeeper, -training y -prematch salían las SEIS con el mismo
// <title>, la misma meta descripción y el mismo `name` en el JSON-LD --
// 1.113 grupos de fichas con título idéntico en todo el catálogo, 2.551
// fichas. Es la señal de "Duplicada: Google ha elegido una versión
// canónica diferente" que Search Console ya reporta, la misma que se
// arregló para las copias por idioma (3ab5b8e) y para mujer/niños
// (61346ed).
//
// El arreglo (kitTypeName, en src/lib/productMeta.ts) lee la equipación
// del SUFIJO DEL ID, porque es el único lugar del catálogo donde ese
// dato existe: el typeKey de las 5.234 fichas retro es literalmente
// "retro". O sea que depende de una convención de nombres que produce la
// minería, no de un campo con tipo -- si mañana una pasada inventa un id
// retro sin sufijo conocido (`-fourth`, `-special`, o directamente sin
// sufijo), kitTypeName cae en silencio al "Retro" pelado de antes y los
// duplicados vuelven sin que nadie se entere. Eso es lo que este chequeo
// impide.
import { products, kitTypeName, typeNames } from "../src/data/products";

const retro = products.filter((p) => p.typeKey === "retro");
const sinEquipacion = retro.filter(
  (p) => kitTypeName(p, "es") === typeNames.retro.es,
);

if (sinEquipacion.length > 0) {
  console.error(
    `ERROR: ${sinEquipacion.length} de ${retro.length} fichas retro tienen un id del que no se puede leer la equipación.\n` +
      `El id tiene que terminar en -home / -away / -third / -goalkeeper / -training / -prematch\n` +
      `(opcionalmente seguido de una cola de colorway, tipo -euroskit o -mens).\n` +
      `Sin eso comparten <title> con las otras equipaciones del mismo equipo y temporada:\n` +
      sinEquipacion.slice(0, 40).map((p) => `  ${p.id}`).join("\n"),
  );
  process.exit(1);
}
console.log(`OK: las ${retro.length} fichas retro exponen su equipación en el id`);

// Informativo, NO bloquea ni alerta: cuántas fichas siguen compartiendo
// título. Al 2026-09-28 son 31 grupos / 73 fichas, y son OTRO problema
// -- colorways que solo se distinguen por una cola del id
// (juventus-training-202526 vs -halfzip vs -pastel vs -jacket...), 29 de
// fichas no retro y 2 de retro. Se imprime para que la cifra quede en el
// log del scan y se note si empeora; no se convierte en alerta porque
// saltaría todas las noches por algo que ya se decidió no arreglar acá.
const grupos = new Map<string, string[]>();
for (const p of products) {
  const k = `${p.teamKey}|${kitTypeName(p, "es")}|${p.season}|${p.ageGroup ?? "adult"}`;
  const l = grupos.get(k) ?? [];
  l.push(p.id);
  grupos.set(k, l);
}
const dup = [...grupos.entries()].filter(([, l]) => l.length > 1);
console.log(
  `INFO títulos duplicados (colorways, no bloquea): ${dup.length} grupos / ${dup.reduce((a, [, l]) => a + l.length, 0)} fichas`,
);
