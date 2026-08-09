"use client";

import { BaselineProvider } from "~/app/_hooks/useBaseline";
import { ColumnOptions } from "./ColumnOptions";
import { CountryTable } from "./CountryTable";
import { SalaryHeader } from "./SalaryHeader";
import { UserInputArea } from "./UserInputArea";

export const Calculator = () => {
  return (
    <BaselineProvider>
      <SalaryHeader />
      <UserInputArea />
      <ColumnOptions />
      <CountryTable />
    </BaselineProvider>
  );
};
