"use client";

import { BaselineProvider } from "~/app/_hooks/useBaseline";
import { CountryTable } from "./CountryTable";
import { FiltersPanel } from "./FiltersPanel";
import { SalaryHeader } from "./SalaryHeader";

export const Calculator = () => {
  return (
    <BaselineProvider>
      <SalaryHeader />
      <FiltersPanel />
      <CountryTable />
    </BaselineProvider>
  );
};
