
type Country = string;
type NetPay = string;
type AverageTax = string;
type BestRank = string;
export type TableData = {
    country: Country;
    netPay: NetPay;
    averageTax: AverageTax;
    bestRank: BestRank;
    continent: string;
    averageCol: string;
    expenses: number;
    rent: number;
    moneyAfterAll: number;
};
export type TableDataKey = keyof TableData


export type Data = {
    salaryBeforeTax: string;
    countries: TableData[];
};
export type ContinentData = [string, string, string, string, string]

export type Columns = Partial<Record<keyof TableData, boolean>>;

