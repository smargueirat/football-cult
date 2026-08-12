import { ImageResponse } from "next/og";
import { bestOffer, brandNames, findProduct, teamNames, typeNames } from "@/data/products";

export const alt = "Football Cult Archive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori no puede usar next/font, así que traemos los mismos pesos de
// Google Fonts que ya usa el sitio (Alfa Slab One para el titular) como
// bytes crudos en tiempo de petición -- ver layout.tsx para la fuente
// "oficial" usada en el resto de la interfaz.
async function loadGoogleFont(family: string, weight: string, text: string) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(cssUrl)).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);
  if (!match) throw new Error(`No se pudo resolver la fuente ${family}`);
  const res = await fetch(match[1]);
  return res.arrayBuffer();
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = findProduct(id);

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f0e6d2",
            fontSize: 48,
            color: "#1a1a1a",
          }}
        >
          Football Cult
        </div>
      ),
      { ...size }
    );
  }

  const team = teamNames[product.teamKey].es;
  const type = typeNames[product.typeKey].es;
  const brand = product.brand ? brandNames[product.brand] : null;
  const photo = bestOffer(product)?.imageUrl;
  const titleText = `${team} ${type}`;
  const signatureText = "Football Cult Archive";

  const [titleFont, signatureFont] = await Promise.all([
    loadGoogleFont("Alfa+Slab+One", "400", titleText),
    loadGoogleFont("Cormorant+Garamond", "600", signatureText + product.season + (brand ?? "")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #fffdf8 0%, #f0e6d2 100%)",
          padding: 56,
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            borderRadius: 32,
            border: "3px solid #C9A24B",
            background: "#fffdf8",
            boxShadow: "0 0 0 1px rgba(43,32,10,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 460,
              height: "100%",
              background: `linear-gradient(135deg, #fffdf8, ${product.colorHex}33, ${product.colorHexSecondary}22)`,
              borderRight: "3px solid #C9A24B",
            }}
          >
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo}
                width={360}
                height={360}
                style={{ objectFit: "contain" }}
              />
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flex: 1,
              padding: "48px 56px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <span
                style={{
                  fontFamily: "Cormorant Garamond",
                  fontSize: 26,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 4,
                  color: "#9C7A2E",
                }}
              >
                {product.season}
                {brand ? ` · ${brand}` : ""}
              </span>
              <span
                style={{
                  fontFamily: "Alfa Slab One",
                  fontSize: 60,
                  lineHeight: 1.1,
                  color: "#1a1a1a",
                }}
              >
                {titleText}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  background: "#1B3B2B",
                }}
              />
              <span
                style={{
                  fontFamily: "Cormorant Garamond",
                  fontWeight: 600,
                  fontSize: 30,
                  color: "#1B3B2B",
                }}
              >
                {signatureText}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Alfa Slab One", data: titleFont, style: "normal", weight: 400 },
        { name: "Cormorant Garamond", data: signatureFont, style: "normal", weight: 600 },
      ],
    }
  );
}
