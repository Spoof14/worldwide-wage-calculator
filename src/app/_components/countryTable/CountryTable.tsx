"use client";

import { useState } from "react";
import { useBaseline } from "~/app/_hooks/useBaseline";
import { useContinents } from "~/app/_hooks/useContinents";
import {
  useCountriesTableData,
  useMoney,
  useSalary,
} from "~/app/_hooks/useCountriesTableData";
import { headerHints, headers, type Continent } from "~/utils/const";
import { formatMoney, toEur } from "~/utils/currency";
import { type TableData } from "~/utils/types";
import {
  computeBreakevenGross,
  computeBreakevenNetGross,
  getSortBy,
  stringToNumber,
} from "~/utils/utils";
import { useColumns } from "../../_hooks/useColumns";

export const CountryTable = () => {
  const [columns] = useColumns();
  const [continentFilters] = useContinents();
  const { countries, taxYear } = useCountriesTableData();
  const salaryInput = Number(useSalary());
  const { currency, convert, rates } = useMoney();
  const salaryEur = toEur(
    Number.isFinite(salaryInput) && salaryInput > 0 ? salaryInput : 70000,
    currency,
    rates,
  );
  const baseline = useBaseline();
  const [sortKey, setSortKey] = useState<keyof TableData>("breakevenNet");
  const [ascending, setAscending] = useState(true);
  const [query, setQuery] = useState("");

  const baselineCountry = countries.find(
    (country) => country.country === baseline.country,
  );
  const baselineNet = stringToNumber(baselineCountry?.netPay ?? 0);
  const baselineLeftOver =
    baselineNet - 12 * (baseline.rent + baseline.expenses);

  const rows = countries
    .filter((country) => {
      const continent = country.continent as Continent;
      const continentVisible = continentFilters[continent] !== false;
      const isBaseline = country.country === baseline.country;
      return continentVisible || isBaseline;
    })
    .map((country) => {
      const countryNet = stringToNumber(country.netPay);
      return {
        ...country,
        breakeven: computeBreakevenGross({
          salary: salaryEur,
          baselineNet,
          baselineRent: baseline.rent,
          baselineExpenses: baseline.expenses,
          countryNet,
          countryRent: country.rent,
          countryExpenses: country.expenses,
        }),
        breakevenNet: computeBreakevenNetGross({
          salary: salaryEur,
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
  const needle = query.trim().toLowerCase();
  const filtered = rows
    .slice()
    .sort(sortByFunc)
    .filter((row) => {
      if (!needle) return true;
      if (row.country === baseline.country) return true;
      return row.country.toLowerCase().includes(needle);
    });
  const baselineRow = filtered.find(
    (row) => row.country === baseline.country,
  );
  const sortedData = baselineRow
    ? [baselineRow, ...filtered.filter((row) => row !== baselineRow)]
    : filtered;

  const visibleHeaders = headers.filter(
    ([header]) => columns[header] !== false,
  );

  const formatCell = (
    key: keyof TableData,
    value: TableData[keyof TableData],
  ) => {
    if (
      key === "breakeven" ||
      key === "breakevenNet" ||
      key === "moneyAfterAll" ||
      key === "expenses" ||
      key === "rent"
    ) {
      return formatMoney(convert(Number(value)), currency);
    }
    if (key === "netPay") {
      return formatMoney(convert(stringToNumber(value)), currency);
    }
    return String(value);
  };

  const cellClass = (key: keyof TableData, row: (typeof rows)[number]) => {
    if (row.country === baseline.country) return "";
    if (key === "moneyAfterAll") {
      if (row.moneyAfterAll > baselineLeftOver) return "text-emerald-400";
      if (row.moneyAfterAll < baselineLeftOver) return "text-rose-400";
    }
    if (key === "breakeven" || key === "breakevenNet") {
      const value = Number(row[key]);
      if (value < salaryEur) return "text-emerald-400";
      if (value > salaryEur) return "text-rose-400";
    }
    return "";
  };

  return (
    <section className="flex min-h-[50vh] w-full flex-col gap-2 overflow-auto">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <input
          type="search"
          placeholder="Find a country"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-xs rounded-sm bg-slate-800 p-2 text-sm"
        />
        <p className="text-xs text-slate-400">
          Tax year {taxYear ?? "2026"} · COL snapshot vs Frankfurt
        </p>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 top-0 z-30 w-10 border-r bg-[#15162c] p-2">
              #
            </th>
            {visibleHeaders.map(([key, text], index) => (
              <th
                key={key}
                className={`sticky top-0 z-20 whitespace-nowrap border-r bg-[#15162c] p-2 hover:cursor-pointer ${
                  index === 0 ? "left-10 z-30" : ""
                }`}
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
            const continentHidden =
              continentFilters[data.continent as Continent] === false;
            return (
              <tr
                className={`p-4 ${isBaseline ? "bg-indigo-950" : "even:bg-slate-900 odd:bg-[#0a0b22]"}`}
                key={data.country}
              >
                <td className="sticky left-0 z-10 w-10 bg-inherit p-2">{i + 1}</td>
                {visibleHeaders.map(([key], index) => (
                  <td
                    key={key}
                    className={`whitespace-nowrap p-2 ${cellClass(key, data)} ${
                      index === 0 ? "sticky left-10 z-10 bg-inherit" : ""
                    }`}
                  >
                    {key === "country" && isBaseline
                      ? `${data.country} (baseline${continentHidden ? ", filtered continent" : ""})`
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
