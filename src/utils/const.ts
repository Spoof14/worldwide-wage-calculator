import { type TableDataKey } from './types';

export const headers: [TableDataKey, string][] = [
    ['country', 'Country'],
    ['continent', 'Continent'],
    ['averageTax', 'Tax'],
    ['averageCol', 'COL index'],
    ['netPay', 'Net pay'],
    ['expenses', 'Expenses'],
    ['rent', 'Rent'],
    ['moneyAfterAll', 'Left over'],
    ['breakeven', 'Breakeven COL'],
    ['breakevenNet', 'Breakeven net'],
];

export const headerHints: Partial<Record<TableDataKey, string>> = {
    averageTax:
        'Effective rate of income tax plus mandatory employee social contributions (including health insurance where required)',
    averageCol: 'Cost of living index vs Frankfurt (higher = more expensive)',
    netPay:
        'Annual take-home pay after tax and mandatory social/health contributions',
    expenses: 'Estimated monthly living expenses scaled by COL',
    rent: 'Estimated monthly rent scaled by rent index',
    moneyAfterAll: 'Net pay minus 12× rent and 12× expenses',
    breakeven:
        'Gross salary needed here so leftover money matches the baseline (uses rent/expenses from COL)',
    breakevenNet:
        'Gross salary needed here so net pay matches the baseline (ignores COL/rent/expenses)',
};
