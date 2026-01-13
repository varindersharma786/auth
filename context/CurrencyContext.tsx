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
  setCountry: (countryCode: string) => void;
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
};

export const COUNTRY_MAP: Record<string, { currency: Currency; name: string }> =
  {
    nz: { currency: "NZD", name: "New Zealand" },
    au: { currency: "AUD", name: "Australia" },
    uk: { currency: "GBP", name: "United Kingdom" },
    eu: { currency: "EUR", name: "Europe" },
    us: { currency: "USD", name: "US" },
    india: { currency: "USD", name: "India" }, // Or INR if added
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
  const [exchangeRates, setExchangeRates] = useState<Record<Currency, number>>({
    USD: 1,
    NZD: 1.6,
    AUD: 1.5,
    EUR: 0.92,
    GBP: 0.78,
  });

  // Fetch live exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(
          "https://api.frankfurter.app/latest?from=USD&to=NZD,AUD,EUR,GBP"
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
    // Check if the path starts with a known country code
    // e.g., /nz/trip -> nz
    const pathSegments = pathname?.split("/").filter(Boolean);
    const firstSegment = pathSegments?.[0];

    if (firstSegment && COUNTRY_MAP[firstSegment]) {
      setCurrencyState(COUNTRY_MAP[firstSegment].currency);
      setCountryName(COUNTRY_MAP[firstSegment].name);
    }
  }, [pathname]);

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
  };

  const setCountry = (countryCode: string) => {
    const config = COUNTRY_MAP[countryCode] || COUNTRY_MAP.global;
    setCurrencyState(config.currency);
    setCountryName(config.name);
    // In a real app, this might redirect to /[countryCode]
  };

  const value = {
    currency,
    currencySymbol: CURRENCY_SYMBOLS[currency],
    exchangeRate: exchangeRates[currency],
    countryName,
    setCurrency,
    setCountry,
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
