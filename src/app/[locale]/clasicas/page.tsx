import type { Metadata } from "next";
import ClassicHub, { classicMetadata } from "@/components/hubs/ClassicHub";
import { asLocale } from "@/lib/hubPages";

// Portada de clásicas (2007-2019, isClassicKit), ver ClassicHub.
export const revalidate = 86400;

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  return classicMetadata({}, asLocale((await params).locale));
}

export default async function Page({ params }: P) {
  return <ClassicHub spec={{}} locale={asLocale((await params).locale)} />;
}
