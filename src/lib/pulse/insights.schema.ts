import { z } from "zod";

const n = z.number().finite();
const name = z.string().trim().max(80);

const segment = z.object({
  name,
  revenue: n,
  margin: n.nullable(),
  share: n,
  growth: n.nullable(),
});

/** Aggregated figures sent to the AI — never the raw uploaded rows. */
export const insightRequestSchema = z.object({
  currency: z.string().trim().min(3).max(5),
  period: z.string().trim().max(40),
  context: z.object({
    industry: z.string().trim().max(120).optional(),
    question: z.string().trim().max(600).optional(),
  }),
  kpis: z.object({
    totalRevenue: n,
    grossMargin: n.nullable(),
    orders: n,
    avgOrderValue: n,
    avgMonthlyRevenue: n,
    momGrowth: n.nullable(),
    yoyGrowth: n.nullable(),
  }),
  monthly: z.array(z.object({ label: z.string().max(20), revenue: n, profit: n.nullable() })).max(36),
  products: z.array(segment).max(12),
  regions: z.array(segment).max(10),
  channels: z.array(segment).max(10),
  forecast: z
    .object({
      method: z.string().max(60),
      mape: n.nullable(),
      points: z.array(z.object({ label: z.string().max(20), value: n, lower: n, upper: n })).max(12),
    })
    .nullable(),
  quality: z.object({
    validRows: n,
    duplicatesRemoved: n,
    missingDate: n,
    invalidRevenue: n,
    qualityScore: n,
  }),
});
export type InsightRequest = z.infer<typeof insightRequestSchema>;

/** Strict-compatible output: every field required, optional values nullable. */
export const insightsSchema = z.object({
  headline: z.string(),
  summary: z.string(),
  healthScore: z.number(),
  findings: z.array(
    z.object({
      title: z.string(),
      detail: z.string(),
      sentiment: z.enum(["positive", "negative", "neutral"]),
    }),
  ),
  risks: z.array(
    z.object({ title: z.string(), detail: z.string(), severity: z.enum(["high", "medium", "low"]) }),
  ),
  scenarios: z.array(
    z.object({
      name: z.enum(["Conservative", "Base", "Aggressive"]),
      revenueNext6Months: z.number(),
      assumption: z.string(),
    }),
  ),
  recommendations: z.array(
    z.object({
      title: z.string(),
      action: z.string(),
      rationale: z.string(),
      expectedImpact: z.string(),
      priority: z.enum(["high", "medium", "low"]),
      drivers: z.array(z.object({ factor: z.string(), weight: z.number() })),
    }),
  ),
  answer: z.string().nullable(),
});
export type PulseInsights = z.infer<typeof insightsSchema>;

export type InsightsResult =
  | { ok: true; insights: PulseInsights }
  | { ok: false; error: string };
