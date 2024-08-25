import { CountryTable } from "./CountryTable";
import { SalaryHeader } from "./SalaryHeader";
import { UserInputArea } from "./UserInputArea";
import { ColumnOptions } from "./ColumnOptions";
import { api } from "~/trpc/server";

export default function Country() {
  void api.table.getData.prefetch("70000");
  return (
    <>
      <SalaryHeader />
      <UserInputArea />
      <ColumnOptions />
      <CountryTable />
    </>
  );
}
