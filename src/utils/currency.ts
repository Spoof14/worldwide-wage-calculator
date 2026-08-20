export const currencies = ["EUR", "USD", "GBP", "KRW"] as const;

export type Currency = (typeof currencies)[number];

export const currencySymbols: Record<Currency, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  KRW: "₩",
};

export const isCurrency = (
  value: string | null | undefined,
): value is Currency =>
  !!value && (currencies as readonly string[]).includes(value);

export type FxRates = Record<Currency, number>;

export const eurRates: FxRates = { EUR: 1, USD: 1, GBP: 1, KRW: 1 };

/** Convert an amount in `currency` to EUR. */
export const toEur = (amount: number, currency: Currency, rates: FxRates) => {
  const rate = rates[currency] || 1;
  return amount / rate;
};

/** Convert an EUR amount to `currency`. */
export const fromEur = (amount: number, currency: Currency, rates: FxRates) => {
  const rate = rates[currency] || 1;
  return amount * rate;
};

export const formatMoney = (value: number, currency: Currency = "EUR") => {
  const rounded = Math.round(value);
  const formatted = Math.abs(rounded).toLocaleString("en-US");
  const symbol = currencySymbols[currency];
  return rounded < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
};
