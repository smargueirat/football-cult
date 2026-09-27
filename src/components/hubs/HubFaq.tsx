import type { HubLocale } from "@/data/teamMeta";
import { HUB } from "@/lib/hubStrings";
import type { HubFacts } from "@/lib/hubFaq";
import { formatOfferMoney } from "@/lib/offerMoney";

// Bloque de preguntas frecuentes de los hubs, con su FAQPage.
//
// Las respuestas SE VEN en la página, no solo en el JSON-LD: Google exige
// que el contenido marcado esté visible, y además es lo que hace que la
// página valga para una persona. Cada número sale del catálogo en vivo
// (ver hubFaq.ts); una pregunta sin dato real no se dibuja.
//
// La fecha es la del render. Estas páginas son ISR con revalidate de un
// día, así que se regeneran solas y la fecha nunca miente por más de eso.
// Un precio sin fecha no lo cita nadie.
export default function HubFaq({
  locale,
  subject,
  facts,
}: {
  locale: HubLocale;
  /** De qué se habla: el nombre del equipo, de la liga o del país. */
  subject: string;
  facts: HubFacts;
}) {
  const s = HUB[locale];
  const money = (eur: number) => formatOfferMoney(eur, "EUR");

  const qa: { q: string; a: string }[] = [];
  if (facts.cheapest) {
    qa.push({
      q: s.faqPriceQ(subject),
      a: s.faqPriceA({
        price: money(facts.cheapest.eur),
        store: facts.cheapest.store,
        n: facts.count,
        stores: facts.stores,
      }),
    });
    qa.push({
      q: s.faqWhereQ(subject),
      a: s.faqWhereA({ store: facts.cheapest.store, price: money(facts.cheapest.eur) }),
    });
  }
  if (facts.spread) {
    qa.push({
      q: s.faqSaveQ(subject),
      a: s.faqSaveA({
        abs: money(facts.spread.abs),
        pct: facts.spread.pct,
        cheap: facts.spread.cheapStore,
        dear: facts.spread.dearStore,
      }),
    });
  }
  if (facts.seasons) {
    qa.push({
      q: s.faqSeasonsQ(subject),
      a: s.faqSeasonsA({ ...facts.seasons, n: facts.count }),
    });
  }
  if (qa.length === 0) return null;

  // Sin toLocaleString: este Node corre con ICU reducido (solo en-GB) y
  // toLocaleString("es") devuelve la fecha en inglés sin avisar -- mismo
  // problema ya encontrado con los separadores de miles en trustStrip.ts.
  const now = new Date();
  const updated = `${String(now.getUTCDate()).padStart(2, "0")}/${String(
    now.getUTCMonth() + 1
  ).padStart(2, "0")}/${now.getUTCFullYear()}`;

  return (
    <section className="mb-10" id="preguntas">
      <h2 className="font-vintage mb-4 text-xl text-[#1B3B2B] sm:text-2xl">{s.faqTitle}</h2>
      <dl className="max-w-3xl divide-y divide-[#C9A24B]/25 border-y border-[#C9A24B]/25">
        {qa.map(({ q, a }) => (
          <div key={q} className="py-4">
            <dt className="font-card-title text-sm text-[#1B3B2B] sm:text-base">{q}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-[#675c44]">{a}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-[#8a8577]">{s.faqUpdated(updated)}</p>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: qa.map(({ q, a }) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />
    </section>
  );
}
