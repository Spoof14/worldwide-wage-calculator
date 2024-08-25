"use client";
import { useState, type ChangeEvent } from "react";
import { useCountriesTableData } from "~/app/_hooks/useCountriesTableData";
import { Input } from "../Input";
import { InputGroup } from "../InputGroup";
import { Select } from "../Select";

export const UserInputArea = () => {
  const countries = useCountriesTableData();
  const [baselineCountryName, setBaselineCountryName] = useState("Germany");
  const baseLineCountry = countries.find(
    (country) => country.country === baselineCountryName,
  );
  const [baselineRent, setBaselineRent] = useState(
    baseLineCountry?.rent ?? 1000,
  );
  const [baselineExpenses, setBaselineExpenses] = useState(
    baseLineCountry?.expenses ?? 1000,
  );

  const setBaselineCountry = (e: ChangeEvent<HTMLSelectElement>) => {
    const country = countries.find(
      (country) => country.country === e.target.value,
    );
    if (!country) return;

    setBaselineRent(country.rent);
    setBaselineExpenses(country.expenses);
    setBaselineCountryName(country.country);
  };

  const moneyAfterAll =
    Number(baseLineCountry?.netPay.replace(/\D+/g, "") ?? 0) -
    12 * baselineRent -
    12 * baselineExpenses;

  return (
    <div className="flex justify-between gap-4">
      <InputGroup>
        <Select
          label="Baseline Country"
          value={baselineCountryName}
          onChange={setBaselineCountry}
          className="w-full"
        >
          {countries.map((country) => (
            <option key={country.country} value={country.country}>
              {country.country}
            </option>
          ))}
        </Select>
        <Input
          label="Baseline Expenses"
          type="number"
          value={baselineExpenses}
          onChange={(e) => setBaselineExpenses(Number(e.target.value))}
        />
        <Input
          label="Baseline Rent"
          type="number"
          value={baselineRent}
          onChange={(e) => setBaselineRent(Number(e.target.value))}
        />
      </InputGroup>

      <div className="grid gap-2">
        <p>Money after tax (Net pay): {baseLineCountry?.netPay}</p>
        <p>Expenses: {baselineExpenses * 12}</p>
        <p>Rent: {baselineRent * 12}</p>
        <p>Money after all: {moneyAfterAll}</p>
      </div>
    </div>
  );
};
