import { type TableData } from './types';
import { type Currency, formatMoney } from './currency';

export const stringToNumber = (string: string | number) => Number(String(string).replaceAll(/\D/g, ''));
const numberStrings: (keyof TableData)[] = ['netPay', 'averageCol', 'averageTax'];
const numericKeys: (keyof TableData)[] = [
    'expenses',
    'rent',
    'moneyAfterAll',
    'breakeven',
    'breakevenNet',
];

export const formatEuros = (value: number, currency: Currency = 'EUR') =>
    formatMoney(value, currency);

/**
 * Gross salary needed in `country` so leftover money matches the baseline.
 * Uses the country's effective net/gross ratio at the current salary as an approximation.
 */
export const computeBreakevenGross = ({
    salary,
    baselineNet,
    baselineRent,
    baselineExpenses,
    countryNet,
    countryRent,
    countryExpenses,
}: {
    salary: number;
    baselineNet: number;
    baselineRent: number;
    baselineExpenses: number;
    countryNet: number;
    countryRent: number;
    countryExpenses: number;
}) => {
    if (salary <= 0 || countryNet <= 0) return 0;

    const baselineLeftOver =
        baselineNet - 12 * (baselineRent + baselineExpenses);
    const neededNet =
        baselineLeftOver + 12 * (countryRent + countryExpenses);
    const netRatio = countryNet / salary;

    return Math.max(0, Math.round(neededNet / netRatio));
};

/**
 * Gross salary needed in `country` so net pay matches the baseline net pay.
 * Ignores COL, rent, and expenses.
 */
export const computeBreakevenNetGross = ({
    salary,
    baselineNet,
    countryNet,
}: {
    salary: number;
    baselineNet: number;
    countryNet: number;
}) => {
    if (salary <= 0 || countryNet <= 0) return 0;
    return Math.max(0, Math.round((baselineNet * salary) / countryNet));
};

export const getSortBy = (ascending: boolean, key: keyof TableData) => (a: TableData, b: TableData) => {
    const firstVal = ascending ? 1 : -1, secondVal = ascending ? -1 : 1;
    if (numberStrings.includes(key) || numericKeys.includes(key)) {
        return stringToNumber(a[key]) > stringToNumber(b[key]) ? firstVal : secondVal;
    }
    return a[key] > b[key] ? firstVal : secondVal;
};
