import { load } from 'cheerio';
import colData from '../data/colData.json';
import { ContinentData, Data, TableData } from './types';

const baseUrl =
  'https://de.talent.com/ajax/taxcal/best-of-countries.php?country=de&language=en';

export async function getData(salary: string): Promise<Data> {
    const salaryString = salary ? `&salary=${salary}` : '';

    try {
        console.time('fetch');
        const continents = (await Promise.all([
            fetch(baseUrl + '&continent=Asia-Pacific' + salaryString),
            fetch(baseUrl + '&continent=Europe' + salaryString),
        ])
            .then(
                async (responses) =>
                    await Promise.all(responses.map((data) => data.text()))
            )
            .then((texts) => {
                console.timeEnd('fetch');

                return texts.flatMap((continent) => {
                    const $ = load(continent);
                    const continentName = $('.c-card--top').text().trim();
                    return $('.c-table__row')
                        .toArray()
                        .slice(1)
                        .map((item) => [
                            ...$(item.children, 'c-table__td')
                                .text()
                                .trim()
                                .split('\n')
                                .map((text) => text.trim()),
                            continentName,
                        ]);
                });
            })) as ContinentData[];
        const countries = makeTableData(continents);
        return { salaryBeforeTax: salary, countries };
    } catch (error) {
        console.error('fetch error', error);
        return { salaryBeforeTax: salary, countries: [] };
    }
}

export const makeTableData = (continents: ContinentData[]): TableData[] => {
    const frankfurtCol =
    colData.find(({ city }) => city.includes('Frankfurt'))?.colIndex ?? 100;
    const frankfurtRent =
    colData.find(({ city }) => city.includes('Frankfurt'))?.rentIndex ?? 100;

    const countries = continents.map((data) => {
        const [country, netPay, averageTax, bestRank, continent] = data;
        const colCities = colData.filter(({ city }) => city.includes(data[0]));
        const averageCol = colCities.reduce((prev, cur) => prev + cur.colIndex, 0) / colCities.length;
        const averageRent = colCities.reduce((prev, cur) => prev + cur.rentIndex, 0) / colCities.length;

        const netPayAsNumber = Number(netPay.replaceAll(/\D/g, ''));
        const expenses = Math.round((averageCol / frankfurtCol) * 12 * 1500);
        const rent = Math.round((averageRent / frankfurtRent) * 12 * 1000);
        const moneyAfterAll = Math.round(netPayAsNumber - rent - expenses);

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
