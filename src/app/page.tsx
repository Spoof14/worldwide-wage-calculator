import { api, HydrateClient } from "~/trpc/server";
import { Suspense } from "react";
import { SalaryHeader } from "./_components/countryTable/SalaryHeader";
import { ColumnOptions } from "./_components/countryTable/ColumnOptions";
import { CountryTable } from "./_components/countryTable/CountryTable";
import { UserInputArea } from "./_components/countryTable/UserInputArea";

type PageProps = {
  searchParams: {
    salary?: string;
  };
};
export default async function Home({ searchParams: { salary } }: PageProps) {
  void api.table.getData.prefetch(salary);
  return (
    <HydrateClient>
      <main className="box-border flex h-screen w-screen flex-col gap-4 bg-gradient-to-b from-[#15162c] to-[#020222] p-4 text-white">
        <Suspense fallback="loading..">
          <SalaryHeader />
          <UserInputArea />
          <ColumnOptions />
          <CountryTable />
        </Suspense>
      </main>
    </HydrateClient>
  );
}
