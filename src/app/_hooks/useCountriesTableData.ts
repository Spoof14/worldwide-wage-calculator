import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";

export const useCountriesTableData = () => {
  const wage = useSalary();
  const [data] = api.table.getData.useSuspenseQuery(
    wage,
    { staleTime: 1000 * 60 * 60 * 24, refetchOnWindowFocus: false },
  );
  return data?.countries ?? [];
};

export const useSalary = () => useSearchParams().get("salary") ?? "70000";
