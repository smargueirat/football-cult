"use client";

import type { GearListProps } from "@/lib/gearList";
import { useGearList } from "@/lib/useGearList";
import ApparelListClient, { APPAREL_TYPES } from "@/components/ApparelListClient";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function RopaPageClient({ list }: { list: GearListProps }) {
  const items = useGearList(list);
  const { t } = useLanguage();
  return (
    <ApparelListClient
      items={items}
      total={list.total}
      pageTitle={t.ropa.pageTitle}
      pageSubtitle={t.ropa.pageSubtitle}
      types={APPAREL_TYPES}
      typeLabel={(ty) => t.ropa.types[ty as keyof typeof t.ropa.types] ?? ty}
      typeFilterLabel={t.ropa.typeLabel}
      basePath="ropa"
    />
  );
}
