"use client";

import { ColumnOptions } from "./ColumnOptions";
import { UserInputArea } from "./UserInputArea";

/** Baseline + column controls, collapsed by default to save mobile space. */
export const FiltersPanel = () => {
  return (
    <details className="rounded-sm border border-slate-700 bg-slate-900/40">
      <summary className="cursor-pointer select-none px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/60">
        Filters
      </summary>
      <div className="grid gap-4 border-t border-slate-700 p-3">
        <UserInputArea />
        <ColumnOptions />
      </div>
    </details>
  );
};
