/**
 * PULSE analytics engine: turns raw spreadsheet rows into cleaned sales records,
 * KPIs, breakdowns and forecasts. Pure functions so it runs in the browser and in tests.
 */

export const FIELD_KEYS = [
  "date",
  "revenue",
  "quantity",
  "unitPrice",
  "cost",
  "product",
  "region",
  "channel",
] as const;
export type FieldKey = (typeof FIELD_KEYS)[number];
export type ColumnMapping = Record<FieldKey, string | null>;
export type RawRow = Record<string, unknown>;

export const FIELD_INFO: Record<FieldKey, { label: string; hint: string }> = {
  date: { label: "Date", hint: "Required · order, invoice or transaction date" },
  revenue: { label: "Revenue", hint: "Sales amount (or map Quantity + Unit price)" },
  quantity: { label: "Quantity", hint: "Optional · units sold" },
  unitPrice: { label: "Unit price", hint: "Optional · used when Revenue is missing" },
  cost: { label: "Cost", hint: "Optional · enables profit and margin" },
  product: { label: "Product", hint: "Optional · product, item or service" },
  region: { label: "Region / branch", hint: "Optional · branch, city or store" },
  channel: { label: "Channel / category", hint: "Optional · sales channel or segment" },
};

const SYNONYMS: Record<FieldKey, string[]> = {
  date: ["date", "order date", "transaction date", "invoice date", "sale date", "sales date", "month", "period", "day", "timestamp", "created at"],
  revenue: ["revenue", "sales", "amount", "total", "net sales", "gross sales", "turnover", "income", "sales amount", "total amount", "total sales", "sales value", "net amount", "line total"],
  quantity: ["quantity", "qty", "units", "units sold", "volume", "pieces"],
  unitPrice: ["price", "unit price", "selling price", "price per unit", "rate"],
  cost: ["cost", "cogs", "cost of goods", "cost of sales", "total cost", "expense", "expenses", "cost amount"],
  product: ["product", "item", "sku", "product name", "item name", "service", "description"],
  region: ["region", "branch", "location", "city", "store", "area", "county", "territory", "outlet", "country"],
  channel: ["channel", "category", "segment", "department", "customer type", "sales channel", "product category"],
};

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export function emptyMapping(): ColumnMapping {
  return Object.fromEntries(FIELD_KEYS.map((k) => [k, null])) as ColumnMapping;
}

/** Guess which column holds which field from the header names. */
export function detectMapping(headers: string[]): ColumnMapping {
  const candidates: { field: FieldKey; header: string; score: number }[] = [];
  for (const header of headers) {
    const n = normalize(header);
    if (!n) continue;
    for (const field of FIELD_KEYS) {
      let best = 0;
      for (const syn of SYNONYMS[field]) {
        if (n === syn) best = Math.max(best, 100 + syn.length);
        else if (` ${n} `.includes(` ${syn} `)) best = Math.max(best, syn.length);
      }
      if (best > 0) candidates.push({ field, header, score: best });
    }
  }
  candidates.sort((a, b) => b.score - a.score);
  const mapping = emptyMapping();
  const used = new Set<string>();
  for (const c of candidates) {
    if (mapping[c.field] || used.has(c.header)) continue;
    mapping[c.field] = c.header;
    used.add(c.header);
  }
  return mapping;
}

/** Returns a plain-language problem with the mapping, or null when it can be analysed. */
export function mappingProblem(m: ColumnMapping): string | null {
  if (!m.date) return "Choose which column holds the date.";
  if (!m.revenue && !(m.quantity && m.unitPrice))
    return "Choose a Revenue column, or both Quantity and Unit price.";
  return null;
}

/** Parses "KES 1,250.50", "(300)", "1.250,5", 42 → number. */
export function parseNumber(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v !== "string") return null;
  let s = v.trim();
  if (!s) return null;
  let negative = false;
  if (/^\(.*\)$/.test(s)) {
    negative = true;
    s = s.slice(1, -1);
  }
  if (s.includes("-")) negative = negative || /^[^0-9]*-/.test(s);
  s = s.replace(/[^0-9.,]/g, "");
  if (!s) return null;
  if (s.includes(",") && s.includes(".")) {
    s = s.lastIndexOf(",") > s.lastIndexOf(".") ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "");
  } else if (s.includes(",")) {
    s = /^\d{1,3}(,\d{3})+$/.test(s) ? s.replace(/,/g, "") : s.replace(",", ".");
  }
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return negative ? -n : n;
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthKey = (y: number, m: number) => `${y}-${String(m).padStart(2, "0")}`;
const plausible = (y: number, m: number) => y >= 1990 && y <= 2100 && m >= 1 && m <= 12;

export function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return `${MONTH_NAMES[(m ?? 1) - 1]} ${y}`;
}

export function addMonths(key: string, n: number) {
  const [y, m] = key.split("-").map(Number);
  const idx = (y ?? 0) * 12 + ((m ?? 1) - 1) + n;
  return monthKey(Math.floor(idx / 12), (idx % 12) + 1);
}

/** Decide whether slash dates like 03/04/2026 are day-first, from the values in the column. */
export function detectDayFirst(values: unknown[]): boolean {
  for (const v of values) {
    if (typeof v !== "string") continue;
    const m = v.trim().match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/);
    if (!m) continue;
    if (Number(m[1]) > 12) return true;
    if (Number(m[2]) > 12) return false;
  }
  return true;
}

/** Converts a date-like cell (Date, Excel serial, ISO or slash string, "Jan 2026") to "YYYY-MM". */
export function parseMonth(v: unknown, dayFirst = true): string | null {
  if (v instanceof Date) {
    if (Number.isNaN(v.getTime())) return null;
    const y = v.getFullYear();
    const m = v.getMonth() + 1;
    return plausible(y, m) ? monthKey(y, m) : null;
  }
  if (typeof v === "number") {
    if (v < 1 || v >= 100000) return null;
    const d = new Date(Math.round((v - 25569) * 86400000));
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth() + 1;
    return plausible(y, m) ? monthKey(y, m) : null;
  }
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s) return null;
  let m = s.match(/^(\d{4})[-/.](\d{1,2})(?:[-/.](\d{1,2}))?/);
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]);
    return plausible(y, mo) ? monthKey(y, mo) : null;
  }
  m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/);
  if (m) {
    const a = Number(m[1]);
    const b = Number(m[2]);
    let y = Number(m[3]);
    if (y < 100) y += 2000;
    const mo = dayFirst ? b : a;
    return plausible(y, mo) ? monthKey(y, mo) : null;
  }
  const t = Date.parse(s);
  if (Number.isNaN(t)) return null;
  const d = new Date(t);
  const y = d.getFullYear();
  const mo = d.getMonth() + 1;
  return plausible(y, mo) ? monthKey(y, mo) : null;
}

export interface SalesRecord {
  month: string;
  revenue: number;
  cost: number | null;
  quantity: number | null;
  product: string | null;
  region: string | null;
  channel: string | null;
}

export interface ValidationReport {
  totalRows: number;
  validRows: number;
  emptyRows: number;
  duplicatesRemoved: number;
  missingDate: number;
  invalidRevenue: number;
  filledLabels: number;
  firstMonth: string | null;
  lastMonth: string | null;
  monthsCovered: number;
  qualityScore: number;
}

const isBlank = (v: unknown) => v === null || v === undefined || (typeof v === "string" && v.trim() === "");

function label(v: unknown): string | null {
  if (isBlank(v)) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v).trim().slice(0, 80);
}

/** Validates and cleans rows: drops empty and duplicate rows, rejects bad dates/amounts. */
export function cleanData(rows: RawRow[], mapping: ColumnMapping) {
  const report: ValidationReport = {
    totalRows: rows.length,
    validRows: 0,
    emptyRows: 0,
    duplicatesRemoved: 0,
    missingDate: 0,
    invalidRevenue: 0,
    filledLabels: 0,
    firstMonth: null,
    lastMonth: null,
    monthsCovered: 0,
    qualityScore: 0,
  };
  const records: SalesRecord[] = [];
  if (mappingProblem(mapping)) return { records, report };

  const dayFirst = detectDayFirst(rows.slice(0, 500).map((r) => r[mapping.date!]));
  const seen = new Set<string>();

  for (const row of rows) {
    const values = Object.values(row);
    if (values.every(isBlank)) {
      report.emptyRows++;
      continue;
    }
    const key = JSON.stringify(values.map((v) => (v instanceof Date ? v.toISOString() : v)));
    if (seen.has(key)) {
      report.duplicatesRemoved++;
      continue;
    }
    seen.add(key);

    const month = parseMonth(row[mapping.date!], dayFirst);
    if (!month) {
      report.missingDate++;
      continue;
    }

    const quantity = mapping.quantity ? parseNumber(row[mapping.quantity]) : null;
    let revenue = mapping.revenue ? parseNumber(row[mapping.revenue]) : null;
    if (revenue === null && mapping.quantity && mapping.unitPrice) {
      const price = parseNumber(row[mapping.unitPrice]);
      if (quantity !== null && price !== null) revenue = quantity * price;
    }
    if (revenue === null) {
      report.invalidRevenue++;
      continue;
    }

    const dims = (["product", "region", "channel"] as const).map((f) => {
      const col = mapping[f];
      if (!col) return null;
      const l = label(row[col]);
      if (l === null) {
        report.filledLabels++;
        return "Unspecified";
      }
      return l;
    });

    records.push({
      month,
      revenue,
      cost: mapping.cost ? parseNumber(row[mapping.cost]) : null,
      quantity,
      product: dims[0] ?? null,
      region: dims[1] ?? null,
      channel: dims[2] ?? null,
    });
  }

  report.validRows = records.length;
  if (records.length) {
    const months = records.map((r) => r.month).sort();
    report.firstMonth = months[0] ?? null;
    report.lastMonth = months[months.length - 1] ?? null;
    report.monthsCovered = new Set(months).size;
  }
  const considered = report.totalRows - report.emptyRows - report.duplicatesRemoved;
  report.qualityScore = considered > 0 ? Math.floor((report.validRows / considered) * 100) : 0;
  return { records, report };
}

export interface MonthPoint {
  month: string;
  label: string;
  revenue: number;
  cost: number | null;
  profit: number | null;
  orders: number;
}

export interface Segment {
  name: string;
  revenue: number;
  cost: number | null;
  profit: number | null;
  margin: number | null;
  quantity: number | null;
  orders: number;
  share: number;
  /** Last 3 months vs the 3 months before, as a fraction (0.12 = +12%). */
  growth: number | null;
}

export interface Kpis {
  totalRevenue: number;
  totalCost: number | null;
  grossProfit: number | null;
  grossMargin: number | null;
  orders: number;
  totalQuantity: number | null;
  avgOrderValue: number;
  avgMonthlyRevenue: number;
  lastMonth: { label: string; revenue: number } | null;
  momGrowth: number | null;
  yoyGrowth: number | null;
  bestMonth: { label: string; revenue: number } | null;
}

export interface Analysis {
  hasCost: boolean;
  hasQuantity: boolean;
  kpis: Kpis;
  monthly: MonthPoint[];
  products: Segment[];
  regions: Segment[];
  channels: Segment[];
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const growth = (now: number, before: number) => (before > 0 ? (now - before) / before : null);

function segments(
  records: SalesRecord[],
  pick: (r: SalesRecord) => string | null,
  total: number,
  recent: Set<string>,
  prior: Set<string>,
): Segment[] {
  const map = new Map<
    string,
    { revenue: number; cost: number; hasCost: boolean; qty: number; hasQty: boolean; orders: number; recent: number; prior: number }
  >();
  for (const r of records) {
    const name = pick(r);
    if (name === null) continue;
    const s = map.get(name) ?? { revenue: 0, cost: 0, hasCost: false, qty: 0, hasQty: false, orders: 0, recent: 0, prior: 0 };
    s.revenue += r.revenue;
    if (r.cost !== null) {
      s.cost += r.cost;
      s.hasCost = true;
    }
    if (r.quantity !== null) {
      s.qty += r.quantity;
      s.hasQty = true;
    }
    s.orders++;
    if (recent.has(r.month)) s.recent += r.revenue;
    if (prior.has(r.month)) s.prior += r.revenue;
    map.set(name, s);
  }
  return [...map.entries()]
    .map(([name, s]) => {
      const profit = s.hasCost ? s.revenue - s.cost : null;
      return {
        name,
        revenue: s.revenue,
        cost: s.hasCost ? s.cost : null,
        profit,
        margin: profit !== null && s.revenue !== 0 ? profit / s.revenue : null,
        quantity: s.hasQty ? s.qty : null,
        orders: s.orders,
        share: total ? s.revenue / total : 0,
        growth: recent.size && prior.size ? growth(s.recent, s.prior) : null,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

export function analyze(records: SalesRecord[]): Analysis {
  const hasCost = records.some((r) => r.cost !== null);
  const hasQuantity = records.some((r) => r.quantity !== null);

  const byMonth = new Map<string, { revenue: number; cost: number; orders: number }>();
  for (const r of records) {
    const m = byMonth.get(r.month) ?? { revenue: 0, cost: 0, orders: 0 };
    m.revenue += r.revenue;
    m.cost += r.cost ?? 0;
    m.orders++;
    byMonth.set(r.month, m);
  }
  const keys = [...byMonth.keys()].sort();
  const monthly: MonthPoint[] = [];
  if (keys.length) {
    let k = keys[0]!;
    const last = keys[keys.length - 1]!;
    for (let i = 0; i < 600; i++) {
      const m = byMonth.get(k);
      monthly.push({
        month: k,
        label: monthLabel(k),
        revenue: m?.revenue ?? 0,
        cost: hasCost ? (m?.cost ?? 0) : null,
        profit: hasCost ? (m?.revenue ?? 0) - (m?.cost ?? 0) : null,
        orders: m?.orders ?? 0,
      });
      if (k === last) break;
      k = addMonths(k, 1);
    }
  }

  const totalRevenue = sum(records.map((r) => r.revenue));
  const totalCost = hasCost ? sum(records.map((r) => r.cost ?? 0)) : null;
  const grossProfit = totalCost !== null ? totalRevenue - totalCost : null;
  const lastPoint = monthly[monthly.length - 1];
  const prevPoint = monthly[monthly.length - 2];
  const best = monthly.reduce<MonthPoint | null>((b, m) => (!b || m.revenue > b.revenue ? m : b), null);
  const revs = monthly.map((m) => m.revenue);

  const recent = new Set<string>();
  const prior = new Set<string>();
  if (monthly.length >= 6) {
    monthly.slice(-3).forEach((m) => recent.add(m.month));
    monthly.slice(-6, -3).forEach((m) => prior.add(m.month));
  }

  return {
    hasCost,
    hasQuantity,
    kpis: {
      totalRevenue,
      totalCost,
      grossProfit,
      grossMargin: grossProfit !== null && totalRevenue ? grossProfit / totalRevenue : null,
      orders: records.length,
      totalQuantity: hasQuantity ? sum(records.map((r) => r.quantity ?? 0)) : null,
      avgOrderValue: records.length ? totalRevenue / records.length : 0,
      avgMonthlyRevenue: monthly.length ? totalRevenue / monthly.length : 0,
      lastMonth: lastPoint ? { label: lastPoint.label, revenue: lastPoint.revenue } : null,
      momGrowth: lastPoint && prevPoint ? growth(lastPoint.revenue, prevPoint.revenue) : null,
      yoyGrowth: revs.length >= 24 ? growth(sum(revs.slice(-12)), sum(revs.slice(-24, -12))) : null,
      bestMonth: best ? { label: best.label, revenue: best.revenue } : null,
    },
    monthly,
    products: segments(records, (r) => r.product, totalRevenue, recent, prior),
    regions: segments(records, (r) => r.region, totalRevenue, recent, prior),
    channels: segments(records, (r) => r.channel, totalRevenue, recent, prior),
  };
}

/* ---------------- Forecasting ---------------- */

export interface ForecastPoint {
  month: string;
  label: string;
  value: number;
  lower: number;
  upper: number;
}

export interface ForecastResult {
  method: string;
  seasonal: boolean;
  points: ForecastPoint[];
  /** Back-tested mean absolute percentage error (0.06 = 6%). */
  mape: number | null;
  total: number;
}

interface Fit {
  sse: number;
  n: number;
  predict: (h: number) => number;
}

function holt(y: number[], a: number, b: number): Fit {
  let l = y[0]!;
  let t = (y[1] ?? y[0]!) - y[0]!;
  let sse = 0;
  for (let i = 1; i < y.length; i++) {
    const e = y[i]! - (l + t);
    sse += e * e;
    const nl = a * y[i]! + (1 - a) * (l + t);
    t = b * (nl - l) + (1 - b) * t;
    l = nl;
  }
  return { sse, n: y.length - 1, predict: (h) => l + h * t };
}

function holtWinters(y: number[], a: number, b: number, g: number, m = 12): Fit {
  const mean = (xs: number[]) => sum(xs) / xs.length;
  let l = mean(y.slice(0, m));
  let t = (mean(y.slice(m, 2 * m)) - l) / m;
  const s = y.slice(0, m).map((v) => v - l);
  let sse = 0;
  for (let i = m; i < y.length; i++) {
    const si = s[i % m]!;
    const e = y[i]! - (l + t + si);
    sse += e * e;
    const nl = a * (y[i]! - si) + (1 - a) * (l + t);
    t = b * (nl - l) + (1 - b) * t;
    s[i % m] = g * (y[i]! - nl) + (1 - g) * si;
    l = nl;
  }
  const n = y.length;
  return { sse, n: n - m, predict: (h) => l + h * t + s[(n - 1 + h) % m]! };
}

const ALPHAS = [0.1, 0.3, 0.5, 0.7, 0.9];
const BETAS = [0.05, 0.1, 0.2, 0.3];
const GAMMAS = [0.1, 0.3, 0.5];

function bestFit(y: number[]): { fit: Fit; seasonal: boolean } {
  const seasonal = y.length >= 24;
  let best: Fit | null = null;
  for (const a of ALPHAS)
    for (const b of BETAS) {
      if (seasonal) {
        for (const g of GAMMAS) {
          const f = holtWinters(y, a, b, g);
          if (!best || f.sse < best.sse) best = f;
        }
      } else {
        const f = holt(y, a, b);
        if (!best || f.sse < best.sse) best = f;
      }
    }
  return { fit: best!, seasonal };
}

/** Forecasts the next `horizon` months with exponential smoothing and a 90% band. */
export function forecastSeries(
  values: number[],
  lastMonth: string,
  horizon: number,
): ForecastResult | null {
  if (values.length < 3) return null;
  const { fit, seasonal } = bestFit(values);
  const rmse = Math.sqrt(fit.sse / Math.max(1, fit.n));

  let mape: number | null = null;
  const k = Math.min(3, Math.floor(values.length / 4));
  if (k >= 1 && values.length - k >= 3) {
    const train = values.slice(0, -k);
    const test = values.slice(-k);
    const { fit: bt } = bestFit(train);
    const errs = test
      .map((actual, i) => (actual > 0 ? Math.abs(actual - bt.predict(i + 1)) / actual : null))
      .filter((e): e is number => e !== null);
    if (errs.length) mape = sum(errs) / errs.length;
  }

  const points: ForecastPoint[] = [];
  for (let h = 1; h <= horizon; h++) {
    const month = addMonths(lastMonth, h);
    const raw = fit.predict(h);
    const band = 1.645 * rmse * Math.sqrt(h);
    const value = Math.max(0, raw);
    points.push({
      month,
      label: monthLabel(month),
      value,
      lower: Math.max(0, raw - band),
      upper: Math.max(0, raw + band),
    });
  }
  return {
    method: seasonal ? "Holt-Winters seasonal smoothing" : "Holt linear-trend smoothing",
    seasonal,
    points,
    mape,
    total: sum(points.map((p) => p.value)),
  };
}
