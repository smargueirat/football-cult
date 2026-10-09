import type { HubLocale } from "@/data/teamMeta";
import { trustStats, groupThousands } from "@/lib/trustStrip";
import { archiveDates, verifiedDropRows } from "@/lib/dealsData";
import { longDate } from "@/lib/dealsStrings";

// "Qué es y cómo elige precios" en preguntas y respuestas con cifras del
// catálogo de hoy. Lo usan la home (bloque visible) y /llms.txt: una
// respuesta corta y verificable es lo que un buscador de IA puede citar.
// Cada afirmación describe lo que hace el código (offerOrder.ts,
// priceArchive.ts, jerseyVersion.ts, officialStores.ts), no una promesa.

export interface QA {
  q: string;
  a: string;
}

type F = { n: string; s: number; date: string; drops: number };

const TEXT: Record<HubLocale, { h2: string; qa: (f: F) => QA[] }> = {
  es: {
    h2: "Cómo funciona el comparador",
    qa: ({ n, s, date, drops }) => [
      { q: "¿Qué es Football Cult?", a: `Un comparador de precios independiente de camisetas, botas, guantes de portero, balones, ropa, material de entrenamiento y entradas de fútbol. Hoy compara ${n} productos en ${s} tiendas. No vende nada: cada oferta te lleva a la tienda, donde compras con sus condiciones.` },
      { q: "¿Cómo se elige el mejor precio?", a: "Por precio final con el envío a tu país sumado. Primero van las tiendas que envían a tu país y con el envío medido; luego, de la más barata a la más cara. La comisión que nos paga una tienda solo desempata entre ofertas que cuestan lo mismo (hasta un 1 % de diferencia)." },
      { q: "¿Cada cuánto se actualizan los precios?", a: `Los precios se revisan cada noche. La última revisión es del ${date}.` },
      { q: "¿Qué es una bajada de precio verificada?", a: `Una bajada medida con nuestro propio historial, no con el precio tachado de la tienda: el precio anterior estuvo vigente al menos 5 días y el de hoy es el más bajo de los últimos 30. Hoy hay ${drops}.` },
      { q: "¿Se mezclan la versión jugador y la de aficionado?", a: "No. Cada oferta se clasifica por su nombre real (Authentic, Match, Player issue… frente a Stadium o réplica) y por manga, y el ahorro solo se calcula entre la misma prenda. eBay, Amazon y las tiendas de réplicas se muestran, pero no cuentan para el ahorro." },
    ],
  },
  en: {
    h2: "How the price comparison works",
    qa: ({ n, s, date, drops }) => [
      { q: "What is Football Cult?", a: `An independent price comparison site for football shirts, boots, goalkeeper gloves, balls, apparel, training gear and match tickets. Today it compares ${n} products across ${s} stores. It sells nothing: every offer takes you to the store, where you buy on its terms.` },
      { q: "How is the best price chosen?", a: "By final price including delivery to your country. Stores that ship to your country with measured shipping come first, then cheapest to most expensive. The commission a store pays us only breaks ties between offers that cost the same (within 1%)." },
      { q: "How often are prices updated?", a: `Prices are checked every night. The last check was on ${date}.` },
      { q: "What is a verified price drop?", a: `A drop measured with our own price history, not the store's crossed-out price: the previous price was in place for at least 5 days and today's price is the lowest of the last 30. There are ${drops} today.` },
      { q: "Are player and fan versions mixed?", a: "No. Each offer is classified by its real name (Authentic, Match, Player issue… versus Stadium or replica) and by sleeve length, and savings are only computed for the same garment. eBay, Amazon and replica stores are shown but never count towards savings." },
    ],
  },
  pt: {
    h2: "Como funciona o comparador",
    qa: ({ n, s, date, drops }) => [
      { q: "O que é o Football Cult?", a: `Um comparador de preços independente de camisas, chuteiras, luvas de goleiro, bolas, roupa, material de treino e ingressos de futebol. Hoje compara ${n} produtos em ${s} lojas. Não vende nada: cada oferta leva-te à loja, onde compras nas condições dela.` },
      { q: "Como se escolhe o melhor preço?", a: "Pelo preço final com o envio para o teu país incluído. Primeiro as lojas que enviam para o teu país e com envio medido; depois, da mais barata para a mais cara. A comissão que uma loja nos paga só desempata ofertas que custam o mesmo (até 1% de diferença)." },
      { q: "Com que frequência se atualizam os preços?", a: `Os preços são verificados todas as noites. A última verificação foi a ${date}.` },
      { q: "O que é uma baixa de preço verificada?", a: `Uma baixa medida com o nosso próprio histórico, não com o preço riscado da loja: o preço anterior vigorou pelo menos 5 dias e o de hoje é o mais baixo dos últimos 30. Hoje há ${drops}.` },
      { q: "Misturam a versão jogador e a de torcedor?", a: "Não. Cada oferta é classificada pelo nome real (Authentic, Match, Player issue… contra Stadium ou réplica) e pela manga, e a poupança só se calcula entre a mesma peça. eBay, Amazon e lojas de réplicas aparecem, mas não contam para a poupança." },
    ],
  },
  fr: {
    h2: "Comment fonctionne le comparateur",
    qa: ({ n, s, date, drops }) => [
      { q: "Qu'est-ce que Football Cult ?", a: `Un comparateur de prix indépendant de maillots, chaussures, gants de gardien, ballons, vêtements, matériel d'entraînement et billets de football. Il compare aujourd'hui ${n} produits dans ${s} boutiques. Il ne vend rien : chaque offre vous envoie vers la boutique, où vous achetez selon ses conditions.` },
      { q: "Comment le meilleur prix est-il choisi ?", a: "Selon le prix final, livraison vers votre pays comprise. D'abord les boutiques qui livrent votre pays avec des frais mesurés, puis de la moins chère à la plus chère. La commission versée par une boutique ne départage que des offres au même prix (1 % d'écart maximum)." },
      { q: "À quelle fréquence les prix sont-ils mis à jour ?", a: `Les prix sont contrôlés chaque nuit. Le dernier contrôle date du ${date}.` },
      { q: "Qu'est-ce qu'une baisse de prix vérifiée ?", a: `Une baisse mesurée avec notre propre historique, pas avec le prix barré de la boutique : le prix précédent est resté en place au moins 5 jours et celui du jour est le plus bas des 30 derniers. Il y en a ${drops} aujourd'hui.` },
      { q: "Les versions joueur et supporter sont-elles mélangées ?", a: "Non. Chaque offre est classée selon son vrai nom (Authentic, Match, Player issue… contre Stadium ou réplique) et selon la longueur des manches, et l'économie n'est calculée qu'entre le même vêtement. eBay, Amazon et les boutiques de répliques sont affichés mais ne comptent jamais dans l'économie." },
    ],
  },
  it: {
    h2: "Come funziona il comparatore",
    qa: ({ n, s, date, drops }) => [
      { q: "Che cos'è Football Cult?", a: `Un comparatore di prezzi indipendente di maglie, scarpe, guanti da portiere, palloni, abbigliamento, materiale da allenamento e biglietti di calcio. Oggi confronta ${n} prodotti in ${s} negozi. Non vende nulla: ogni offerta ti porta al negozio, dove compri alle sue condizioni.` },
      { q: "Come si sceglie il prezzo migliore?", a: "In base al prezzo finale con la spedizione nel tuo paese inclusa. Prima i negozi che spediscono nel tuo paese con spedizione misurata, poi dal più economico al più caro. La commissione che ci paga un negozio decide solo tra offerte che costano uguale (fino all'1% di differenza)." },
      { q: "Ogni quanto si aggiornano i prezzi?", a: `I prezzi vengono controllati ogni notte. L'ultimo controllo è del ${date}.` },
      { q: "Che cos'è un ribasso verificato?", a: `Un ribasso misurato con il nostro storico, non con il prezzo barrato del negozio: il prezzo precedente è rimasto in vigore almeno 5 giorni e quello di oggi è il più basso degli ultimi 30. Oggi ce ne sono ${drops}.` },
      { q: "Versione giocatore e tifoso vengono mescolate?", a: "No. Ogni offerta è classificata in base al nome reale (Authentic, Match, Player issue… contro Stadium o replica) e alla manica, e il risparmio si calcola solo tra lo stesso capo. eBay, Amazon e i negozi di repliche si vedono, ma non contano per il risparmio." },
    ],
  },
};

export function siteFaq(locale: HubLocale): { h2: string; qa: QA[] } {
  const t = trustStats();
  return {
    h2: TEXT[locale].h2,
    qa: TEXT[locale].qa({
      n: groupThousands(t.comparedProducts, locale),
      s: t.stores,
      date: longDate(archiveDates().last, locale),
      drops: verifiedDropRows().length,
    }),
  };
}
