import { api, HydrateClient } from "~/trpc/server";
import { Suspense } from "react";
import { Calculator } from "./_components/countryTable/Calculator";

/** Run this page's server work in Seoul (icn1). */
export const preferredRegion = "icn1";

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
          <Calculator />
        </Suspense>
      </main>
    </HydrateClient>
  );
}
