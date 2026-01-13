"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type Currency = "USD" | "NZD" | "AUD" | "EUR" | "GBP";

interface CurrencyContextType {
  currency: Currency;
  currencySymbol: string;
  exchangeRate: number; // Rate relative to USD (1 USD = x Currency)
  countryName: string;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

// Simple hardcoded exchange rates for demo purposes
// In a real app, fetch these from an API
const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  NZD: 1.6,
  AUD: 1.5,
  EUR: 0.92,
  GBP: 0.78,
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  NZD: "NZ$",
  AUD: "A$",
  EUR: "€",
  GBP: "£",
};

const COUNTRY_MAP: Record<string, { currency: Currency; name: string }> = {
  nz: { currency: "NZD", name: "New Zealand" },
  au: { currency: "AUD", name: "Australia" },
  uk: { currency: "GBP", name: "United Kingdom" },
  eu: { currency: "EUR", name: "Europe" },
  // Default/Global
  global: { currency: "USD", name: "Global" },
};

export const CurrencyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [countryName, setCountryName] = useState("Global");

  useEffect(() => {
    // Check if the path starts with a known country code
    // e.g., /nz/trip -> nz
    const pathSegments = pathname?.split("/").filter(Boolean);
    const firstSegment = pathSegments?.[0];

    if (firstSegment && COUNTRY_MAP[firstSegment]) {
      setCurrencyState(COUNTRY_MAP[firstSegment].currency);
      setCountryName(COUNTRY_MAP[firstSegment].name);
    } else {
      // Default to USD/Global if no matching prefix found
      // But we might want to respect user selection if we persist it (not implemented yet)
      setCurrencyState("USD");
      setCountryName("Global");
    }
  }, [pathname]);

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    // Note: Changing currency manually here doesn't change the URL in this simple implementation
    // Ideally, it should redirect to the localized URL
  };

  const value = {
    currency,
    currencySymbol: CURRENCY_SYMBOLS[currency],
    exchangeRate: EXCHANGE_RATES[currency],
    countryName,
    setCurrency,
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
