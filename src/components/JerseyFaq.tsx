import Link from "next/link";
import type { Product } from "@/data/products";
import { bestOffer, teamNames, typeNames } from "@/data/products";
import { formatOfferMoney } from "@/lib/offerMoney";
import type { HubLocale } from "@/data/teamMeta";
import { FAQ_LINKS, FAQ_TITLE, buildFaq } from "@/lib/jerseyFaq";
import { JsonLd } from "@/components/hubs/HubParts";

// Bloque de servidor (HTML plano, cero JS de cliente) al pie de la ficha.
export default function JerseyFaq({ product, locale }: { product: Product; locale: HubLocale }) {
  const best = bestOffer(product);
  const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];
  const sizes = Array.from(new Set(product.offers.filter((o) => o.inStock).flatMap((o) => o.sizes)))
    .sort((a, b) => (SIZE_ORDER.indexOf(a) + 1 || 99) - (SIZE_ORDER.indexOf(b) + 1 || 99) || a.localeCompare(b))
    .join(", ");
  const team = teamNames[product.teamKey][locale];
  const faq = buildFaq(locale, {
    team,
    type: typeNames[product.typeKey][locale].toLowerCase(),
    season: product.season,
    price: best ? formatOfferMoney(best.price + best.shipping, best.currency) : "",
    store: best?.store ?? "",
    stores: new Set(product.offers.filter((o) => o.inStock).map((o) => o.store)).size,
    sizes,
    showVersionQ: ["home", "away", "third", "goalkeeper"].includes(product.typeKey),
  });
  const links = FAQ_LINKS[locale];

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <h2 className="font-vintage mb-4 text-xl text-[#1B3B2B] sm:text-2xl">{FAQ_TITLE[locale]}</h2>
      <div className="divide-y divide-[#C9A24B]/25 rounded-2xl border border-[#C9A24B]/35 bg-[#fffdf8]">
        {faq.map((f) => (
          <details key={f.q} className="group p-4 sm:p-5">
            <summary className="cursor-pointer list-none text-sm font-semibold text-[#1B3B2B] sm:text-base">{f.q}</summary>
            <p className="mt-2 text-sm leading-relaxed text-[#675c44]">{f.a}</p>
          </details>
        ))}
      </div>
      <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <Link className="font-medium text-[#1B3B2B] underline" href={`/${locale}/equipo/${product.teamKey}`}>
          {links.team(team)}
        </Link>
        <Link className="font-medium text-[#1B3B2B] underline" href={`/${locale}/guia-de-tallas`}>
          {links.sizes}
        </Link>
        <Link className="font-medium text-[#1B3B2B] underline" href={`/${locale}/autenticidad`}>
          {links.auth}
        </Link>
      </p>
    </section>
  );
}
