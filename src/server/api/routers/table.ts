import { load } from "cheerio";
import { z } from "zod";
import colData from "../data/colData.json";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type TableData, type ContinentData } from "~/utils/types";
import { unstable_cache } from "next/cache";

export const tableRouter = createTRPCRouter({
  getData: publicProcedure
    .input(z.string().optional())
    .query(({ input = '70000' }) => {
      return getData(input);
    }),
});

const baseUrl =
  "https://de.talent.com/ajax/taxcal/best-of-countries.php?country=de&language=en";

const continents = ["Asia-Pacific", "Europe", "Africa", "N.%20America"];

async function INTERNAL_getData(salary: string) {
  const continentData = await getContinentData(salary);
  const relevantData = continentData.flatMap(
    makeRelevantContinentData,
  ) as ContinentData[];
  const countries = makeTableData(relevantData);
  return { salaryBeforeTax: salary, countries };
}
export const getData = unstable_cache(INTERNAL_getData, ["getData"], {
  revalidate: 60 * 60 * 24 * 7,
});

async function getContinentData(salary: string) {
  return Promise.all(
    continents.map(async (continent) => {
      const response = await fetch(
        `${baseUrl}&continent=${continent}&salary=${salary}`,
      );
      return response.text();
    }),
  );
}

const makeRelevantContinentData = (continent: string) => {
  const $ = load(continent);
  const continentName = $(".c-card--top").text().trim();
  return $(".c-table__row")
    .toArray()
    .slice(1)
    .map((item) => [
      ...$(item.children, "c-table__td")
        .text()
        .trim()
        .split("\n")
        .map((text) => text.trim()),
      continentName,
    ]);
};

const makeTableData = (continents: ContinentData[]): TableData[] => {
  const frankfurtCol =
    colData.find(({ city }) => city.includes("Frankfurt"))?.colIndex ?? 100;
  const frankfurtRent =
    colData.find(({ city }) => city.includes("Frankfurt"))?.rentIndex ?? 100;

  const countries = continents.map((data) => {
    const [country, netPay, averageTax, bestRank, continent] = data;

    const colCities = colData.filter(({ city }) => city.includes(country));
    const averageCol =
      colCities.reduce((prev, cur) => prev + cur.colIndex, 0) /
      colCities.length;
    const averageRent =
      colCities.reduce((prev, cur) => prev + cur.rentIndex, 0) /
      colCities.length;

    const netPayAsNumber = Number(netPay.replaceAll(/\D/g, ""));
    const expenses = Math.round((averageCol / frankfurtCol) * 1500);
    const rent = Math.round((averageRent / frankfurtRent) * 1000);
    const moneyAfterAll = Math.round(
      netPayAsNumber - rent * 12 - expenses * 12,
    );

    return {
      country,
      netPay,
      averageTax,
      bestRank,
      continent,
      averageRent: averageRent.toFixed(1),
      averageCol: averageCol.toFixed(1),
      expenses,
      rent,
      moneyAfterAll,
    };
  });
  return countries;
};
