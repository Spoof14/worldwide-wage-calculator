/**
 * German employee social contributions (2026), Steuerklasse-agnostic payroll side.
 *
 * Upstream models health Zusatzbeitrag at the full average rate on the employee,
 * but employees only pay half (parity financing). Health/care are also capped at
 * the KV/PV Beitragsbemessungsgrenze.
 */

const PENSION_RATE = 0.093;
const UNEMPLOYMENT_RATE = 0.013;
const HEALTH_BASE_RATE = 0.073;
/** Employee share of average Zusatzbeitrag (2.9% / 2). */
const HEALTH_SUPPLEMENT_EMPLOYEE_RATE = 0.0145;
const CARE_BASE_RATE = 0.017;
/** Childless surcharge paid only by the employee. */
const CARE_CHILDLESS_SURCHARGE = 0.006;

const PENSION_UNEMPLOYMENT_CAP = 101_400;
const HEALTH_CARE_CAP = 69_750;

export const calculateGermanEmployeeSocial = (grossEur: number) => {
  if (!Number.isFinite(grossEur) || grossEur <= 0) return 0;

  const pensionBase = Math.min(grossEur, PENSION_UNEMPLOYMENT_CAP);
  const healthBase = Math.min(grossEur, HEALTH_CARE_CAP);

  return (
    pensionBase * PENSION_RATE +
    pensionBase * UNEMPLOYMENT_RATE +
    healthBase * HEALTH_BASE_RATE +
    healthBase * HEALTH_SUPPLEMENT_EMPLOYEE_RATE +
    healthBase * CARE_BASE_RATE +
    healthBase * CARE_CHILDLESS_SURCHARGE
  );
};
