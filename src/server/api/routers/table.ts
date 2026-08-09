import { z } from "zod";
import colData from "../data/colData.json";
import continentsByCode from "../data/continents.json";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  applyTaxCorrections,
  type TaxApiCountry,
} from "~/server/api/tax/corrections";
import { type TableData } from "~/utils/types";
import { unstable_cache } from "next/cache";

const TAX_API_URL = "https://globaltaxcalculator.net/api/calculate";

/** Alternate names so tax API countries match Numbeo-style city strings in colData. */
const COUNTRY_ALIASES: Record<string, string[]> = {
  Czechia: ["Czech Republic"],
  "The Bahamas": ["Bahamas"],
  "Brunei Darussalam": ["Brunei"],
  "Bosnia and Herzegovina": ["Bosnia"],
  Macau: ["Macao", "Macau"],
  "Palestinian territories": ["Palestine"],
  "Timor-Leste": ["Timor"],
  "Cabo Verde": ["Cape Verde"],
  "DR Congo": ["Congo"],
  Congo: ["Congo"],
};

export const tableRouter = createTRPCRouter({
  getData: publicProcedure
    .input(z.string().optional())
    .query(async ({ input = "70000" }) => {
      try {
        return await getData(input);
      } catch (error) {
        console.error("Failed to load wage comparison data", error);
        return { salaryBeforeTax: input, countries: [] as TableData[] };
      }
    }),
});

async function INTERNAL_getData(salary: string) {
  const taxCountries = await fetchTaxCountries(salary);
  const countries = makeTableData(taxCountries);
  return { salaryBeforeTax: salary, countries };
}

export const getData = unstable_cache(INTERNAL_getData, ["getData", "v3"], {
  revalidate: 60 * 60 * 24 * 7,
});

async function fetchTaxCountries(salary: string): Promise<TaxApiCountry[]> {
  const amount = Number(salary);
  if (!Number.isFinite(amount) || amount <= 0) {
    return [];
  }

  const response = await fetch(TAX_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ amount, currency: "EUR" }),
    next: { revalidate: 60 * 60 * 24 * 7 },
  });

  if (!response.ok) {
    throw new Error(
      `Tax API request failed with status ${response.status}`,
    );
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Tax API returned an unexpected response");
  }

  return applyTaxCorrections(data as TaxApiCountry[]);
}

const cityMatchesCountry = (city: string, country: string) => {
  if (city.includes(country)) return true;
  const aliases = COUNTRY_ALIASES[country];
  return aliases?.some((alias) => city.includes(alias)) ?? false;
};

const makeTableData = (taxCountries: TaxApiCountry[]): TableData[] => {
  const frankfurtCol =
    colData.find(({ city }) => city.includes("Frankfurt"))?.colIndex ?? 100;
  const frankfurtRent =
    colData.find(({ city }) => city.includes("Frankfurt"))?.rentIndex ?? 100;

  const countries = taxCountries
    .flatMap((row) => {
      const colCities = colData.filter(({ city }) =>
        cityMatchesCountry(city, row.country),
      );
      if (colCities.length === 0) return [];

      const averageCol =
        colCities.reduce((prev, cur) => prev + cur.colIndex, 0) /
        colCities.length;
      const averageRent =
        colCities.reduce((prev, cur) => prev + cur.rentIndex, 0) /
        colCities.length;

      const netPayAsNumber = Math.round(row.originalNet);
      const expenses = Math.round((averageCol / frankfurtCol) * 1500);
      const rent = Math.round((averageRent / frankfurtRent) * 1000);
      const moneyAfterAll = Math.round(
        netPayAsNumber - rent * 12 - expenses * 12,
      );
      const continent =
        continentsByCode[row.countryCode as keyof typeof continentsByCode] ??
        "Unknown";

      return [
        {
          country: row.country,
          netPay: `€${netPayAsNumber.toLocaleString("de-DE")}`,
          averageTax: `${(row.tax.rate * 100).toFixed(1)}%`,
          bestRank: "0",
          continent,
          averageRent: averageRent.toFixed(1),
          averageCol: averageCol.toFixed(1),
          expenses,
          rent,
          moneyAfterAll,
          breakeven: 0,
          netPayAsNumber,
        },
      ];
    })
    .sort((a, b) => b.netPayAsNumber - a.netPayAsNumber)
    .map(({ netPayAsNumber: _netPayAsNumber, ...row }, index) => ({
      ...row,
      bestRank: String(index + 1),
    }));

  return countries;
};
