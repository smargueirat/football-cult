import { Locale } from "@/lib/i18n/translations";

// "La Crónica de la Prenda" -- ver .claude/skills/heritage-storytelling.
// A propósito NO es un campo más del catálogo ni algo generado por
// producto: son hechos reales, verificables y citados (final de un
// Mundial, fecha, resultado), curados a mano para un puñado de
// camisetas genuinamente icónicas. Para el resto de los 3670+
// productos no hay entrada acá, y heritageFor() devuelve undefined --
// nunca se inventa una anécdota para completar el hueco.
export interface HeritageEntry {
  text: Record<Locale, string>;
  sourceLabel: string;
  sourceUrl: string;
}

export const heritageByProductId: Record<string, HeritageEntry> = {
  "argentina-retro-2022-home": {
    text: {
      es: "La camiseta con la que Argentina se coronó campeona del mundo el 18 de diciembre de 2022 en el estadio Lusail de Catar: 3-3 ante Francia (dos goles de Messi, hat-trick de Mbappé) y 4-2 en los penales.",
      pt: "A camisa com a qual a Argentina se sagrou campeã do mundo em 18 de dezembro de 2022, no Estádio Lusail, no Catar: 3 a 3 contra a França (dois gols de Messi, hat-trick de Mbappé) e 4 a 2 nos pênaltis.",
      en: "The shirt Argentina wore to become world champions on 18 December 2022 at Lusail Stadium, Qatar — a 3-3 draw with France (two goals from Messi, a hat-trick from Mbappé) settled 4-2 on penalties.",
      fr: "Le maillot avec lequel l'Argentine est devenue championne du monde le 18 décembre 2022 au stade Lusail, au Qatar : 3-3 face à la France (deux buts de Messi, triplé de Mbappé) et 4-2 aux tirs au but.",
      it: "La maglia con cui l'Argentina si è laureata campione del mondo il 18 dicembre 2022 allo stadio di Lusail, in Qatar: 3-3 contro la Francia (doppietta di Messi, tripletta di Mbappé) e 4-2 ai rigori.",
    },
    sourceLabel: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/2022_FIFA_World_Cup_final",
  },
  "brasil-retro-1994-home": {
    text: {
      es: "La camiseta de Brasil en la final del Mundial de Estados Unidos 1994: 0-0 ante Italia en el Rose Bowl de Pasadena el 17 de julio, resuelta 3-2 en los penales.",
      pt: "A camisa do Brasil na final da Copa do Mundo dos Estados Unidos 1994: 0 a 0 contra a Itália, no Rose Bowl de Pasadena, em 17 de julho, decidida por 3 a 2 nos pênaltis.",
      en: "Brazil's shirt from the 1994 World Cup final: a 0-0 draw with Italy at the Rose Bowl in Pasadena on 17 July, decided 3-2 on penalties.",
      fr: "Le maillot du Brésil en finale de la Coupe du Monde 1994 aux États-Unis : 0-0 face à l'Italie au Rose Bowl de Pasadena le 17 juillet, décidé 3-2 aux tirs au but.",
      it: "La maglia del Brasile nella finale dei Mondiali di USA 1994: 0-0 contro l'Italia al Rose Bowl di Pasadena il 17 luglio, decisa 3-2 ai rigori.",
    },
    sourceLabel: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/1994_FIFA_World_Cup_final",
  },
  "francia-retro-1998-home": {
    text: {
      es: "La camiseta con la que Francia ganó su primer Mundial, el 12 de julio de 1998 en el Stade de France: 3-0 a Brasil, con dos goles de cabeza de Zinedine Zidane y el cierre de Emmanuel Petit.",
      pt: "A camisa com a qual a França conquistou sua primeira Copa do Mundo, em 12 de julho de 1998, no Stade de France: 3 a 0 sobre o Brasil, com dois gols de cabeça de Zinedine Zidane e o terceiro de Emmanuel Petit.",
      en: "The shirt France wore to win their first World Cup on 12 July 1998 at the Stade de France: a 3-0 win over Brazil, with two headed goals from Zinedine Zidane and a third from Emmanuel Petit.",
      fr: "Le maillot avec lequel la France a remporté sa première Coupe du Monde, le 12 juillet 1998 au Stade de France : 3-0 face au Brésil, avec un doublé de la tête de Zinedine Zidane et un but d'Emmanuel Petit.",
      it: "La maglia con cui la Francia ha vinto il suo primo Mondiale, il 12 luglio 1998 allo Stade de France: 3-0 sul Brasile, con una doppietta di testa di Zinedine Zidane e il gol di Emmanuel Petit.",
    },
    sourceLabel: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/1998_FIFA_World_Cup_final",
  },
  "alemania-retro-1990-home": {
    text: {
      es: "La camiseta de Alemania Occidental en la final del Mundial de Italia 1990: 1-0 ante Argentina en el Estadio Olímpico de Roma el 8 de julio, con un penal de Andreas Brehme. Fue el último título mundial antes de la reunificación alemana.",
      pt: "A camisa da Alemanha Ocidental na final da Copa do Mundo da Itália 1990: 1 a 0 sobre a Argentina, no Estádio Olímpico de Roma, em 8 de julho, com um pênalti de Andreas Brehme. Foi o último título mundial antes da reunificação alemã.",
      en: "West Germany's shirt from the 1990 World Cup final: a 1-0 win over Argentina at Rome's Stadio Olimpico on 8 July, decided by an Andreas Brehme penalty — their last title before German reunification.",
      fr: "Le maillot de l'Allemagne de l'Ouest en finale de la Coupe du Monde 1990 en Italie : victoire 1-0 face à l'Argentine au Stadio Olimpico de Rome le 8 juillet, sur un penalty d'Andreas Brehme. Ce fut le dernier titre mondial avant la réunification allemande.",
      it: "La maglia della Germania Ovest nella finale dei Mondiali di Italia 1990: 1-0 sull'Argentina allo Stadio Olimpico di Roma l'8 luglio, deciso da un rigore di Andreas Brehme. Fu l'ultimo titolo mondiale prima della riunificazione tedesca.",
    },
    sourceLabel: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/1990_FIFA_World_Cup_final",
  },
  "italia-retro-1994-home": {
    text: {
      es: "La camiseta de Italia en la final del Mundial de 1994: 0-0 ante Brasil en el Rose Bowl, recordada sobre todo por el penal errado de Roberto Baggio en la definición, una de las imágenes más repetidas de la historia del fútbol.",
      pt: "A camisa da Itália na final da Copa do Mundo de 1994: 0 a 0 contra o Brasil no Rose Bowl, lembrada sobretudo pelo pênalti perdido por Roberto Baggio na disputa, uma das imagens mais repetidas da história do futebol.",
      en: "Italy's shirt from the 1994 World Cup final: a 0-0 draw with Brazil at the Rose Bowl, remembered above all for Roberto Baggio's missed penalty in the shootout — one of football's most enduring images.",
      fr: "Le maillot de l'Italie en finale de la Coupe du Monde 1994 : 0-0 face au Brésil au Rose Bowl, resté dans les mémoires surtout pour le penalty manqué de Roberto Baggio lors de la séance de tirs au but, l'une des images les plus répétées de l'histoire du football.",
      it: "La maglia dell'Italia nella finale dei Mondiali del 1994: 0-0 contro il Brasile al Rose Bowl, ricordata soprattutto per il rigore sbagliato da Roberto Baggio ai tiri di rigore, una delle immagini più ricorrenti della storia del calcio.",
    },
    sourceLabel: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/1994_FIFA_World_Cup_final",
  },
};

export function heritageFor(productId: string): HeritageEntry | undefined {
  return heritageByProductId[productId];
}
