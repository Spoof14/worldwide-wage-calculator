import { type TableDataKey } from './types';

export const headers: [TableDataKey, string][] = [
    ['country', 'Country'],
    ['continent', 'Continent'],
    ['averageTax', 'Tax'],
    ['averageCol', 'COL index'],
    ['netPay', 'Net pay'],
    ['expenses', 'Expenses'],
    ['rent', 'Rent'],
<<<<<<< HEAD
    ['moneyAfterAll', 'Money']
];

/** Hover text for table headers (where used). */
export const headerHints: Partial<Record<TableDataKey, string>> = {
    averageTax:
        'Effective rate of income tax plus mandatory employee social contributions (including health insurance where required)',
    netPay:
        'Annual take-home pay after tax and mandatory social/health contributions',
=======
    ['moneyAfterAll', 'Left over'],
    ['breakeven', 'Breakeven'],
];

export const headerHints: Partial<Record<TableDataKey, string>> = {
    averageCol: 'Cost of living index vs Frankfurt (higher = more expensive)',
    netPay: 'Annual take-home pay after tax at your entered gross salary',
    expenses: 'Estimated monthly living expenses scaled by COL',
    rent: 'Estimated monthly rent scaled by rent index',
    moneyAfterAll: 'Net pay minus 12× rent and 12× expenses',
    breakeven:
        'Gross salary needed here to keep the same leftover money as your baseline country',
>>>>>>> dad3ebc (Add breakeven salary column relative to baseline country)
};