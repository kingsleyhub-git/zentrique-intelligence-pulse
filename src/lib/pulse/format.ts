export const CURRENCIES = ["KES", "USD", "EUR", "GBP", "UGX", "TZS", "RWF", "NGN", "ZAR", "GHS"] as const;
export type Currency = (typeof CURRENCIES)[number];

export function money(v: number, currency: string, compact = true) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    currencyDisplay: "code",
    notation: compact && Math.abs(v) >= 100000 ? "compact" : "standard",
    maximumFractionDigits: compact && Math.abs(v) >= 100000 ? 1 : 0,
  }).format(v);
}

export function num(v: number) {
  return new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(v);
}

export function pct(v: number | null, signed = false) {
  if (v === null || !Number.isFinite(v)) return "—";
  const s = `${(v * 100).toFixed(1)}%`;
  return signed && v > 0 ? `+${s}` : s;
}

/** Short axis label, e.g. 1.2M. */
export function axis(v: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(v);
}
