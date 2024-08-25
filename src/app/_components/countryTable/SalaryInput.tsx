import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSalary } from "~/app/_hooks/useCountriesTableData";
import { Input } from "../Input";

export const SalaryInput = () => {
  const searchParamSalary = useSalary();
  const [salary, setSalary] = useState(searchParamSalary);
  const router = useRouter();

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    router.push("?salary=" + salary);
  };

  const onEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      router.push("?salary=" + salary);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <span>Salary</span>
      <form className="flex" onSubmit={onSubmit}>
        <Input
          value={salary}
          inputClassName="rounded-r-none"
          onKeyDown={onEnter}
          onChange={(e) => setSalary(e.target.value)}
        />
        <Link
          className="rounded-r-sm bg-slate-800 p-2 hover:bg-slate-600"
          href={"/?salary=" + salary}
        >
          submit
        </Link>
      </form>
    </div>
  );
};
