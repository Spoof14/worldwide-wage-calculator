/**
 * Italian private-sector employee INPS contributions (2026).
 *
 * Upstream returns socialContributions: 0 for Italy even though notes say
 * ~9.19% should be deducted. INPS funds pensions and the national health
 * system (SSN), so it must come out of take-home pay.
 */

const INPS_RATE = 0.0919;
const INPS_EXTRA_RATE = 0.01; // additional 1% above first band
const INPS_EXTRA_THRESHOLD = 56_224;
const INPS_CEILING = 122_295;

export const calculateItalianEmployeeInps = (grossEur: number) => {
  if (!Number.isFinite(grossEur) || grossEur <= 0) return 0;

  const capped = Math.min(grossEur, INPS_CEILING);
  const base = Math.min(capped, INPS_EXTRA_THRESHOLD) * INPS_RATE;
  const extra =
    Math.max(0, capped - INPS_EXTRA_THRESHOLD) * (INPS_RATE + INPS_EXTRA_RATE);

  return base + extra;
};
