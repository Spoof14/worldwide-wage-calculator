"use client";

import { useBaseline } from "~/app/_hooks/useBaseline";
import { useColumns } from "~/app/_hooks/useColumns";
import { useContinents } from "~/app/_hooks/useContinents";
import { continents, headers } from "~/utils/const";
import { ColumnOptions } from "./ColumnOptions";
import { ContinentOptions } from "./ContinentOptions";
import { UserInputArea } from "./UserInputArea";

export const FiltersPanel = () => {
  const [continentFilters] = useContinents();
  const [columns] = useColumns();
  const { country: baselineCountry } = useBaseline();

  const activeContinents = continents.filter(
    (continent) => continentFilters[continent] !== false,
  );
  const hiddenColumns = headers
    .slice(1)
    .filter(([key]) => columns[key] === false).length;
  const continentLabel =
    activeContinents.length === continents.length
      ? "All continents"
      : activeContinents.length === 0
        ? "No continents"
        : activeContinents.join(", ");
  const columnLabel =
    hiddenColumns === 0
      ? "all columns"
      : `${headers.length - 1 - hiddenColumns} columns`;

  return (
    <details className="rounded-sm border border-slate-700 bg-slate-900/40">
      <summary className="cursor-pointer select-none px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/60">
        Filters
        <span className="ml-2 text-slate-400">
          · {baselineCountry} · {continentLabel} · {columnLabel}
        </span>
      </summary>
      <div className="grid gap-4 border-t border-slate-700 p-3">
        <UserInputArea />
        <ContinentOptions />
        <ColumnOptions />
      </div>
    </details>
  );
};
