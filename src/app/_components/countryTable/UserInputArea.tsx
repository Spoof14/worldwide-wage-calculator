"use client";

import { type ChangeEvent } from "react";
import { useBaseline } from "~/app/_hooks/useBaseline";
import { useCountriesTableData } from "~/app/_hooks/useCountriesTableData";
import { formatEuros, stringToNumber } from "~/utils/utils";
import { Input } from "../Input";
import { InputGroup } from "../InputGroup";
import { Select } from "../Select";

export const UserInputArea = () => {
  const countries = useCountriesTableData();
  const {
    country: baselineCountryName,
    rent: baselineRent,
    expenses: baselineExpenses,
    setCountry,
    setRent,
    setExpenses,
  } = useBaseline();

  const baseLineCountry = countries.find(
    (country) => country.country === baselineCountryName,
  );

  const onBaselineCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCountry(e.target.value);
  };

  const moneyAfterAll =
    stringToNumber(baseLineCountry?.netPay ?? 0) -
    12 * baselineRent -
    12 * baselineExpenses;

  return (
    <div className="flex flex-wrap justify-between gap-4">
      <InputGroup>
        <Select
          label="Baseline Country"
          value={baselineCountryName}
          onChange={onBaselineCountryChange}
          className="w-full"
        >
          {countries.map((country) => (
            <option key={country.country} value={country.country}>
              {country.country}
            </option>
          ))}
        </Select>
        <Input
          label="Baseline Expenses (monthly)"
          type="number"
          value={baselineExpenses}
          onChange={(e) => setExpenses(Number(e.target.value))}
        />
        <Input
          label="Baseline Rent (monthly)"
          type="number"
          value={baselineRent}
          onChange={(e) => setRent(Number(e.target.value))}
        />
      </InputGroup>

      <div className="grid gap-2 text-sm text-slate-200">
        <p>Money after tax (Net pay): {baseLineCountry?.netPay}</p>
        <p>Expenses / year: {formatEuros(baselineExpenses * 12)}</p>
        <p>Rent / year: {formatEuros(baselineRent * 12)}</p>
        <p>Left over: {formatEuros(moneyAfterAll)}</p>
        <p className="max-w-md text-slate-400">
          Breakeven COL matches leftover money after rent/expenses. Breakeven
          net matches take-home pay only.
        </p>
      </div>
    </div>
  );
};
