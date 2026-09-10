import { Locale } from "@/lib/i18n/translations";

// Separado de products.ts a propósito -- ver el comentario largo en
// CountryContext.tsx. CountryProvider envuelve TODO el sitio (layout.tsx
// de [locale]), así que cualquier cosa que importe desde products.ts ahí
// arrastra el catálogo entero (5.9MB/76 mil líneas) a cada página, hasta
// una página estática como "términos". Country/countries/findCountry no
// dependen de ningún dato de producto -- viven en su propio archivo
// liviano para que el layout global no necesite tocar products.ts.
export type CountryCode =
  // América
  | "AR"
  | "MX"
  | "BR"
  | "CL"
  | "US"
  | "CA"
  | "CO"
  | "PE"
  | "UY"
  | "PY"
  | "BO"
  | "VE"
  | "EC"
  | "CR"
  | "PA"
  | "GT"
  | "HN"
  | "NI"
  | "DO"
  | "CU"
  // Europa
  | "ES"
  | "GB"
  | "FR"
  | "DE"
  | "IT"
  | "PT"
  | "NL"
  | "BE"
  | "AT"
  | "IE"
  | "GR"
  | "FI"
  | "SE"
  | "NO"
  | "DK"
  | "CH"
  | "PL"
  | "CZ"
  | "HU"
  | "RO"
  | "BG"
  | "HR"
  | "SK"
  | "SI"
  | "UA"
  | "IS"
  // Asia
  | "JP"
  | "CN"
  | "KR"
  | "IN"
  | "ID"
  | "SG"
  | "TH"
  | "MY"
  | "PH"
  | "VN"
  | "AE"
  | "SA"
  | "QA"
  | "IL"
  | "TR"
  | "HK"
  | "TW"
  | "PK"
  // Oceanía
  | "AU"
  | "NZ"
  // África
  | "ZA"
  | "NG"
  | "EG"
  | "MA"
  | "KE"
  | "GH"
  | "TN"
  | "DZ";

export interface Country {
  code: CountryCode;
  name: Record<Locale, string>;
  flag: string;
  // Moneda propia del país (informativa). Los precios que se muestran
  // en el sitio son siempre los reales de cada oferta (ver
  // formatOfferMoney), no una conversión a la moneda de este país.
  currency: string;
}

export const countries: Country[] = [
  // --- América ---
  { code: "AR", name: { es: "Argentina", en: "Argentina", pt: "Argentina", fr: "Argentine", it: "Argentina" }, flag: "🇦🇷", currency: "ARS" },
  { code: "MX", name: { es: "México", en: "Mexico", pt: "México", fr: "Mexique", it: "Messico" }, flag: "🇲🇽", currency: "MXN" },
  { code: "BR", name: { es: "Brasil", en: "Brazil", pt: "Brasil", fr: "Brésil", it: "Brasile" }, flag: "🇧🇷", currency: "BRL" },
  { code: "CL", name: { es: "Chile", en: "Chile", pt: "Chile", fr: "Chili", it: "Cile" }, flag: "🇨🇱", currency: "CLP" },
  { code: "US", name: { es: "Estados Unidos", en: "United States", pt: "Estados Unidos", fr: "États-Unis", it: "Stati Uniti" }, flag: "🇺🇸", currency: "USD" },
  { code: "CA", name: { es: "Canadá", en: "Canada", pt: "Canadá", fr: "Canada", it: "Canada" }, flag: "🇨🇦", currency: "CAD" },
  { code: "CO", name: { es: "Colombia", en: "Colombia", pt: "Colômbia", fr: "Colombie", it: "Colombia" }, flag: "🇨🇴", currency: "COP" },
  { code: "PE", name: { es: "Perú", en: "Peru", pt: "Peru", fr: "Pérou", it: "Perù" }, flag: "🇵🇪", currency: "PEN" },
  { code: "UY", name: { es: "Uruguay", en: "Uruguay", pt: "Uruguai", fr: "Uruguay", it: "Uruguay" }, flag: "🇺🇾", currency: "UYU" },
  { code: "PY", name: { es: "Paraguay", en: "Paraguay", pt: "Paraguai", fr: "Paraguay", it: "Paraguay" }, flag: "🇵🇾", currency: "PYG" },
  { code: "BO", name: { es: "Bolivia", en: "Bolivia", pt: "Bolívia", fr: "Bolivie", it: "Bolivia" }, flag: "🇧🇴", currency: "BOB" },
  { code: "VE", name: { es: "Venezuela", en: "Venezuela", pt: "Venezuela", fr: "Venezuela", it: "Venezuela" }, flag: "🇻🇪", currency: "VES" },
  { code: "EC", name: { es: "Ecuador", en: "Ecuador", pt: "Equador", fr: "Équateur", it: "Ecuador" }, flag: "🇪🇨", currency: "USD" },
  { code: "CR", name: { es: "Costa Rica", en: "Costa Rica", pt: "Costa Rica", fr: "Costa Rica", it: "Costa Rica" }, flag: "🇨🇷", currency: "CRC" },
  { code: "PA", name: { es: "Panamá", en: "Panama", pt: "Panamá", fr: "Panama", it: "Panama" }, flag: "🇵🇦", currency: "USD" },
  { code: "GT", name: { es: "Guatemala", en: "Guatemala", pt: "Guatemala", fr: "Guatemala", it: "Guatemala" }, flag: "🇬🇹", currency: "GTQ" },
  { code: "HN", name: { es: "Honduras", en: "Honduras", pt: "Honduras", fr: "Honduras", it: "Honduras" }, flag: "🇭🇳", currency: "HNL" },
  { code: "NI", name: { es: "Nicaragua", en: "Nicaragua", pt: "Nicarágua", fr: "Nicaragua", it: "Nicaragua" }, flag: "🇳🇮", currency: "NIO" },
  { code: "DO", name: { es: "República Dominicana", en: "Dominican Republic", pt: "República Dominicana", fr: "République Dominicaine", it: "Repubblica Dominicana" }, flag: "🇩🇴", currency: "DOP" },
  { code: "CU", name: { es: "Cuba", en: "Cuba", pt: "Cuba", fr: "Cuba", it: "Cuba" }, flag: "🇨🇺", currency: "CUP" },

  // --- Europa ---
  { code: "ES", name: { es: "España", en: "Spain", pt: "Espanha", fr: "Espagne", it: "Spagna" }, flag: "🇪🇸", currency: "EUR" },
  { code: "GB", name: { es: "Reino Unido", en: "United Kingdom", pt: "Reino Unido", fr: "Royaume-Uni", it: "Regno Unito" }, flag: "🇬🇧", currency: "GBP" },
  { code: "FR", name: { es: "Francia", en: "France", pt: "França", fr: "France", it: "Francia" }, flag: "🇫🇷", currency: "EUR" },
  { code: "DE", name: { es: "Alemania", en: "Germany", pt: "Alemanha", fr: "Allemagne", it: "Germania" }, flag: "🇩🇪", currency: "EUR" },
  { code: "IT", name: { es: "Italia", en: "Italy", pt: "Itália", fr: "Italie", it: "Italia" }, flag: "🇮🇹", currency: "EUR" },
  { code: "PT", name: { es: "Portugal", en: "Portugal", pt: "Portugal", fr: "Portugal", it: "Portogallo" }, flag: "🇵🇹", currency: "EUR" },
  { code: "NL", name: { es: "Países Bajos", en: "Netherlands", pt: "Países Baixos", fr: "Pays-Bas", it: "Paesi Bassi" }, flag: "🇳🇱", currency: "EUR" },
  { code: "BE", name: { es: "Bélgica", en: "Belgium", pt: "Bélgica", fr: "Belgique", it: "Belgio" }, flag: "🇧🇪", currency: "EUR" },
  { code: "AT", name: { es: "Austria", en: "Austria", pt: "Áustria", fr: "Autriche", it: "Austria" }, flag: "🇦🇹", currency: "EUR" },
  { code: "IE", name: { es: "Irlanda", en: "Ireland", pt: "Irlanda", fr: "Irlande", it: "Irlanda" }, flag: "🇮🇪", currency: "EUR" },
  { code: "GR", name: { es: "Grecia", en: "Greece", pt: "Grécia", fr: "Grèce", it: "Grecia" }, flag: "🇬🇷", currency: "EUR" },
  { code: "FI", name: { es: "Finlandia", en: "Finland", pt: "Finlândia", fr: "Finlande", it: "Finlandia" }, flag: "🇫🇮", currency: "EUR" },
  { code: "SE", name: { es: "Suecia", en: "Sweden", pt: "Suécia", fr: "Suède", it: "Svezia" }, flag: "🇸🇪", currency: "SEK" },
  { code: "NO", name: { es: "Noruega", en: "Norway", pt: "Noruega", fr: "Norvège", it: "Norvegia" }, flag: "🇳🇴", currency: "NOK" },
  { code: "DK", name: { es: "Dinamarca", en: "Denmark", pt: "Dinamarca", fr: "Danemark", it: "Danimarca" }, flag: "🇩🇰", currency: "DKK" },
  { code: "CH", name: { es: "Suiza", en: "Switzerland", pt: "Suíça", fr: "Suisse", it: "Svizzera" }, flag: "🇨🇭", currency: "CHF" },
  { code: "PL", name: { es: "Polonia", en: "Poland", pt: "Polônia", fr: "Pologne", it: "Polonia" }, flag: "🇵🇱", currency: "PLN" },
  { code: "CZ", name: { es: "República Checa", en: "Czech Republic", pt: "República Tcheca", fr: "République Tchèque", it: "Repubblica Ceca" }, flag: "🇨🇿", currency: "CZK" },
  { code: "HU", name: { es: "Hungría", en: "Hungary", pt: "Hungria", fr: "Hongrie", it: "Ungheria" }, flag: "🇭🇺", currency: "HUF" },
  { code: "RO", name: { es: "Rumania", en: "Romania", pt: "Romênia", fr: "Roumanie", it: "Romania" }, flag: "🇷🇴", currency: "RON" },
  { code: "BG", name: { es: "Bulgaria", en: "Bulgaria", pt: "Bulgária", fr: "Bulgarie", it: "Bulgaria" }, flag: "🇧🇬", currency: "BGN" },
  { code: "HR", name: { es: "Croacia", en: "Croatia", pt: "Croácia", fr: "Croatie", it: "Croazia" }, flag: "🇭🇷", currency: "EUR" },
  { code: "SK", name: { es: "Eslovaquia", en: "Slovakia", pt: "Eslováquia", fr: "Slovaquie", it: "Slovacchia" }, flag: "🇸🇰", currency: "EUR" },
  { code: "SI", name: { es: "Eslovenia", en: "Slovenia", pt: "Eslovênia", fr: "Slovénie", it: "Slovenia" }, flag: "🇸🇮", currency: "EUR" },
  { code: "UA", name: { es: "Ucrania", en: "Ukraine", pt: "Ucrânia", fr: "Ukraine", it: "Ucraina" }, flag: "🇺🇦", currency: "UAH" },
  { code: "IS", name: { es: "Islandia", en: "Iceland", pt: "Islândia", fr: "Islande", it: "Islanda" }, flag: "🇮🇸", currency: "ISK" },

  // --- Asia ---
  { code: "JP", name: { es: "Japón", en: "Japan", pt: "Japão", fr: "Japon", it: "Giappone" }, flag: "🇯🇵", currency: "JPY" },
  { code: "CN", name: { es: "China", en: "China", pt: "China", fr: "Chine", it: "Cina" }, flag: "🇨🇳", currency: "CNY" },
  { code: "KR", name: { es: "Corea del Sur", en: "South Korea", pt: "Coreia do Sul", fr: "Corée du Sud", it: "Corea del Sud" }, flag: "🇰🇷", currency: "KRW" },
  { code: "IN", name: { es: "India", en: "India", pt: "Índia", fr: "Inde", it: "India" }, flag: "🇮🇳", currency: "INR" },
  { code: "ID", name: { es: "Indonesia", en: "Indonesia", pt: "Indonésia", fr: "Indonésie", it: "Indonesia" }, flag: "🇮🇩", currency: "IDR" },
  { code: "SG", name: { es: "Singapur", en: "Singapore", pt: "Singapura", fr: "Singapour", it: "Singapore" }, flag: "🇸🇬", currency: "SGD" },
  { code: "TH", name: { es: "Tailandia", en: "Thailand", pt: "Tailândia", fr: "Thaïlande", it: "Tailandia" }, flag: "🇹🇭", currency: "THB" },
  { code: "MY", name: { es: "Malasia", en: "Malaysia", pt: "Malásia", fr: "Malaisie", it: "Malesia" }, flag: "🇲🇾", currency: "MYR" },
  { code: "PH", name: { es: "Filipinas", en: "Philippines", pt: "Filipinas", fr: "Philippines", it: "Filippine" }, flag: "🇵🇭", currency: "PHP" },
  { code: "VN", name: { es: "Vietnam", en: "Vietnam", pt: "Vietnã", fr: "Viêt Nam", it: "Vietnam" }, flag: "🇻🇳", currency: "VND" },
  { code: "AE", name: { es: "Emiratos Árabes Unidos", en: "United Arab Emirates", pt: "Emirados Árabes Unidos", fr: "Émirats Arabes Unis", it: "Emirati Arabi Uniti" }, flag: "🇦🇪", currency: "AED" },
  { code: "SA", name: { es: "Arabia Saudita", en: "Saudi Arabia", pt: "Arábia Saudita", fr: "Arabie Saoudite", it: "Arabia Saudita" }, flag: "🇸🇦", currency: "SAR" },
  { code: "QA", name: { es: "Catar", en: "Qatar", pt: "Catar", fr: "Qatar", it: "Qatar" }, flag: "🇶🇦", currency: "QAR" },
  { code: "IL", name: { es: "Israel", en: "Israel", pt: "Israel", fr: "Israël", it: "Israele" }, flag: "🇮🇱", currency: "ILS" },
  { code: "TR", name: { es: "Turquía", en: "Turkey", pt: "Turquia", fr: "Turquie", it: "Turchia" }, flag: "🇹🇷", currency: "TRY" },
  { code: "HK", name: { es: "Hong Kong", en: "Hong Kong", pt: "Hong Kong", fr: "Hong Kong", it: "Hong Kong" }, flag: "🇭🇰", currency: "HKD" },
  { code: "TW", name: { es: "Taiwán", en: "Taiwan", pt: "Taiwan", fr: "Taïwan", it: "Taiwan" }, flag: "🇹🇼", currency: "TWD" },
  { code: "PK", name: { es: "Pakistán", en: "Pakistan", pt: "Paquistão", fr: "Pakistan", it: "Pakistan" }, flag: "🇵🇰", currency: "PKR" },

  // --- Oceanía ---
  { code: "AU", name: { es: "Australia", en: "Australia", pt: "Austrália", fr: "Australie", it: "Australia" }, flag: "🇦🇺", currency: "AUD" },
  { code: "NZ", name: { es: "Nueva Zelanda", en: "New Zealand", pt: "Nova Zelândia", fr: "Nouvelle-Zélande", it: "Nuova Zelanda" }, flag: "🇳🇿", currency: "NZD" },

  // --- África ---
  { code: "ZA", name: { es: "Sudáfrica", en: "South Africa", pt: "África do Sul", fr: "Afrique du Sud", it: "Sudafrica" }, flag: "🇿🇦", currency: "ZAR" },
  { code: "NG", name: { es: "Nigeria", en: "Nigeria", pt: "Nigéria", fr: "Nigeria", it: "Nigeria" }, flag: "🇳🇬", currency: "NGN" },
  { code: "EG", name: { es: "Egipto", en: "Egypt", pt: "Egito", fr: "Égypte", it: "Egitto" }, flag: "🇪🇬", currency: "EGP" },
  { code: "MA", name: { es: "Marruecos", en: "Morocco", pt: "Marrocos", fr: "Maroc", it: "Marocco" }, flag: "🇲🇦", currency: "MAD" },
  { code: "KE", name: { es: "Kenia", en: "Kenya", pt: "Quênia", fr: "Kenya", it: "Kenya" }, flag: "🇰🇪", currency: "KES" },
  { code: "GH", name: { es: "Ghana", en: "Ghana", pt: "Gana", fr: "Ghana", it: "Ghana" }, flag: "🇬🇭", currency: "GHS" },
  { code: "TN", name: { es: "Túnez", en: "Tunisia", pt: "Tunísia", fr: "Tunisie", it: "Tunisia" }, flag: "🇹🇳", currency: "TND" },
  { code: "DZ", name: { es: "Argelia", en: "Algeria", pt: "Argélia", fr: "Algérie", it: "Algeria" }, flag: "🇩🇿", currency: "DZD" },
];

export function findCountry(code: CountryCode): Country {
  return countries.find((c) => c.code === code) ?? countries[0];
}
