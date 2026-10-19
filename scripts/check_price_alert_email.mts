// Chequeo del correo de bajada de precio y de su umbral (src/lib/priceAlertEmail.ts):
//   npx tsx scripts/check_price_alert_email.mts
// No envía nada ni toca Redis.
import assert from "node:assert";
import { checkDrop, nextReference, pickDigest, renderAlertEmail, MAX_ITEMS, type AlertItem } from "../src/lib/priceAlertEmail";
import type { Locale } from "../src/lib/i18n/translations";

// --- Umbral: 5 % o 5 EUR, lo que ocurra primero ---
assert.equal(checkDrop(100, 95, "EUR").hit, true, "5 % justo");
assert.equal(checkDrop(100, 95.5, "EUR").hit, false, "4,5 % y 4,5 EUR");
assert.equal(checkDrop(51.73, 50.19, "EUR").hit, false, "el ejemplo del dueño (3 %, 1,54 EUR) ya no avisa");
assert.equal(checkDrop(200, 194.5, "EUR").hit, true, "2,75 % pero 5,5 EUR");
assert.equal(checkDrop(200, 196, "EUR").hit, false, "2 % y 4 EUR");
assert.equal(checkDrop(50000, 49500, "CLP").hit, false, "500 CLP son 0,46 EUR, no 500");
assert.equal(checkDrop(50000, 47000, "CLP").hit, true, "6 % en CLP");
assert.equal(checkDrop(100, 100, "EUR").hit, false);
assert.equal(checkDrop(100, 120, "EUR").hit, false, "una subida no avisa");

// --- Referencia: se fija una vez, solo baja al avisar, las bajadas pequeñas se acumulan ---
assert.deepStrictEqual(nextReference(undefined, 80, "EUR"), { ref: 80, alert: false }, "primera vez: solo guarda");
let ref = 100;
for (const price of [98, 96.5]) {
  const r = nextReference(ref, price, "EUR");
  assert.equal(r.alert, false);
  ref = r.ref;
}
assert.equal(ref, 100, "las bajadas pequeñas no mueven la referencia");
const hit = nextReference(ref, 94.9, "EUR");
assert.deepStrictEqual(hit, { ref: 94.9, alert: true }, "acumuladas suman 5,1 %: avisa y baja la referencia");
assert.deepStrictEqual(nextReference(94.9, 120, "EUR"), { ref: 94.9, alert: false }, "una subida no la mueve");
assert.equal(nextReference(94.9, 94.0, "EUR").alert, false, "tras avisar, vuelve a contar desde el nuevo precio");

// --- Resumen: hasta 5, las mayores bajadas primero ---
const picked = pickDigest([0.06, 0.2, 0.07, 0.5, 0.08, 0.09, 0.1].map((pct) => ({ pct })));
assert.equal(picked.length, MAX_ITEMS);
assert.deepStrictEqual(picked.map((p) => p.pct), [0.5, 0.2, 0.1, 0.09, 0.08]);

// --- HTML ---
const EVIL = '<script>alert(1)</script> "onerror="x" & Co';
const item = (over: Partial<AlertItem> = {}): AlertItem => ({
  name: "Arsenal Prepartido 2026/27",
  store: "FootStoreES",
  currency: "EUR",
  from: 60,
  to: 50.19,
  url: "https://football-cult.com/es/camiseta/arsenal-prematch-202627",
  image: "https://example.com/a.jpg",
  shipping: "check",
  unsub: "https://football-cult.com/es/alerta-precio?t=AAAAAAAAAAAAAAAAAAAAAAAA",
  related: [{ name: "Arsenal Local 2026/27", price: 89.99, currency: "EUR", url: "https://football-cult.com/es/camiseta/x", image: "https://example.com/b.jpg" }],
  ...over,
});

const VOID = new Set(["meta", "img", "br", "link", "hr", "input"]);
function assertBalanced(html: string) {
  const body = html.replace(/<style[\s\S]*?<\/style>/g, "");
  const stack: string[] = [];
  for (const m of body.matchAll(/<(\/?)([a-z][a-z0-9]*)\b[^>]*>/gi)) {
    const tag = m[2].toLowerCase();
    if (VOID.has(tag)) continue;
    if (m[1]) assert.equal(stack.pop(), tag, `cierre inesperado </${tag}>`);
    else stack.push(tag);
  }
  assert.deepStrictEqual(stack, [], "etiquetas sin cerrar");
}

function assertSafeAndComplete(html: string, text: string, unsubs: string[]) {
  assert.ok(/^<!doctype html>/i.test(html), "doctype");
  assert.ok(/<html lang="\w\w"/.test(html) && /<title>[^<]+<\/title>/.test(html) && html.includes("</html>"));
  assertBalanced(html);
  assert.ok(!/<script/i.test(html), "sin <script");
  assert.ok(!/javascript:/i.test(html), "sin javascript:");
  assert.ok(!(html.match(/<[^>]*>/g) ?? []).some((t) => /\son[a-z]+\s*=/i.test(t)), "sin manejadores on*= dentro de etiquetas");
  assert.ok(!/<(iframe|object|embed|form)/i.test(html));
  assert.ok(/utm_source=alerta&amp;utm_medium=email/.test(html), "botón con utm");
  for (const u of unsubs) {
    assert.ok(html.includes(u), `enlace de baja en el HTML: ${u}`);
    assert.ok(text.includes(u), `enlace de baja en el texto: ${u}`);
  }
  assert.ok(/<a [^>]*href="https:\/\/football-cult\.com\/[^"]*utm_source=alerta[^"]*"[^>]*>[^<]*<\/a>/.test(html), "botón a la ficha");
  assert.ok(/utm_source=alerta&utm_medium=email/.test(text), "texto con utm");
}

for (const l of ["es", "en", "pt", "fr", "it"] as Locale[]) {
  const a = item();
  const r = renderAlertEmail(l, [a]);
  assertSafeAndComplete(r.html, r.text, [a.unsub]);
  assert.ok(r.subject.includes("Arsenal Prepartido 2026/27") && r.subject.includes("50,19"), `asunto ${l}: ${r.subject}`);
  assert.ok(r.html.includes("<img") && r.html.includes("Arsenal Local 2026/27"), "foto y relacionadas");
}
assert.equal(renderAlertEmail("es", [item()]).subject, "Bajó Arsenal Prepartido 2026/27: ahora 50,19 €");

// Escapado: el nombre del producto nunca es HTML.
const evil = renderAlertEmail("es", [item({ name: EVIL, related: [{ name: EVIL, price: 1, currency: "EUR", url: "javascript:alert(1)" }] })]);
assertSafeAndComplete(evil.html, evil.text, [item().unsub]);
assert.ok(evil.html.includes("&lt;script&gt;alert(1)&lt;/script&gt; &quot;onerror=&quot;x&quot; &amp; Co"), "nombre escapado");
assert.ok(!evil.subject.includes("\n"));
assert.ok(!renderAlertEmail("es", [item({ name: "uno\r\nBcc: x@y.z" })]).subject.includes("\n"), "sin saltos de línea en el asunto");

// Sin foto, sin <img> de producto ni de relacionadas.
assert.ok(!renderAlertEmail("es", [item({ image: undefined, related: [] })]).html.includes("<img"), "sin imagen");

// Envío: dato real.
assert.ok(renderAlertEmail("es", [item({ shipping: "free" })]).html.includes("envío incluido"));
assert.ok(renderAlertEmail("es", [item({ shipping: "check" })]).html.includes("envío a calcular en la tienda"));
assert.ok(renderAlertEmail("es", [item({ shipping: 3.62 })]).html.replace(/\u00a0/g, " ").includes("+ 3,62 € de envío"));

// Resumen: cada producto con su baja, sin bloque de relacionadas.
const many = Array.from({ length: MAX_ITEMS }, (_, k) => item({ name: `Producto ${k}`, unsub: `https://football-cult.com/es/alerta-precio?t=${String(k).repeat(24)}` }));
const d = renderAlertEmail("es", many);
assertSafeAndComplete(d.html, d.text, many.map((m) => m.unsub));
assert.equal(d.subject, "Han bajado 5 productos que sigues");
assert.ok(!d.html.includes("Otras ofertas parecidas"));

// Pie: motivo del envío y dirección legal.
assert.ok(/aviso-legal/.test(d.html) && /Recibes este email porque pediste/.test(d.html));
assert.ok(!/Rivas-Vaciamadrid|Agatha|Margueirat/.test(d.html + d.text), "el pie no debe llevar nombre ni domicilio del titular");

console.log("check_price_alert_email: OK");
