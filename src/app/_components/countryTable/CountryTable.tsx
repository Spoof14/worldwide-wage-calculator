"use client";

import { useState } from "react";
import { useBaseline } from "~/app/_hooks/useBaseline";
import {
  useCountriesTableData,
  useSalary,
} from "~/app/_hooks/useCountriesTableData";
import { headerHints, headers } from "~/utils/const";
import { type TableData } from "~/utils/types";
import {
  computeBreakevenGross,
  computeBreakevenNetGross,
  formatEuros,
  getSortBy,
  stringToNumber,
} from "~/utils/utils";
import { useColumns } from "../../_hooks/useColumns";

const formatCell = (key: keyof TableData, value: TableData[keyof TableData]) => {
  if (
    key === "breakeven" ||
    key === "breakevenNet" ||
    key === "moneyAfterAll" ||
    key === "expenses" ||
    key === "rent"
  ) {
    return formatEuros(Number(value));
  }
  return String(value);
};

export const CountryTable = () => {
  const [columns] = useColumns();
  const countries = useCountriesTableData();
  const salary = Number(useSalary());
  const baseline = useBaseline();
  const [sortKey, setSortKey] = useState<keyof TableData>("breakevenNet");
  const [ascending, setAscending] = useState(true);

  const baselineCountry = countries.find(
    (country) => country.country === baseline.country,
  );
  const baselineNet = stringToNumber(baselineCountry?.netPay ?? 0);

  const rows = countries.map((country) => {
    const countryNet = stringToNumber(country.netPay);
    return {
      ...country,
      breakeven: computeBreakevenGross({
        salary,
        baselineNet,
        baselineRent: baseline.rent,
        baselineExpenses: baseline.expenses,
        countryNet,
        countryRent: country.rent,
        countryExpenses: country.expenses,
      }),
      breakevenNet: computeBreakevenNetGross({
        salary,
        baselineNet,
        countryNet,
      }),
    };
  });

  const sort = (newSort: keyof TableData) => {
    if (newSort === sortKey) setAscending((oldVal) => !oldVal);
    else {
      setSortKey(newSort);
      setAscending(
        newSort === "breakeven" ||
          newSort === "breakevenNet" ||
          newSort === "country",
      );
    }
  };

  const sortByFunc = getSortBy(ascending, sortKey);
  const sortedData = rows.slice().sort(sortByFunc);

  const visibleHeaders = headers.filter(
    ([header]) => columns[header] !== false,
  );

  return (
    <section className="min-h-56 w-full overflow-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="border-r">#</th>
            {visibleHeaders.map(([key, text]) => (
              <th
                key={key}
                className="border-r hover:cursor-pointer"
                title={headerHints[key]}
                onClick={() => sort(key)}
              >
                {text}
                {sortKey === key ? (ascending ? " ↑" : " ↓") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((data, i) => {
            const isBaseline = data.country === baseline.country;
            return (
              <tr
                className={`p-4 ${isBaseline ? "bg-indigo-950/80" : "even:bg-slate-900"}`}
                key={data.country}
              >
                <td className="p-2">{i + 1}</td>
                {visibleHeaders.map(([key]) => (
                  <td key={key} className="p-2">
                    {key === "country" && isBaseline
                      ? `${data.country} (baseline)`
                      : formatCell(key, data[key])}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};
