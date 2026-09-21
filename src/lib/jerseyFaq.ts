import type { HubLocale } from "@/data/teamMeta";

// Preguntas frecuentes de la ficha de camiseta (texto visible + FAQPage
// JSON-LD). Las respuestas son guías generales ciertas para cualquier
// camiseta más los datos reales de ESTA ficha (precio más bajo, tiendas,
// tallas en stock) -- nada inventado por producto.
export interface FaqVars {
  team: string;
  type: string;
  season: string;
  price: string; // ya formateado, "" si no hay oferta
  store: string;
  stores: number;
  sizes: string; // "S, M, L" o ""
  showVersionQ: boolean; // fan vs jugador: no aplica a retro/entrenamiento
}

interface Qa {
  q: string;
  a: string;
}

export const FAQ_TITLE: Record<HubLocale, string> = {
  es: "Preguntas frecuentes",
  en: "Frequently asked questions",
  pt: "Perguntas frequentes",
  fr: "Questions fréquentes",
  it: "Domande frequenti",
};

export const FAQ_LINKS: Record<HubLocale, { sizes: string; auth: string; team: (t: string) => string }> = {
  es: { sizes: "Guía de tallas", auth: "Guía de autenticidad", team: (t) => `Todas las camisetas de ${t}` },
  en: { sizes: "Size guide", auth: "Authenticity guide", team: (t) => `All ${t} shirts` },
  pt: { sizes: "Guia de tamanhos", auth: "Guia de autenticidade", team: (t) => `Todas as camisas do ${t}` },
  fr: { sizes: "Guide des tailles", auth: "Guide d'authenticité", team: (t) => `Tous les maillots ${t}` },
  it: { sizes: "Guida alle taglie", auth: "Guida all'autenticità", team: (t) => `Tutte le maglie ${t}` },
};

export function buildFaq(locale: HubLocale, v: FaqVars): Qa[] {
  const name = `${v.team} ${v.type} ${v.season}`;
  const out: Qa[] = [];
  if (locale === "es") {
    if (v.price)
      out.push({
        q: `¿Cuánto cuesta la camiseta ${name}?`,
        a: `El precio más bajo hoy es ${v.price} en ${v.store}, comparando ${v.stores} ${v.stores === 1 ? "tienda" : "tiendas"}. Actualizamos los precios todos los días; el precio final y el envío se confirman en la tienda.`,
      });
    out.push({
      q: "¿Qué talle elegir?",
      a: `Las camisetas de fútbol suelen calzar más ajustadas en la versión de jugador y más holgadas en la de hincha. Si dudás entre dos talles, elegí el más grande, y compará con una camiseta que ya te quede bien usando la tabla de medidas de la tienda.${v.sizes ? ` Talles disponibles hoy: ${v.sizes}.` : ""}`,
    });
    if (v.showVersionQ)
      out.push({
        q: "¿Cuál es la diferencia entre la versión fan y la de jugador?",
        a: "La versión fan (réplica o \"stadium\") tiene un corte más suelto y materiales pensados para el uso diario. La versión de jugador (\"authentic\" o \"match\") tiene corte ajustado, tejidos más livianos y detalles como escudos termosellados, y suele costar bastante más. La ficha de cada tienda indica cuál vende.",
      });
    out.push({
      q: "¿Cómo sé si la camiseta es original?",
      a: "Fijate en la tienda que la vende y en lo que dice su ficha (licencia oficial, marca fabricante). En nuestra guía de autenticidad explicamos qué revisar antes de comprar.",
    });
    out.push({
      q: "¿Hacen envíos a mi país?",
      a: "Depende de cada tienda. En la comparación mostramos el costo de envío calculado para tu país cuando está disponible, y las tiendas que no envían ahí no cuentan en el precio.",
    });
  } else if (locale === "en") {
    if (v.price)
      out.push({
        q: `How much does the ${name} shirt cost?`,
        a: `The lowest price today is ${v.price} at ${v.store}, comparing ${v.stores} ${v.stores === 1 ? "store" : "stores"}. Prices are updated every day; the final price and shipping are confirmed at the store.`,
      });
    out.push({
      q: "Which size should I choose?",
      a: `Football shirts usually fit tighter in the player version and looser in the fan version. If you are between two sizes, go for the larger one, and compare with a shirt that already fits you using the store's size chart.${v.sizes ? ` Sizes available today: ${v.sizes}.` : ""}`,
    });
    if (v.showVersionQ)
      out.push({
        q: "What is the difference between the fan and the player version?",
        a: "The fan version (replica or \"stadium\") has a looser cut and materials made for everyday wear. The player version (\"authentic\" or \"match\") has a slim cut, lighter fabrics and details such as heat-sealed badges, and usually costs a lot more. Each store's listing says which one it sells.",
      });
    out.push({
      q: "How do I know the shirt is genuine?",
      a: "Check the store selling it and what its listing says (official licence, manufacturer brand). Our authenticity guide explains what to look at before you buy.",
    });
    out.push({
      q: "Do stores ship to my country?",
      a: "It depends on each store. In the comparison we show the shipping cost calculated for your country when available, and stores that do not ship there are left out of the price.",
    });
  } else if (locale === "pt") {
    if (v.price)
      out.push({
        q: `Quanto custa a camisa ${name}?`,
        a: `O menor preço hoje é ${v.price} em ${v.store}, comparando ${v.stores} ${v.stores === 1 ? "loja" : "lojas"}. Atualizamos os preços todos os dias; o preço final e o frete são confirmados na loja.`,
      });
    out.push({
      q: "Que tamanho escolher?",
      a: `As camisas de futebol costumam ficar mais justas na versão jogador e mais folgadas na versão torcedor. Se estiver entre dois tamanhos, escolha o maior e compare com uma camisa que já lhe sirva usando a tabela de medidas da loja.${v.sizes ? ` Tamanhos disponíveis hoje: ${v.sizes}.` : ""}`,
    });
    if (v.showVersionQ)
      out.push({
        q: "Qual é a diferença entre a versão torcedor e a versão jogador?",
        a: "A versão torcedor (réplica ou \"stadium\") tem corte mais solto e materiais pensados para o uso diário. A versão jogador (\"authentic\" ou \"match\") tem corte ajustado, tecidos mais leves e detalhes como escudos termosselados, e costuma custar bem mais. A página de cada loja indica qual ela vende.",
      });
    out.push({
      q: "Como saber se a camisa é original?",
      a: "Veja a loja que vende e o que diz a página do produto (licença oficial, marca fabricante). No nosso guia de autenticidade explicamos o que conferir antes de comprar.",
    });
    out.push({
      q: "As lojas enviam para o meu país?",
      a: "Depende de cada loja. Na comparação mostramos o frete calculado para o seu país quando disponível, e as lojas que não enviam para lá ficam fora do preço.",
    });
  } else if (locale === "fr") {
    if (v.price)
      out.push({
        q: `Combien coûte le maillot ${name} ?`,
        a: `Le prix le plus bas aujourd'hui est ${v.price} chez ${v.store}, en comparant ${v.stores} ${v.stores === 1 ? "boutique" : "boutiques"}. Les prix sont mis à jour chaque jour ; le prix final et la livraison sont confirmés en boutique.`,
      });
    out.push({
      q: "Quelle taille choisir ?",
      a: `Les maillots de football taillent souvent plus près du corps en version joueur et plus large en version supporter. Si vous hésitez entre deux tailles, prenez la plus grande et comparez avec un maillot qui vous va déjà grâce au guide des tailles de la boutique.${v.sizes ? ` Tailles disponibles aujourd'hui : ${v.sizes}.` : ""}`,
    });
    if (v.showVersionQ)
      out.push({
        q: "Quelle est la différence entre la version supporter et la version joueur ?",
        a: "La version supporter (réplique ou \"stadium\") a une coupe plus ample et des matières pensées pour un usage quotidien. La version joueur (\"authentic\" ou \"match\") a une coupe ajustée, des tissus plus légers et des détails comme des écussons thermocollés, et coûte en général beaucoup plus cher. La fiche de chaque boutique indique laquelle elle vend.",
      });
    out.push({
      q: "Comment savoir si le maillot est authentique ?",
      a: "Regardez la boutique qui le vend et ce que dit sa fiche (licence officielle, marque du fabricant). Notre guide d'authenticité explique quoi vérifier avant d'acheter.",
    });
    out.push({
      q: "Les boutiques livrent-elles dans mon pays ?",
      a: "Cela dépend de chaque boutique. Dans la comparaison, nous affichons les frais de livraison calculés pour votre pays lorsqu'ils sont disponibles, et les boutiques qui n'y livrent pas sont exclues du prix.",
    });
  } else {
    if (v.price)
      out.push({
        q: `Quanto costa la maglia ${name}?`,
        a: `Il prezzo più basso oggi è ${v.price} da ${v.store}, confrontando ${v.stores} ${v.stores === 1 ? "negozio" : "negozi"}. I prezzi si aggiornano ogni giorno; prezzo finale e spedizione si confermano nel negozio.`,
      });
    out.push({
      q: "Quale taglia scegliere?",
      a: `Le maglie da calcio calzano di solito più aderenti nella versione giocatore e più ampie in quella tifoso. Se sei indeciso tra due taglie, scegli la più grande e confronta con una maglia che ti sta già bene usando la tabella misure del negozio.${v.sizes ? ` Taglie disponibili oggi: ${v.sizes}.` : ""}`,
    });
    if (v.showVersionQ)
      out.push({
        q: "Qual è la differenza tra la versione tifoso e quella giocatore?",
        a: "La versione tifoso (replica o \"stadium\") ha un taglio più morbido e materiali pensati per l'uso quotidiano. La versione giocatore (\"authentic\" o \"match\") ha taglio aderente, tessuti più leggeri e dettagli come gli stemmi termosaldati, e di solito costa molto di più. La scheda di ogni negozio indica quale vende.",
      });
    out.push({
      q: "Come capisco se la maglia è originale?",
      a: "Guarda il negozio che la vende e cosa dice la scheda (licenza ufficiale, marchio del produttore). La nostra guida all'autenticità spiega cosa controllare prima di acquistare.",
    });
    out.push({
      q: "I negozi spediscono nel mio paese?",
      a: "Dipende dal negozio. Nel confronto mostriamo il costo di spedizione calcolato per il tuo paese quando disponibile, e i negozi che non spediscono lì restano fuori dal prezzo.",
    });
  }
  return out;
}
