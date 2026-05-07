"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Locale, Unit } from "@/lib/types";

type AppState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  compareUnits: Unit[];
  toggleCompare: (unit: Unit) => void;
  clearCompare: () => void;
};

const AppContext = createContext<AppState | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("th");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareUnits, setCompareUnits] = useState<Unit[]>([]);

  useEffect(() => {
    setLocaleState(readStorage<Locale>("pruksa-locale", "th"));
    setFavorites(readStorage<string[]>("pruksa-favorites", []));
  }, []);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem("pruksa-locale", JSON.stringify(nextLocale));
  };

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      window.localStorage.setItem("pruksa-favorites", JSON.stringify(next));
      return next;
    });
  };

  const toggleCompare = (unit: Unit) => {
    setCompareUnits((current) => {
      if (current.some((item) => item.id === unit.id)) return current.filter((item) => item.id !== unit.id);
      return current.length >= 4 ? [...current.slice(1), unit] : [...current, unit];
    });
  };

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      favorites,
      toggleFavorite,
      compareUnits,
      toggleCompare,
      clearCompare: () => setCompareUnits([])
    }),
    [locale, favorites, compareUnits]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProviders");
  return context;
}
