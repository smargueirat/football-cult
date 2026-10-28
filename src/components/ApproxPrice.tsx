"use client";

import { useCountry } from "@/lib/country/CountryContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { approxPriceLabel, type OfferCurrencyCode } from "@/lib/offerMoney";

// "≈ 54 EUR" junto a un precio en moneda ajena (USD/GBP/CLP/ARS/BRL/MXN/COP) para el
// país elegido. No se renderiza si el precio ya está en la moneda del visitante.
export default function ApproxPrice({
  amount,
  currency,
  className = "text-[11px] font-normal text-[#675c44]",
}: {
  amount: number;
  currency: OfferCurrencyCode;
  className?: string;
}) {
  const { country } = useCountry();
  const { locale } = useLanguage();
  const label = approxPriceLabel(amount, currency, country.currency, locale);
  return label ? <span className={className}>{label}</span> : null;
}
