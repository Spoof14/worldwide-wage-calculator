"use client";

import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import {
  fromEur,
  isCurrency,
  toEur,
  type Currency,
} from "~/utils/currency";

export const useSalary = () => useSearchParams().get("salary") ?? "70000";

export const useCurrency = (): Currency => {
  const value = useSearchParams().get("currency");
  return isCurrency(value) ? value : "EUR";
};

export const useFxRates = () => {
  const [rates] = api.table.getRates.useSuspenseQuery(undefined, {
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
  });
  return rates;
};

export const useSalaryEur = () => {
  const salary = Number(useSalary());
  const currency = useCurrency();
  const rates = useFxRates();
  const amount = Number.isFinite(salary) && salary > 0 ? salary : 70000;
  return String(Math.round(toEur(amount, currency, rates)));
};

export const useMoney = () => {
  const currency = useCurrency();
  const rates = useFxRates();
  const convert = (eurAmount: number) => fromEur(eurAmount, currency, rates);
  return { currency, rates, convert };
};

export const useCountriesTableData = () => {
  const wageEur = useSalaryEur();
  const [data] = api.table.getData.useSuspenseQuery(wageEur, {
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
  });
  return (
    data ?? {
      salaryBeforeTax: wageEur,
      taxYear: "2026",
      countries: [],
    }
  );
};
