"use client";

import {
  useSyncExternalStore,
  type ChangeEventHandler,
  useCallback,
  useMemo,
} from "react";
import { continents, type Continent } from "~/utils/const";

export type ContinentFilters = Record<Continent, boolean>;

export const useContinents = () => {
  const snapshot = useSyncExternalStore(
    subscribeToContinents,
    getContinentsSnapshot,
    () => JSON.stringify(defaultContinents),
  );

  const toggleContinent: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const name = e.target.name as Continent;
      const prev = JSON.parse(getContinentsSnapshot()) as ContinentFilters;
      const next = { ...prev, [name]: !prev[name] };
      const newValue = JSON.stringify(next);
      localStorage.setItem(STORAGE_KEY, newValue);
      window.dispatchEvent(
        new StorageEvent("storage", { key: STORAGE_KEY, newValue }),
      );
    },
    [],
  );

  const selected = useMemo(
    () => JSON.parse(snapshot) as ContinentFilters,
    [snapshot],
  );

  return [selected, toggleContinent] as const;
};

const STORAGE_KEY = "continents-v2";

const subscribeToContinents = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const defaultContinents: ContinentFilters = continents.reduce(
  (acc, continent) => ({ ...acc, [continent]: true }),
  {} as ContinentFilters,
);

const getContinentsSnapshot = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    const defaults = JSON.stringify(defaultContinents);
    localStorage.setItem(STORAGE_KEY, defaults);
    return defaults;
  }

  // Merge so newly added continents default to on.
  const parsed = JSON.parse(saved) as Partial<ContinentFilters>;
  const merged = continents.reduce(
    (acc, continent) => ({
      ...acc,
      [continent]: parsed[continent] ?? true,
    }),
    {} as ContinentFilters,
  );
  return JSON.stringify(merged);
};
