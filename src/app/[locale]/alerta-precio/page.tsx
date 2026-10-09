import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/translations";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import Link from "next/link";

// Página a la que llegan los enlaces de los correos de alerta de precio
// (confirmar alta / darse de baja), ya procesados por GET /api/price-alerts.
type Result = "confirmed" | "unsubscribed" | "invalid" | "error";
const COPY: Record<Locale, Record<Result, [string, string]> & { cta: string }> = {
  es: {
    confirmed: ["Alerta activada", "Te avisaremos por email cuando baje el precio. Cada aviso trae un enlace para darte de baja con un clic."],
    unsubscribed: ["Te has dado de baja", "No te enviaremos más alertas de precio de este producto y hemos borrado tu email de esta alerta."],
    invalid: ["Enlace no válido", "El enlace ha caducado o no es correcto. Puedes volver a pedir la alerta desde la ficha del producto."],
    error: ["Algo ha fallado", "No hemos podido completar la operación. Inténtalo de nuevo en unos minutos."],
    cta: "Volver a Football Cult",
  },
  en: {
    confirmed: ["Alert turned on", "We'll email you when the price drops. Every alert includes a one-click unsubscribe link."],
    unsubscribed: ["You're unsubscribed", "We won't send you any more price alerts for this product, and we've deleted your email from this alert."],
    invalid: ["Invalid link", "This link has expired or isn't valid. You can ask for the alert again from the product page."],
    error: ["Something went wrong", "We couldn't complete that. Please try again in a few minutes."],
    cta: "Back to Football Cult",
  },
  pt: {
    confirmed: ["Alerta ativado", "Avisamos-te por e-mail quando o preço baixar. Cada aviso traz um link para cancelar com um clique."],
    unsubscribed: ["Subscrição cancelada", "Não te enviaremos mais alertas de preço deste produto e apagámos o teu e-mail deste alerta."],
    invalid: ["Link inválido", "O link expirou ou não está correto. Podes pedir o alerta outra vez na página do produto."],
    error: ["Algo correu mal", "Não foi possível concluir a operação. Tenta de novo daqui a uns minutos."],
    cta: "Voltar à Football Cult",
  },
  fr: {
    confirmed: ["Alerte activée", "Nous vous écrirons quand le prix baissera. Chaque alerte contient un lien de désinscription en un clic."],
    unsubscribed: ["Désinscription confirmée", "Vous ne recevrez plus d'alertes de prix pour ce produit et nous avons supprimé votre e-mail de cette alerte."],
    invalid: ["Lien non valide", "Ce lien a expiré ou n'est pas correct. Vous pouvez redemander l'alerte depuis la fiche du produit."],
    error: ["Une erreur est survenue", "Impossible de terminer l'opération. Réessayez dans quelques minutes."],
    cta: "Retour à Football Cult",
  },
  it: {
    confirmed: ["Avviso attivato", "Ti scriveremo quando il prezzo scende. Ogni avviso contiene un link per cancellarti con un clic."],
    unsubscribed: ["Cancellazione completata", "Non ti invieremo più avvisi di prezzo per questo prodotto e abbiamo cancellato la tua email da questo avviso."],
    invalid: ["Link non valido", "Il link è scaduto o non è corretto. Puoi richiedere di nuovo l'avviso dalla scheda del prodotto."],
    error: ["Qualcosa è andato storto", "Non è stato possibile completare l'operazione. Riprova tra qualche minuto."],
    cta: "Torna a Football Cult",
  },
};

const asResult = (r: unknown): Result =>
  r === "confirmed" || r === "unsubscribed" || r === "error" ? r : "invalid";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  return { title: `${COPY[locale].confirmed[0]} | Football Cult`, robots: { index: false, follow: false } };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ r?: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const copy = COPY[locale];
  const [title, text] = copy[asResult((await searchParams).r)];
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="font-vintage text-3xl text-[#1B3B2B] sm:text-4xl">{title}</h1>
      <p className="text-[#6b5f47]">{text}</p>
      <Link
        href={`/${locale}`}
        className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#1B3B2B] px-5 py-2.5 text-sm font-medium text-[#F3E9C9] transition-colors hover:bg-[#15301f]"
      >
        {copy.cta}
      </Link>
    </div>
  );
}
