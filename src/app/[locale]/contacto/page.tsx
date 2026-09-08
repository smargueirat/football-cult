import { Metadata } from "next";
import { Locale } from "@/lib/i18n/translations";
import { buildAlternates, isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import ContactoClient from "./ContactoClient";

const META: Record<Locale, { title: string; description?: string }> = {
  es: { title: "Contacto | Football Cult", description: "Escribinos si encontraste un precio desactualizado o una tienda que deberíamos sumar." },
  en: { title: "Contact | Football Cult", description: "Write to us if you found an outdated price or a store we should add." },
  pt: { title: "Contato | Football Cult", description: "Escreva para nós se encontrou um preço desatualizado ou uma loja que deveríamos adicionar." },
  fr: { title: "Contact | Football Cult", description: "Écrivez-nous si vous avez trouvé un prix obsolète ou une boutique que nous devrions ajouter." },
  it: { title: "Contatti | Football Cult", description: "Scrivici se hai trovato un prezzo non aggiornato o un negozio che dovremmo aggiungere." },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  return {
    ...META[locale],
    alternates: buildAlternates(locale, "/contacto"),
  };
}

export default function Page() {
  return <ContactoClient />;
}
