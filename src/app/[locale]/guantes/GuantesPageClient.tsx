"use client";

import type { GearListProps } from "@/lib/gearList";
import { useGearList } from "@/lib/useGearList";
import GearListClient from "@/components/GearListClient";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function GuantesPageClient({ list }: { list: GearListProps }) {
  const items = useGearList(list);
  const { t } = useLanguage();
  return (
    <GearListClient
      items={items}
      total={list.total}
      basePath="guantes"
      pageTitle={t.guantes.pageTitle}
      pageSubtitle={t.guantes.pageSubtitle}
    />
  );
}
