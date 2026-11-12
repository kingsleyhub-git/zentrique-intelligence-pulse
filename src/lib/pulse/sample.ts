import { addMonths, type RawRow } from "./analytics";

/** Fictional Kenyan coffee & lifestyle retailer, 24 months of orders, for trying PULSE without a file. */
export const SAMPLE_NAME = "Savanna Roasters — sales sample (fictional)";

const PRODUCTS = [
  { name: "Premium Coffee Beans 1kg", price: 2400, costRatio: 0.52, weight: 30, trend: 0.018 },
  { name: "Herbal Tea Collection", price: 950, costRatio: 0.45, weight: 22, trend: 0.012 },
  { name: "Cold Brew Bottles", price: 450, costRatio: 0.38, weight: 26, trend: 0.035 },
  { name: "Ceramic Mug Set", price: 1800, costRatio: 0.91, weight: 10, trend: -0.01 },
  { name: "Festive Gift Hamper", price: 6500, costRatio: 0.6, weight: 6, trend: 0.01 },
  { name: "Barista Training Session", price: 12000, costRatio: 0.35, weight: 3, trend: 0.02 },
];
const REGIONS = [
  { name: "Nairobi", weight: 45 },
  { name: "Mombasa", weight: 22 },
  { name: "Kisumu", weight: 17 },
  { name: "Nakuru", weight: 16 },
];
const CHANNELS = [
  { name: "Retail", weight: 50 },
  { name: "Online", weight: 32 },
  { name: "Wholesale", weight: 18 },
];
// Dec/Nov peaks, Feb dip.
const SEASON = [0.86, 0.8, 0.92, 0.95, 0.97, 0.94, 0.98, 1.0, 1.02, 1.05, 1.18, 1.42];

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T extends { weight: number }>(items: T[], r: number): T {
  const total = items.reduce((a, b) => a + b.weight, 0);
  let x = r * total;
  for (const it of items) {
    x -= it.weight;
    if (x <= 0) return it;
  }
  return items[items.length - 1]!;
}

export function generateSampleRows(): RawRow[] {
  const rand = rng(20261);
  const rows: RawRow[] = [];
  const start = "2024-11";
  let id = 10001;
  for (let i = 0; i < 24; i++) {
    const month = addMonths(start, i);
    const [y, m] = month.split("-").map(Number) as [number, number];
    const orders = Math.round(55 * SEASON[m - 1]! * (1 + i * 0.012) + rand() * 8);
    for (let o = 0; o < orders; o++) {
      const p = pick(PRODUCTS, rand());
      const region = pick(REGIONS, rand());
      const channel = pick(CHANNELS, rand());
      const qty = p.price > 5000 ? 1 + Math.floor(rand() * 2) : 1 + Math.floor(rand() * (channel.name === "Wholesale" ? 24 : 6));
      const price = Math.round(p.price * (1 + p.trend * i) * (channel.name === "Wholesale" ? 0.85 : 1));
      const revenue = qty * price;
      const cost = Math.round(revenue * (p.costRatio + (rand() - 0.5) * 0.06));
      const day = 1 + Math.floor(rand() * 28);
      rows.push({
        "Order ID": `SR-${id++}`,
        Date: `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        Product: p.name,
        Region: region.name,
        Channel: channel.name,
        Quantity: qty,
        "Unit Price": price,
        Revenue: revenue,
        Cost: cost,
      });
    }
  }
  // A few realistic data problems so validation has something to report.
  rows.splice(40, 0, { ...rows[39]! });
  rows.splice(400, 0, { ...rows[399]! });
  rows.splice(800, 0, { ...rows[800]!, "Order ID": "SR-BAD1", Date: "" });
  rows.splice(1100, 0, { ...rows[1100]!, "Order ID": "SR-BAD2", Revenue: "n/a", Quantity: "", "Unit Price": "" });
  return rows;
}

export const SAMPLE_HEADERS = ["Order ID", "Date", "Product", "Region", "Channel", "Quantity", "Unit Price", "Revenue", "Cost"];
