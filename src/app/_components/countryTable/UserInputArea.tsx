"use client";

import { type ChangeEvent } from "react";
import { useBaseline } from "~/app/_hooks/useBaseline";
import {
  useCountriesTableData,
  useCurrency,
  useFxRates,
} from "~/app/_hooks/useCountriesTableData";
import { formatMoney, fromEur, toEur } from "~/utils/currency";
import { stringToNumber } from "~/utils/utils";
import { Input } from "../Input";
import { InputGroup } from "../InputGroup";
import { Select } from "../Select";

export const UserInputArea = () => {
  const { countries } = useCountriesTableData();
  const currency = useCurrency();
  const rates = useFxRates();
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

  const displayRent = Math.round(fromEur(baselineRent, currency, rates));
  const displayExpenses = Math.round(
    fromEur(baselineExpenses, currency, rates),
  );

  return (
    <div className="flex flex-wrap justify-between gap-4">
      <InputGroup>
        <Select
          label="Baseline Country"
          value={baselineCountryName}
          onChange={onBaselineCountryChange}
          className="w-full"
        >
          {countries
            .slice()
            .sort((a, b) => a.country.localeCompare(b.country))
            .map((country) => (
              <option key={country.country} value={country.country}>
                {country.country}
              </option>
            ))}
        </Select>
        <Input
          label={`Baseline expenses / month (${currency})`}
          type="number"
          value={displayExpenses}
          onChange={(e) =>
            setExpenses(toEur(Number(e.target.value), currency, rates))
          }
        />
        <Input
          label={`Baseline rent / month (${currency})`}
          type="number"
          value={displayRent}
          onChange={(e) =>
            setRent(toEur(Number(e.target.value), currency, rates))
          }
        />
      </InputGroup>

      <div className="grid gap-2 text-sm text-slate-200">
        <p>
          Money after tax (Net pay):{" "}
          {formatMoney(
            fromEur(stringToNumber(baseLineCountry?.netPay ?? 0), currency, rates),
            currency,
          )}
        </p>
        <p>
          Expenses / year: {formatMoney(displayExpenses * 12, currency)}
        </p>
        <p>Rent / year: {formatMoney(displayRent * 12, currency)}</p>
        <p>
          Left over:{" "}
          {formatMoney(fromEur(moneyAfterAll, currency, rates), currency)}
        </p>
        <p className="max-w-md text-slate-400">
          Breakeven COL matches leftover money after rent/expenses. Breakeven
          net matches take-home pay only.
        </p>
      </div>
    </div>
  );
};
