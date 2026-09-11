"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
// Import directo desde countries.ts (NO desde @/data/products) -- este
// provider envuelve TODO el sitio (layout.tsx de [locale]), así que
// cualquier cosa que importe de products.ts acá arrastra el catálogo
// completo (5.9MB/76 mil líneas) a cada página, hasta una página
// estática como "términos". Medido en el build real (Turbopack): un
// chunk de 5.1MB en 100 de 102 páginas generadas, solo por este import.
// countries/findCountry no dependen de ningún dato de producto, así que
// viven en su propio archivo liviano.
import { Country, CountryCode, countries, findCountry } from "@/data/countries";

interface CountryContextValue {
  countryCode: CountryCode;
  country: Country;
  setCountryCode: (code: CountryCode) => void;
}

const CountryContext = createContext<CountryContextValue | undefined>(undefined);

const STORAGE_KEY = "football-cult-country";
const GEO_COOKIE = "football-cult-geo-country";

function readGeoCookie(): CountryCode | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${GEO_COOKIE}=([^;]*)`));
  return (match?.[1] as CountryCode) ?? null;
}

function detectCountry(): CountryCode {
  const lang = window.navigator.language?.toLowerCase() ?? "";
  if (lang.includes("ar")) return "AR";
  if (lang.includes("mx")) return "MX";
  if (lang.includes("br") || lang.startsWith("pt")) return "BR";
  if (lang.includes("cl")) return "CL";
  if (lang.startsWith("en-gb")) return "GB";
  if (lang.startsWith("en")) return "US";
  if (lang.startsWith("fr")) return "FR";
  return "ES";
}

export function CountryProvider({ children }: { children: ReactNode }) {
  const [countryCode, setCountryCodeState] = useState<CountryCode>("ES");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as CountryCode | null;
    if (stored && countries.some((c) => c.code === stored)) {
      setCountryCodeState(stored);
      return;
    }
    const geo = readGeoCookie();
    if (geo && countries.some((c) => c.code === geo)) {
      setCountryCodeState(geo);
      return;
    }
    setCountryCodeState(detectCountry());
  }, []);

  function setCountryCode(code: CountryCode) {
    setCountryCodeState(code);
    window.localStorage.setItem(STORAGE_KEY, code);
  }

  return (
    <CountryContext.Provider
      value={{ countryCode, country: findCountry(countryCode), setCountryCode }}
    >
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const ctx = useContext(CountryContext);
  if (!ctx) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return ctx;
}
