import type { Analysis, ForecastResult, Segment, ValidationReport } from "./analytics";
import type { InsightRequest } from "./insights.schema";

const r2 = (v: number) => Math.round(v * 100) / 100;
const r4 = (v: number | null) => (v === null || !Number.isFinite(v) ? null : Math.round(v * 10000) / 10000);

const seg = (s: Segment) => ({
  name: s.name.slice(0, 80),
  revenue: r2(s.revenue),
  margin: r4(s.margin),
  share: r4(s.share) ?? 0,
  growth: r4(s.growth),
});

/** Compact, aggregate-only summary for the AI analyst. */
export function buildInsightPayload(
  analysis: Analysis,
  forecast: ForecastResult | null,
  report: ValidationReport,
  currency: string,
  context: { industry?: string; question?: string },
): InsightRequest {
  const first = analysis.monthly[0]?.label ?? "";
  const last = analysis.monthly[analysis.monthly.length - 1]?.label ?? "";
  const k = analysis.kpis;
  return {
    currency,
    period: `${first} – ${last}`.slice(0, 40),
    context: {
      industry: context.industry?.trim().slice(0, 120) || undefined,
      question: context.question?.trim().slice(0, 600) || undefined,
    },
    kpis: {
      totalRevenue: r2(k.totalRevenue),
      grossMargin: r4(k.grossMargin),
      orders: k.orders,
      avgOrderValue: r2(k.avgOrderValue),
      avgMonthlyRevenue: r2(k.avgMonthlyRevenue),
      momGrowth: r4(k.momGrowth),
      yoyGrowth: r4(k.yoyGrowth),
    },
    monthly: analysis.monthly.slice(-24).map((m) => ({
      label: m.label,
      revenue: r2(m.revenue),
      profit: m.profit === null ? null : r2(m.profit),
    })),
    products: analysis.products.slice(0, 12).map(seg),
    regions: analysis.regions.slice(0, 10).map(seg),
    channels: analysis.channels.slice(0, 10).map(seg),
    forecast: forecast
      ? {
          method: forecast.method,
          mape: r4(forecast.mape),
          points: forecast.points.slice(0, 12).map((p) => ({
            label: p.label,
            value: r2(p.value),
            lower: r2(p.lower),
            upper: r2(p.upper),
          })),
        }
      : null,
    quality: {
      validRows: report.validRows,
      duplicatesRemoved: report.duplicatesRemoved,
      missingDate: report.missingDate,
      invalidRevenue: report.invalidRevenue,
      qualityScore: report.qualityScore,
    },
  };
}
