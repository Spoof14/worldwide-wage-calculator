/**
 * Sweden resident employee tax (2026 rules, simplified).
 *
 * The Global Tax Calculator API currently omits municipal tax for Sweden
 * (notes say ~32% but subnationalTaxes is always 0), which makes a €70k
 * salary look like ~7% tax. We recompute with average municipal tax +
 * jobbskatteavdrag instead.
 */

const PRICE_BASE_AMOUNT = 59_200; // prisbasbelopp 2026
const MUNICIPAL_RATE = 0.3238; // approximate national average 2026
const STATE_THRESHOLD = 643_000; // skiktgräns 2026 (taxable income)
const STATE_RATE = 0.2;
const PENSION_RATE = 0.07;
const PENSION_CAP = 47_100;

export type SwedenTaxResult = {
  grossSek: number;
  netSek: number;
  taxSek: number;
  rate: number;
};

/** Income-dependent basic allowance (grundavdrag), simplified. */
const basicAllowance = (earnedIncome: number) => {
  // High earners converge on the statutory floor (~14.7k in 2026 tables).
  if (earnedIncome >= 3.72 * PRICE_BASE_AMOUNT) return 14_700;
  if (earnedIncome <= 0) return 0;
  return Math.max(14_700, 45_600 - (earnedIncome - 200_000) * 0.1);
};

/** Earned-income tax credit (jobbskatteavdrag) for under-66, 2026 formula. */
const earnedIncomeCredit = (earnedIncome: number, municipalRate: number) => {
  const tier1 = 0.91 * PRICE_BASE_AMOUNT;
  const tier2 = 3.24 * PRICE_BASE_AMOUNT;
  const tier3 = 8.08 * PRICE_BASE_AMOUNT;

  let creditBase: number;
  if (earnedIncome <= tier1) {
    creditBase = 0.916 * earnedIncome;
  } else if (earnedIncome <= tier2) {
    creditBase = 0.916 * tier1 + 0.32 * (earnedIncome - tier1);
  } else if (earnedIncome <= tier3) {
    const atTier2 = 0.916 * tier1 + 0.32 * (tier2 - tier1);
    creditBase = atTier2 + 0.2413 * (earnedIncome - tier2);
  } else {
    const atTier2 = 0.916 * tier1 + 0.32 * (tier2 - tier1);
    creditBase = atTier2 + 0.2413 * (tier3 - tier2);
  }

  return creditBase * municipalRate;
};

export const calculateSwedenTax = (
  grossSek: number,
  municipalRate = MUNICIPAL_RATE,
): SwedenTaxResult => {
  if (!Number.isFinite(grossSek) || grossSek <= 0) {
    return { grossSek: 0, netSek: 0, taxSek: 0, rate: 0 };
  }

  // Pension fee is charged then fully credited, so it does not change net pay.
  void Math.min(grossSek * PENSION_RATE, PENSION_CAP);

  const allowance = basicAllowance(grossSek);
  const taxable = Math.max(0, grossSek - allowance);
  const municipalTax = taxable * municipalRate;
  const stateTax = Math.max(0, taxable - STATE_THRESHOLD) * STATE_RATE;
  const credit = earnedIncomeCredit(grossSek, municipalRate);
  const taxSek = Math.max(0, municipalTax + stateTax - credit);
  const netSek = grossSek - taxSek;
  const rate = taxSek / grossSek;

  return { grossSek, netSek, taxSek, rate };
};
