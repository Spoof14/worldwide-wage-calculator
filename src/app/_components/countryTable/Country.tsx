import { CountryTable } from "./CountryTable";
import { SalaryHeader } from "./SalaryHeader";
import { UserInputArea } from "./UserInputArea";
import { ColumnOptions } from "./ColumnOptions";

export default function Country() {
  return (
    <>
      <SalaryHeader />
      <UserInputArea />
      <ColumnOptions />
      <CountryTable />
    </>
  );
}
