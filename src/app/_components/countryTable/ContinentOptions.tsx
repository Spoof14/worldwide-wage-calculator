"use client";

import { useContinents } from "~/app/_hooks/useContinents";
import { continents } from "~/utils/const";
import { Input } from "../Input";

export const ContinentOptions = () => {
  const [selected, toggleContinent] = useContinents();

  return (
    <div className="grid gap-2">
      <p className="text-sm text-slate-300">Continents</p>
      <div className="flex flex-wrap gap-4">
        {continents.map((continent) => (
          <Input
            key={continent}
            label={continent}
            type="checkbox"
            name={continent}
            checked={selected[continent] ?? true}
            onChange={toggleContinent}
            className="items-center justify-between max-sm:flex-row"
          />
        ))}
      </div>
    </div>
  );
};
