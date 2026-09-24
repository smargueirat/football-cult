import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { priceStudy } from "@/lib/priceStudy";
import { STUDY, studyUnits } from "@/lib/priceStudyStrings";
import type { HubLocale } from "@/data/teamMeta";

// Tarjeta del estudio de precios, en dos formatos desde un solo render.
//
// Existe por dos motivos concretos, los dos medidos el 2026-09-24:
//  - La página no tenía NINGUNA og:image, así que compartirla en WhatsApp,
//    X o LinkedIn mostraba solo texto pelado.
//  - Pinterest no podía guardarla: su lector no encontró una sola imagen
//    (el estudio son barras de CSS, no fotos) y además exige formato
//    vertical o cuadrado, entre 2:3 y 1:1 -- una og:image apaisada de
//    1200x630 tampoco le habría servido. De ahí las dos medidas.
//
// Los números NO van escritos a mano: salen de priceStudy(), el mismo
// cálculo que la página, así que la tarjeta se actualiza sola con el scan
// nocturno y nunca contradice lo publicado.

export const LANDSCAPE = { width: 1200, height: 630 };
export const PORTRAIT = { width: 1000, height: 1500 };

// Las fuentes se leen del disco una sola vez por instancia: satori no
// puede usar next/font, y pedirlas por red en cada render era un
// round-trip a Google Fonts por cada bot (ver el comentario largo en
// camiseta/[id]/opengraph-image.tsx).
let fontCache: Promise<{ title: Buffer; body: Buffer }> | null = null;

export function studyFonts() {
  if (!fontCache) {
    fontCache = Promise.all([
      readFile(join(process.cwd(), "public/fonts/AlfaSlabOne-Regular.ttf")),
      readFile(join(process.cwd(), "public/fonts/CormorantGaramond-SemiBold.ttf")),
    ]).then(([title, body]) => ({ title, body }));
  }
  return fontCache;
}

const CREAM = "#f0e6d2";
const GREEN = "#1B3B2B";
const GOLD = "#B8933F";
const INK = "#201d16";

export function studyCard(locale: HubLocale, portrait: boolean) {
  const s = priceStudy();
  const t = STUDY[locale];
  const pad = portrait ? 80 : 64;

  // Mismas tres cifras y mismas etiquetas que la página, para que la
  // tarjeta no diga nunca algo distinto de lo publicado.
  const stats: [string, string, string][] = [
    [`${s.avgGapPct.toFixed(1)}%`, t.statAvgGap, t.statAvgGapNote],
    [`${Math.round(s.shareOver20)}%`, t.statOver20, t.statOver20Note],
    [`${Math.round(s.maxGapAbs)} EUR`, t.statMaxGap, t.statMaxGapNote],
  ];
  const units = studyUnits(locale);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: CREAM,
        padding: pad,
        fontFamily: "Cormorant",
        color: INK,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: portrait ? 30 : 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: GOLD,
          }}
        >
          Football Cult
        </div>
        <div
          style={{
            display: "flex",
            marginTop: portrait ? 28 : 18,
            fontFamily: "Alfa",
            fontSize: portrait ? 66 : 54,
            lineHeight: 1.12,
            color: GREEN,
          }}
        >
          {t.title}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: portrait ? "column" : "row",
          gap: portrait ? 34 : 28,
        }}
      >
        {stats.map(([value, label, note]) => (
          <div
            key={label}
            style={{
              display: "flex",
              flexDirection: "column",
              // Solo en horizontal: en fila, flex:1 reparte el ancho. En
              // columna hace flex-basis 0 sobre un padre de altura auto,
              // así que las cajas colapsan a cero y el texto se
              // superpone (pasó en la primera versión vertical).
              ...(portrait ? {} : { flex: 1 }),
              padding: portrait ? "30px 34px" : "24px 26px",
              background: "#fffdf8",
              border: `2px solid ${GOLD}55`,
              borderRadius: 22,
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: "Alfa",
                fontSize: portrait ? 76 : 58,
                color: GREEN,
              }}
            >
              {value}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 10,
                fontSize: portrait ? 34 : 27,
                color: GREEN,
              }}
            >
              {label}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 6,
                fontSize: portrait ? 25 : 20,
                lineHeight: 1.3,
                color: "#675c44",
              }}
            >
              {note}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          fontSize: portrait ? 30 : 24,
          color: "#675c44",
        }}
      >
        <div style={{ display: "flex" }}>
          {s.products} {units.shirts} · {s.stores} {units.stores}
        </div>
        <div style={{ display: "flex", color: GREEN }}>football-cult.com</div>
      </div>
    </div>
  );
}
