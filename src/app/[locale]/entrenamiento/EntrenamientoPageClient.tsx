"use client";

import type { GearListProps } from "@/lib/gearList";
import { useGearList } from "@/lib/useGearList";
import ApparelListClient from "@/components/ApparelListClient";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { TRAINING_TYPES } from "@/lib/trainingTypes";

export default function EntrenamientoPageClient({ list }: { list: GearListProps }) {
  const items = useGearList(list);
  const { t } = useLanguage();
  return (
    <ApparelListClient
      items={items}
      total={list.total}
      pageTitle={t.entrenamiento.pageTitle}
      pageSubtitle={t.entrenamiento.pageSubtitle}
      types={TRAINING_TYPES}
      typeLabel={(ty) => t.entrenamiento.types[ty as keyof typeof t.entrenamiento.types] ?? ty}
      typeFilterLabel={t.entrenamiento.typeLabel}
      basePath="entrenamiento"
    />
  );
}
