"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  useCurrency,
  useSalary,
} from "~/app/_hooks/useCountriesTableData";
import { currencies, currencySymbols, type Currency } from "~/utils/currency";

export const SalaryInput = () => {
  const searchParamSalary = useSalary();
  const currency = useCurrency();
  const [salary, setSalary] = useState(searchParamSalary);
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const router = useRouter();

  const href = `/?salary=${encodeURIComponent(salary)}&currency=${selectedCurrency}`;
  const displaySalary =
    salary === "" ? "" : Number(salary).toLocaleString("en-US");

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <form className="flex flex-wrap items-center gap-2" onSubmit={onSubmit}>
      <label className="text-sm text-slate-200" htmlFor="salary-input">
        Gross salary
      </label>
      <div className="flex items-center">
        <span className="rounded-l-sm bg-slate-800 px-2 py-2 text-slate-300">
          {currencySymbols[selectedCurrency]}
        </span>
        <input
          id="salary-input"
          inputMode="numeric"
          autoComplete="off"
          value={displaySalary}
          onChange={(e) => setSalary(e.target.value.replaceAll(/[^\d]/g, ""))}
          className="min-w-28 bg-slate-800 p-2 text-white outline-none"
        />
        <select
          aria-label="Currency"
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value as Currency)}
          className="bg-slate-800 p-2 text-white"
        >
          {currencies.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-r-sm bg-indigo-700 p-2 hover:bg-indigo-600"
        >
          Compare
        </button>
      </div>
    </form>
  );
};
