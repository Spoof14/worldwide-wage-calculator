import { type TableDataKey } from './types';

export const headers: [TableDataKey, string][] = [
    ['country', 'Country'],
    ['continent', 'Continent'],
    ['averageTax', 'Tax + social'],
    ['averageCol', 'COL'],
    ['netPay', 'Net pay'],
    ['expenses', 'Expenses'],
    ['rent', 'Rent'],
    ['moneyAfterAll', 'Money']
];

/** Hover text for table headers (where used). */
export const headerHints: Partial<Record<TableDataKey, string>> = {
    averageTax:
        'Effective rate of income tax plus mandatory employee social contributions (including health insurance where required)',
    netPay:
        'Annual take-home pay after tax and mandatory social/health contributions',
};