"use client";

import NextLink from "next/link";
import { ComponentProps } from "react";
import { useLanguage } from "./LanguageContext";
import { isLocale } from "./locales";

type Props = ComponentProps<typeof NextLink>;

function prefixHref(href: Props["href"], locale: string): Props["href"] {
  if (typeof href !== "string") return href;
  if (
    !href.startsWith("/") ||
    href.startsWith("//") ||
    /^https?:\/\//.test(href)
  ) {
    return href;
  }
  const firstSegment = href.split("/")[1]?.split(/[?#]/)[0];
  if (isLocale(firstSegment)) return href;
  return `/${locale}${href === "/" ? "" : href}`;
}

// Drop-in replacement for next/link that prefixes internal hrefs with the
// current locale -- every page moved under app/[locale] after adding
// hreflang routing, so a bare href="/camiseta/x" would otherwise land on
// a 404 (no un-prefixed routes exist anymore).
export default function Link({ href, ...rest }: Props) {
  const { locale } = useLanguage();
  return <NextLink href={prefixHref(href, locale)} {...rest} />;
}
