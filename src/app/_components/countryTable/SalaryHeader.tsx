"use client";

import {
  useCountriesTableData,
  useCurrency,
  useSalary,
} from "~/app/_hooks/useCountriesTableData";
import { formatMoney } from "~/utils/currency";
import { SalaryInput } from "./SalaryInput";

export const SalaryHeader = () => {
  const salary = useSalary();
  const currency = useCurrency();
  const data = useCountriesTableData();
  const displaySalary = formatMoney(Number(salary) || 0, currency);
  const eurHint =
    currency === "EUR"
      ? null
      : ` · ${formatMoney(Number(data.salaryBeforeTax) || 0, "EUR")} used for tax`;

  return (
    <header className="grid gap-2">
      <div>
        <h1 className="text-xl font-semibold">Worldwide wage calculator</h1>
        <p className="max-w-3xl text-sm text-slate-300">
          Compare take-home pay and leftover money across countries for a gross
          salary. Tax includes mandatory social/health contributions. COL is a
          cost-of-living index vs Frankfurt, not a currency amount.
        </p>
      </div>
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-200">
          Results for {displaySalary}
          {eurHint}
        </p>
        <SalaryInput />
      </div>
    </header>
  );
};
