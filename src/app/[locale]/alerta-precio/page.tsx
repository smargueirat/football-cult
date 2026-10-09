import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/translations";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import Link from "next/link";
import { getRedis, isRedisConfigured } from "@/lib/redis";
import { readToken } from "@/lib/priceAlerts";

// Página a la que llegan los enlaces de los correos de alerta de precio.
// Con ?t= muestra un botón (la acción va por POST a /api/price-alerts, así
// que un escáner de correo que abre el enlace no confirma ni da de baja a
// nadie). Con ?r= muestra el resultado.
type State = "confirmed" | "unsubscribed" | "invalid" | "error" | "askConfirm" | "askUnsub";
type Copy = Record<State, [string, string]> & { cta: string; confirmBtn: string; unsubBtn: string };
const COPY: Record<Locale, Copy> = {
  es: {
    askConfirm: ["Confirma tu alerta", "Pulsa el botón para activar el aviso por email cuando baje el precio de este producto."],
    askUnsub: ["Darte de baja", "Pulsa el botón para dejar de recibir alertas de precio de este producto."],
    confirmed: ["Alerta activada", "Te avisaremos por email cuando baje el precio. Cada aviso trae un enlace para darte de baja."],
    unsubscribed: ["Te has dado de baja", "No te enviaremos más alertas de precio de este producto y hemos borrado tu email de esta alerta."],
    invalid: ["Enlace no válido", "El enlace ha caducado, ya se usó o no es correcto. Puedes volver a pedir la alerta desde la ficha del producto."],
    error: ["Algo ha fallado", "No hemos podido completar la operación. Inténtalo de nuevo en unos minutos."],
    confirmBtn: "Confirmar alerta",
    unsubBtn: "Darme de baja",
    cta: "Volver a Football Cult",
  },
  en: {
    askConfirm: ["Confirm your alert", "Press the button to get an email when the price of this product drops."],
    askUnsub: ["Unsubscribe", "Press the button to stop getting price alerts for this product."],
    confirmed: ["Alert turned on", "We'll email you when the price drops. Every alert includes an unsubscribe link."],
    unsubscribed: ["You're unsubscribed", "We won't send you any more price alerts for this product, and we've deleted your email from this alert."],
    invalid: ["Invalid link", "This link has expired, was already used or isn't valid. You can ask for the alert again from the product page."],
    error: ["Something went wrong", "We couldn't complete that. Please try again in a few minutes."],
    confirmBtn: "Confirm alert",
    unsubBtn: "Unsubscribe me",
    cta: "Back to Football Cult",
  },
  pt: {
    askConfirm: ["Confirma o teu alerta", "Carrega no botão para receber um e-mail quando o preço deste produto baixar."],
    askUnsub: ["Cancelar alertas", "Carrega no botão para deixar de receber alertas de preço deste produto."],
    confirmed: ["Alerta ativado", "Avisamos-te por e-mail quando o preço baixar. Cada aviso traz um link para cancelar."],
    unsubscribed: ["Subscrição cancelada", "Não te enviaremos mais alertas de preço deste produto e apagámos o teu e-mail deste alerta."],
    invalid: ["Link inválido", "O link expirou, já foi usado ou não está correto. Podes pedir o alerta outra vez na página do produto."],
    error: ["Algo correu mal", "Não foi possível concluir a operação. Tenta de novo daqui a uns minutos."],
    confirmBtn: "Confirmar alerta",
    unsubBtn: "Cancelar a subscrição",
    cta: "Voltar à Football Cult",
  },
  fr: {
    askConfirm: ["Confirmez votre alerte", "Cliquez sur le bouton pour recevoir un e-mail quand le prix de ce produit baisse."],
    askUnsub: ["Se désinscrire", "Cliquez sur le bouton pour ne plus recevoir d'alertes de prix pour ce produit."],
    confirmed: ["Alerte activée", "Nous vous écrirons quand le prix baissera. Chaque alerte contient un lien de désinscription."],
    unsubscribed: ["Désinscription confirmée", "Vous ne recevrez plus d'alertes de prix pour ce produit et nous avons supprimé votre e-mail de cette alerte."],
    invalid: ["Lien non valide", "Ce lien a expiré, a déjà été utilisé ou n'est pas correct. Vous pouvez redemander l'alerte depuis la fiche du produit."],
    error: ["Une erreur est survenue", "Impossible de terminer l'opération. Réessayez dans quelques minutes."],
    confirmBtn: "Confirmer l'alerte",
    unsubBtn: "Me désinscrire",
    cta: "Retour à Football Cult",
  },
  it: {
    askConfirm: ["Conferma il tuo avviso", "Premi il pulsante per ricevere un'email quando il prezzo di questo prodotto scende."],
    askUnsub: ["Cancellati", "Premi il pulsante per non ricevere più avvisi di prezzo per questo prodotto."],
    confirmed: ["Avviso attivato", "Ti scriveremo quando il prezzo scende. Ogni avviso contiene un link per cancellarti."],
    unsubscribed: ["Cancellazione completata", "Non ti invieremo più avvisi di prezzo per questo prodotto e abbiamo cancellato la tua email da questo avviso."],
    invalid: ["Link non valido", "Il link è scaduto, è già stato usato o non è corretto. Puoi richiedere di nuovo l'avviso dalla scheda del prodotto."],
    error: ["Qualcosa è andato storto", "Non è stato possibile completare l'operazione. Riprova tra qualche minuto."],
    confirmBtn: "Conferma avviso",
    unsubBtn: "Cancellami",
    cta: "Torna a Football Cult",
  },
};

async function stateOf(sp: { r?: string; t?: string }): Promise<State> {
  if (sp.t) {
    if (!isRedisConfigured()) return "error";
    try {
      const tok = await readToken(await getRedis(), sp.t);
      return !tok ? "invalid" : tok.a === "c" ? "askConfirm" : "askUnsub";
    } catch {
      return "error";
    }
  }
  return sp.r === "confirmed" || sp.r === "unsubscribed" || sp.r === "error" ? sp.r : "invalid";
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  return { title: `${COPY[locale].askConfirm[0]} | Football Cult`, robots: { index: false, follow: false } };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ r?: string; t?: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const copy = COPY[locale];
  const sp = await searchParams;
  const state = await stateOf(sp);
  const [title, text] = copy[state];
  const ask = state === "askConfirm" || state === "askUnsub";
  const btn = "mt-2 inline-flex items-center gap-2 rounded-full bg-[#1B3B2B] px-5 py-2.5 text-sm font-medium text-[#F3E9C9] transition-colors hover:bg-[#15301f]";
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="font-vintage text-3xl text-[#1B3B2B] sm:text-4xl">{title}</h1>
      <p className="text-[#6b5f47]">{text}</p>
      {ask ? (
        <form method="post" action={`/api/price-alerts?t=${encodeURIComponent(sp.t!)}`}>
          <button type="submit" className={btn}>
            {state === "askConfirm" ? copy.confirmBtn : copy.unsubBtn}
          </button>
        </form>
      ) : (
        <Link href={`/${locale}`} className={btn}>
          {copy.cta}
        </Link>
      )}
    </div>
  );
}
