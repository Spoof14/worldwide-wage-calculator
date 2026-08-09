"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useCountriesTableData } from "./useCountriesTableData";

type BaselineContextValue = {
  country: string;
  rent: number;
  expenses: number;
  setCountry: (country: string) => void;
  setRent: (rent: number) => void;
  setExpenses: (expenses: number) => void;
};

const BaselineContext = createContext<BaselineContextValue | null>(null);

export const BaselineProvider = ({ children }: { children: ReactNode }) => {
  const countries = useCountriesTableData();
  const defaultCountry =
    countries.find((country) => country.country === "Germany") ?? countries[0];

  const [country, setCountryState] = useState(
    defaultCountry?.country ?? "Germany",
  );
  const [rent, setRent] = useState(defaultCountry?.rent ?? 1000);
  const [expenses, setExpenses] = useState(defaultCountry?.expenses ?? 1000);

  const setCountry = useCallback(
    (nextCountry: string) => {
      const match = countries.find((entry) => entry.country === nextCountry);
      if (!match) return;
      setCountryState(match.country);
      setRent(match.rent);
      setExpenses(match.expenses);
    },
    [countries],
  );

  const value = useMemo(
    () => ({
      country,
      rent,
      expenses,
      setCountry,
      setRent,
      setExpenses,
    }),
    [country, rent, expenses, setCountry],
  );

  return (
    <BaselineContext.Provider value={value}>
      {children}
    </BaselineContext.Provider>
  );
};

export const useBaseline = () => {
  const context = useContext(BaselineContext);
  if (!context) {
    throw new Error("useBaseline must be used within BaselineProvider");
  }
  return context;
};
