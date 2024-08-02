import { HydrateClient } from "~/trpc/server";
import Country from "./_components/countryTable/Country";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="box-border flex h-screen w-screen flex-col gap-4 bg-gradient-to-b from-[#15162c] to-[#020222] p-4 text-white">
        <Country />
      </main>
    </HydrateClient>
  );
}
