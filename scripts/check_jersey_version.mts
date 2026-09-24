// Chequeo del detector de versión jugador/hincha:
//   npx tsx scripts/check_jersey_version.mts
import assert from "node:assert";
import { offerVersion, splitByVersion } from "../src/lib/jerseyVersion";

const player = (store: string, title: string) =>
  assert.strictEqual(offerVersion({ store, title }), "player", `deberia ser jugador: ${title}`);
const fan = (store: string, title: string) =>
  assert.strictEqual(offerVersion({ store, title }), "fan", `deberia ser hincha: ${title}`);

// Señales inequívocas, en cualquier tienda
player("eBay", "Netherlands Away Player Version Football Jersey 2026 World Cup");
player("eBay", "Germany 2022 Away Adidas Authentic Soccer Jersey - Player Issue");
player("AdidasES", "Camiseta Real Madrid HEAT.RDY 25/26");
player("FootStoreFR", "Maillot Nike Dri-FIT ADV PSG 2025");
player("eBay US", "USMNT 2026 Home On-Field Jersey");

// "Authentic" en tienda oficial = gama de jugador
player("AdidasES", "Camiseta primera equipacion Italia 2024 Authentic");
player("FootStoreES", "Camiseta Authentic Espana Segunda Equipacion");
player("SportIsGoodFR", "Maillot Exterieur Authentique France 2025");

// El caso que rompia todo: en un marketplace "authentic" es "no es falsa"
fan("eBay", "Adidas LAFC Away Authentic Soccer Jersey 2023/24 - 100% Authentic");
fan("eBay ES", "Camiseta Barcelona 2025 autentica nueva con etiquetas");
fan("Amazon", "Authentic Real Madrid Home Shirt 2025/26");

// Normales
fan("AdidasES", "Camiseta segunda equipacion Columbus Crew 2025/26");
fan("FootStoreES", "Camiseta 1a Equipacion San Diego FC 2025/26");
fan("eBay", "");

const g = splitByVersion([
  { store: "AdidasES", title: "Italia 2024 Authentic" },
  { store: "AdidasPT", title: "Camisola Principal Oficial 2024 da Italia" },
]);
assert.strictEqual(g.player.length, 1);
assert.strictEqual(g.fan.length, 1);
assert.strictEqual(g.mixed, true);

console.log("OK: detector de version jugador/hincha");
