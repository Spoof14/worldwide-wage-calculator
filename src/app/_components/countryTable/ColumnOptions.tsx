"use client";
import { useColumns } from "~/app/_hooks/useColumns";
import { headers } from "~/utils/const";
import { Input } from "../Input";

export const ColumnOptions = () => {
  const [columns, toggleColumn] = useColumns();

  return (
    <div className="flex flex-wrap gap-4">
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
  );
};
