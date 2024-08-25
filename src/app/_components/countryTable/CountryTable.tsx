"use client";
import React, { useState } from "react";
import { headers } from "~/utils/const";
import { type TableData } from "~/utils/types";
import { getSortBy } from "~/utils/utils";
import { useCountriesTableData } from "../../_hooks/useCountriesTableData";
import { useColumns } from "../../_hooks/useColumns";

export const CountryTable = () => {
  const [columns] = useColumns();
  const countries = useCountriesTableData();
  const [sortKey, setSortKey] = useState<keyof TableData>("netPay");
  const [ascending, setAscending] = useState(false);

  const sort = (newSort: keyof TableData) => {
    if (newSort === sortKey) setAscending((oldVal) => !oldVal);
    setSortKey(newSort);
  };
  const sortByFunc = getSortBy(ascending, sortKey);
  const sortedData = countries.slice().sort(sortByFunc);

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
                onClick={() => sort(key)}
              >
                {text}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((data, i) => (
            <tr className="p-4 even:bg-slate-900" key={data.country}>
              <td className="p-2">{i + 1}</td>
              {visibleHeaders.map(([key]) => (
                <td key={key} className="p-2">
                  {String(data[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
