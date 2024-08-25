import { type TableData } from './types';

export const stringToNumber = (string: string | number) => Number(String(string).replaceAll(/\D/g, ''));
const numberStrings: (keyof TableData)[] = ['netPay', 'averageCol', 'averageTax'];

export const getSortBy = (ascending: boolean, key: keyof TableData) => (a: TableData, b: TableData) => {
    const firstVal = ascending ? 1 : -1, secondVal = ascending ? -1 : 1;
    if(numberStrings.includes(key)) return stringToNumber(a[key]) > stringToNumber(b[key]) ? firstVal : secondVal;
    return a[key] > b[key] ? firstVal : secondVal;
};