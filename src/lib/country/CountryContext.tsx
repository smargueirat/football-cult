"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Country, CountryCode, countries, findCountry } from "@/data/products";

interface CountryContextValue {
  countryCode: CountryCode;
  country: Country;
  setCountryCode: (code: CountryCode) => void;
}

const CountryContext = createContext<CountryContextValue | undefined>(undefined);

const STORAGE_KEY = "football-cult-country";

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
