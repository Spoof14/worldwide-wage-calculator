/**
 * Swiss mandatory basic health insurance (KVG/LAMal) is paid as a premium,
 * not a payroll tax, so many tax APIs omit it. Adults still must pay it.
 *
 * Source: FOPH 2026 average adult premium CHF 465.30 / month.
 */

const AVERAGE_ADULT_MONTHLY_PREMIUM_CHF = 465.3;

export const swissMandatoryHealthPremiumChf = () =>
  AVERAGE_ADULT_MONTHLY_PREMIUM_CHF * 12;
