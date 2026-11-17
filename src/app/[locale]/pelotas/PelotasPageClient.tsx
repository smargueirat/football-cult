"use client";

import type { GearListProps } from "@/lib/gearList";
import { useGearList } from "@/lib/useGearList";
import GearListClient from "@/components/GearListClient";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PelotasPageClient({ list }: { list: GearListProps }) {
  const items = useGearList(list);
  const { t } = useLanguage();
  return (
    <GearListClient
      items={items}
      total={list.total}
      basePath="pelotas"
      pageTitle={t.pelotas.pageTitle}
      pageSubtitle={t.pelotas.pageSubtitle}
    />
  );
}
