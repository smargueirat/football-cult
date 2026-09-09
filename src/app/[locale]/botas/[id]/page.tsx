import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { bootProducts } from "@/data/boots";
import { formatOfferMoney } from "@/data/products";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";

const SITE_URL = "https://football-cult.com";

function findBoot(id: string) {
  return bootProducts.find((p) => p.id === id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, id } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const boot = findBoot(id);
  if (!boot) return {};

  const title = `${boot.model} — Comparar precios | Football Cult`;
  const description = `Compará precios de las ${boot.model} entre distintas tiendas y comprá donde te convenga.`;
  const image = boot.offers[0]?.imageUrl;

  return {
    title,
    description,
    alternates: buildAlternates(locale, `/botas/${boot.id}`),
    openGraph: { title, description, type: "website", images: image ? [image] : undefined },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
  };
}

export default async function BootDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const boot = findBoot(id);
  if (!boot) notFound();

  const sortedOffers = [...boot.offers].sort(
    (a, b) => a.price + a.shipping - (b.price + b.shipping)
  );
  const cheapestTotal = sortedOffers[0].price + sortedOffers[0].shipping;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: boot.model,
    image: boot.offers[0]?.imageUrl ? [boot.offers[0].imageUrl] : undefined,
    url: `${SITE_URL}/${locale}/botas/${boot.id}`,
    brand: { "@type": "Brand", name: boot.brand },
    offers: boot.offers.map((o) => ({
      "@type": "Offer",
      url: o.url,
      price: o.price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: o.store },
    })),
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-3 py-8 sm:px-6">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
          <Image
            src={boot.offers[0].imageUrl}
            alt={boot.model}
            fill
            unoptimized
            className="object-contain p-6"
          />
        </div>
        <div>
          <span className="text-xs uppercase tracking-wide text-[#B8933F]">
            {boot.brand} · {boot.groundType}
          </span>
          <h1 className="font-vintage mt-1 text-2xl text-[#1B3B2B]">{boot.model}</h1>
          <p className="mt-2 text-sm text-[#675c44]">
            Mejor precio: {formatOfferMoney(cheapestTotal, "EUR")} con envío incluido.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            {sortedOffers.map((offer, i) => (
              <div
                key={offer.store}
                className="glass-panel flex items-center justify-between gap-3 rounded-xl border border-[#C9A24B]/25 p-4"
              >
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a]">
                    {offer.store}
                    {i === 0 && (
                      <span className="ml-2 rounded-full bg-[#1B3B2B] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#F3E9C9]">
                        Mejor precio
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-[#675c44]">
                    Tallas EU: {offer.sizes[0]}–{offer.sizes[offer.sizes.length - 1]}
                  </p>
                  <p className="text-xs text-[#675c44]">
                    {formatOfferMoney(offer.price, "EUR")}
                    {offer.shipping > 0
                      ? ` + ${formatOfferMoney(offer.shipping, "EUR")} envío`
                      : " · envío gratis"}
                  </p>
                </div>
                <a
                  href={offer.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="vintage-plaque shrink-0 rounded-xl px-4 py-2 text-sm font-semibold"
                >
                  Ver oferta
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
