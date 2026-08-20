import { api, HydrateClient } from "~/trpc/server";
import { Suspense } from "react";
import { Calculator } from "./_components/countryTable/Calculator";
import { isCurrency, toEur, type Currency } from "~/utils/currency";
import { getRates } from "~/server/api/routers/table";

/** Run this page's server work in Seoul (icn1). */
export const preferredRegion = "icn1";

type PageProps = {
  searchParams: {
    salary?: string;
    currency?: string;
  };
};
export default async function Home({
  searchParams: { salary, currency },
}: PageProps) {
  const rates = await getRates();
  const selectedCurrency: Currency = isCurrency(currency) ? currency : "EUR";
  const salaryAmount = Number(salary) > 0 ? Number(salary) : 70000;
  const salaryEur = String(
    Math.round(toEur(salaryAmount, selectedCurrency, rates)),
  );
  void api.table.getRates.prefetch();
  void api.table.getData.prefetch(salaryEur);
  return (
    <HydrateClient>
      <main className="box-border flex h-screen w-screen flex-col gap-4 overflow-hidden bg-gradient-to-b from-[#15162c] to-[#020222] p-4 text-white">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center text-slate-300">
              Loading comparison…
            </div>
          }
        >
          <Calculator />
        </Suspense>
      </main>
    </HydrateClient>
  );
}