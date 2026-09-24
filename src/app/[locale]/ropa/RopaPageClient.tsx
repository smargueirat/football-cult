"use client";

import { apparelProducts } from "@/data/apparel";
import ApparelListClient, { APPAREL_TYPES } from "@/components/ApparelListClient";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function RopaPageClient() {
  const { t } = useLanguage();
  return (
    <ApparelListClient
      items={apparelProducts}
      pageTitle={t.ropa.pageTitle}
      pageSubtitle={t.ropa.pageSubtitle}
      types={APPAREL_TYPES}
      typeLabel={(ty) => t.ropa.types[ty as keyof typeof t.ropa.types] ?? ty}
      typeFilterLabel={t.ropa.typeLabel}
      basePath="ropa"
    />
  );
}
