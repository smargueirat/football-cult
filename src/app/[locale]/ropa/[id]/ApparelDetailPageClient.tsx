"use client";

import type { ApparelProduct } from "@/data/apparel";
import GearDetailClient from "@/components/GearDetailClient";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ApparelDetailPageClient({ item }: { item: ApparelProduct }) {
  const { t } = useLanguage();
  return <GearDetailClient item={item} basePath="ropa" sizeLabel={t.search.sizeLabel} />;
}
