import { calculateSwedenTax } from "./sweden";

export type TaxApiCountry = {
  country: string;
  countryCode: string;
  originalGross: number;
  originalNet: number;
  originalTax: number;
  exchangeRate?: number;
  tax: { rate: number };
};

/**
 * Patch known bad upstream tax models before we build the comparison table.
 */
export const applyTaxCorrections = <T extends TaxApiCountry>(
  countries: T[],
): T[] => countries.map(correctCountry);

const correctCountry = <T extends TaxApiCountry>(row: T): T => {
  if (row.countryCode === "SE") {
    return correctSweden(row);
  }
  return row;
};

const correctSweden = <T extends TaxApiCountry>(row: T): T => {
  const exchangeRate = row.exchangeRate;
  if (!exchangeRate || exchangeRate <= 0) return row;

  const grossSek = row.originalGross * exchangeRate;
  const { netSek, taxSek, rate } = calculateSwedenTax(grossSek);

  return {
    ...row,
    originalNet: netSek / exchangeRate,
    originalTax: taxSek / exchangeRate,
    tax: { ...row.tax, rate },
  };
};
