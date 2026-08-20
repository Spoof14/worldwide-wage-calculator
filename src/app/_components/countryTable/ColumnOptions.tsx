"use client";

import { useColumns } from "~/app/_hooks/useColumns";
import { headers } from "~/utils/const";
import { Input } from "../Input";

export const ColumnOptions = () => {
  const [columns, toggleColumn] = useColumns();

  return (
    <details className="rounded-sm border border-slate-700 bg-slate-900/40">
      <summary className="cursor-pointer select-none px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/60">
        Columns
      </summary>
      <div className="flex flex-wrap gap-4 border-t border-slate-700 p-3">
        {headers.slice(1).map(([key, value]) => (
          <Input
            key={key}
            label={value}
            type="checkbox"
            name={key}
            checked={columns[key] ?? true}
            onChange={toggleColumn}
            className="items-center justify-between max-sm:flex-row"
          />
        ))}
      </div>
    </details>
  );
};
