import { calculateGermanEmployeeSocial } from "./germany";
import { calculateItalianEmployeeInps } from "./italy";
import { calculateSwedenTax } from "./sweden";
import { swissMandatoryHealthPremiumChf } from "./switzerland";

export type TaxBreakdown = {
  incomeTax: number;
  subnationalTaxes: number;
  socialContributions: number;
  surcharges: number;
};

export type TaxApiCountry = {
  country: string;
  countryCode: string;
  originalGross: number;
  originalNet: number;
  originalTax: number;
  exchangeRate?: number;
  tax: {
    rate: number;
    breakdown?: TaxBreakdown;
  };
};

/**
 * Patch known bad upstream tax models before we build the comparison table.
 * Focus: mandatory health / social contributions that affect take-home pay.
 */
export const applyTaxCorrections = <T extends TaxApiCountry>(
  countries: T[],
): T[] => countries.map(correctCountry);

const correctCountry = <T extends TaxApiCountry>(row: T): T => {
  switch (row.countryCode) {
    case "SE":
      return correctSweden(row);
    case "DE":
      return correctGermany(row);
    case "IT":
      return correctItaly(row);
    case "CH":
      return correctSwitzerland(row);
    default:
      return row;
  }
};

const withUpdatedTotals = <T extends TaxApiCountry>(
  row: T,
  originalTax: number,
  breakdown?: TaxBreakdown,
): T => {
  const originalNet = row.originalGross - originalTax;
  const rate = row.originalGross > 0 ? originalTax / row.originalGross : 0;
  return {
    ...row,
    originalNet,
    originalTax,
    tax: {
      ...row.tax,
      rate,
      breakdown: breakdown ?? row.tax.breakdown,
    },
  };
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

/**
 * Upstream charges the full Zusatzbeitrag to the employee; only half is due.
 * Also enforce KV/PV contribution ceilings.
 */
const correctGermany = <T extends TaxApiCountry>(row: T): T => {
  const breakdown = row.tax.breakdown;
  if (!breakdown) return row;

  const correctSocial = calculateGermanEmployeeSocial(row.originalGross);
  const apiSocial = breakdown.socialContributions;
  if (!(apiSocial > correctSocial)) return row;

  const socialOvercharge = apiSocial - correctSocial;
  // Higher API social lowered taxable income; put back an estimated income-tax bite.
  const incomeTaxUnderstated = socialOvercharge * 0.32;
  const originalTax =
    row.originalTax - socialOvercharge + incomeTaxUnderstated;

  return withUpdatedTotals(row, originalTax, {
    ...breakdown,
    socialContributions: correctSocial,
    incomeTax: breakdown.incomeTax + incomeTaxUnderstated,
  });
};

/** Upstream omits employee INPS (~9.19%), which funds SSN healthcare among other benefits. */
const correctItaly = <T extends TaxApiCountry>(row: T): T => {
  const breakdown = row.tax.breakdown;
  const apiSocial = breakdown?.socialContributions ?? 0;
  if (apiSocial > 0) return row;

  const inps = calculateItalianEmployeeInps(row.originalGross);
  const originalTax = row.originalTax + inps;

  return withUpdatedTotals(
    row,
    originalTax,
    breakdown
      ? { ...breakdown, socialContributions: inps }
      : {
          incomeTax: row.originalTax,
          subnationalTaxes: 0,
          socialContributions: inps,
          surcharges: 0,
        },
  );
};

/** Add mandatory KVG adult premium (not a payroll tax, but compulsory). */
const correctSwitzerland = <T extends TaxApiCountry>(row: T): T => {
  const exchangeRate = row.exchangeRate;
  if (!exchangeRate || exchangeRate <= 0) return row;

  const premiumEur = swissMandatoryHealthPremiumChf() / exchangeRate;
  const originalTax = row.originalTax + premiumEur;
  const breakdown = row.tax.breakdown;

  return withUpdatedTotals(
    row,
    originalTax,
    breakdown
      ? {
          ...breakdown,
          socialContributions: breakdown.socialContributions + premiumEur,
        }
      : undefined,
  );
};
