"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useParams, useRouter } from "next/navigation";

export type Currency =
  | "USD"
  | "NZD"
  | "AUD"
  | "EUR"
  | "GBP"
  | "CAD"
  | "ZAR"
  | "CHF";

interface CurrencyContextType {
  currency: Currency;
  currencySymbol: string;
  exchangeRate: number; // Rate relative to USD (1 USD = x Currency)
  countryName: string;
  locale: string;
  setCurrency: (currency: Currency) => void;
  setCountry: (countryCode: string) => void;
  localizeLink: (path: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

// Live exchange rates are now fetched from Frankfurter API

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  NZD: "NZ$",
  AUD: "A$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  ZAR: "R",
  CHF: "CHF",
};

export const COUNTRY_MAP: Record<string, { currency: Currency; name: string }> =
  {
    au: { currency: "AUD", name: "Australia" },
    be: { currency: "EUR", name: "Belgium" },
    ca: { currency: "CAD", name: "Canada" },
    eu: { currency: "EUR", name: "Europe" },
    de: { currency: "EUR", name: "Germany" },
    global: { currency: "USD", name: "Global" },
    ie: { currency: "EUR", name: "Ireland" },
    mt: { currency: "EUR", name: "Malta" },
    nl: { currency: "EUR", name: "Netherlands" },
    nz: { currency: "NZD", name: "New Zealand" },
    za: { currency: "ZAR", name: "South Africa" },
    ch: { currency: "CHF", name: "Switzerland" },
    uk: { currency: "GBP", name: "United Kingdom" },
    us: { currency: "USD", name: "United States" },
  };

export const CurrencyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [countryName, setCountryName] = useState("Global");
  const [exchangeRates, setExchangeRates] = useState<Record<Currency, number>>({
    USD: 1,
    NZD: 1.6,
    AUD: 1.5,
    EUR: 0.92,
    GBP: 0.78,
    CAD: 1.35,
    ZAR: 18.5,
    CHF: 0.88,
  });

  // Fetch live exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(
          "https://api.frankfurter.app/latest?from=USD&to=NZD,AUD,EUR,GBP,CAD,ZAR,CHF"
        );
        if (!response.ok) throw new Error("Failed to fetch rates");
        const data = await response.json();

        setExchangeRates((prev) => ({
          ...prev,
          ...data.rates,
        }));
        console.log("Live exchange rates updated:", data.rates);
      } catch (error) {
        console.error("Error fetching live exchange rates:", error);
      }
    };

    fetchRates();
  }, []);

  useEffect(() => {
    // Sync state with locale from URL params
    const locale = params?.locale as string;

    if (locale && COUNTRY_MAP[locale]) {
      setCurrencyState(COUNTRY_MAP[locale].currency);
      setCountryName(COUNTRY_MAP[locale].name);
    } else if (!locale && pathname === "/") {
      // Handle root path if necessary, but usually handled by redirect
      setCurrencyState("USD");
      setCountryName("Global");
    }
  }, [params, pathname]);

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
  };

  const setCountry = (countryCode: string) => {
    // Update URL to match new country selection
    // We try to preserve the rest of the path if possible
    const segments = pathname.split("/").filter(Boolean);
    const existingLocale = params?.locale as string;

    let newPath = "";
    if (existingLocale) {
      // Replace the first segment (locale)
      newPath = `/${countryCode}/${segments.slice(1).join("/")}`;
    } else {
      // Prepend the new locale
      newPath = `/${countryCode}/${segments.join("/")}`;
    }

    router.push(newPath);
  };

  const localizeLink = (path: string) => {
    const locale = params?.locale as string;
    if (!locale) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    if (cleanPath.startsWith(`/${locale}`)) return cleanPath;
    return `/${locale}${cleanPath}`;
  };

  const value = {
    currency,
    currencySymbol: CURRENCY_SYMBOLS[currency],
    exchangeRate: exchangeRates[currency],
    countryName,
    locale: (params?.locale as string) || "global",
    setCurrency,
    setCountry,
    localizeLink,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
