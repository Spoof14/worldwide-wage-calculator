"use client";
import { useSalary } from "~/app/_hooks/useCountriesTableData";
import { api } from "~/trpc/react";
import { SalaryInput } from "./SalaryInput";

export const SalaryHeader = () => {
  const wage = useSalary();
  const [data] = api.table.getData.useSuspenseQuery(wage);
  return (
    <header className="flex w-full flex-wrap items-center justify-between gap-2">
      COL index and wages for {data?.salaryBeforeTax} euro
      <SalaryInput />
    </header>
  );
};
