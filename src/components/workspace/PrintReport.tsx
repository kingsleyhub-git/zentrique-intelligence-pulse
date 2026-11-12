import type { Analysis, ForecastResult, ValidationReport } from "@/lib/pulse/analytics";
import type { PulseInsights } from "@/lib/pulse/insights.schema";
import { money, num, pct } from "@/lib/pulse/format";

/** Board-ready report that only appears when printing / saving as PDF. */
export function PrintReport({
  title,
  analysis,
  forecast,
  report,
  insights,
  currency,
}: {
  title: string;
  analysis: Analysis;
  forecast: ForecastResult | null;
  report: ValidationReport;
  insights: PulseInsights | null;
  currency: string;
}) {
  const k = analysis.kpis;
  const th = "border-b border-border py-1.5 pr-3 text-left text-xs font-semibold";
  const td = "border-b border-border py-1.5 pr-3 text-xs";
  return (
    <div className="hidden bg-background p-8 text-foreground print:block">
      <header className="border-b-2 border-primary pb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">ZENTRIQUE PULSE · Intelligence Report</p>
        <h1 className="mt-1 text-2xl font-bold">{title}</h1>
        <p className="text-xs text-muted-foreground">
          {analysis.monthly[0]?.label} – {analysis.monthly[analysis.monthly.length - 1]?.label} · {num(report.validRows)} records ·
          generated {new Date().toLocaleDateString("en-GB", { dateStyle: "long" })}
        </p>
      </header>

      <section className="mt-5 grid grid-cols-4 gap-3">
        {[
          ["Total revenue", money(k.totalRevenue, currency)],
          ["Gross margin", pct(k.grossMargin)],
          ["Orders", num(k.orders)],
          ["Avg order value", money(k.avgOrderValue, currency)],
        ].map(([l, v]) => (
          <div key={l} className="rounded border border-border p-2">
            <p className="text-[10px] uppercase text-muted-foreground">{l}</p>
            <p className="text-base font-bold">{v}</p>
          </div>
        ))}
      </section>

      {insights && (
        <section className="mt-5 break-inside-avoid">
          <h2 className="text-base font-bold">Executive summary</h2>
          <p className="mt-1 text-sm font-semibold">{insights.headline}</p>
          <p className="mt-1 text-xs">{insights.summary}</p>
          <h3 className="mt-3 text-sm font-bold">Recommendations</h3>
          <ol className="mt-1 list-decimal space-y-1 pl-5 text-xs">
            {insights.recommendations.map((r) => (
              <li key={r.title}>
                <span className="font-semibold">{r.title}:</span> {r.action} <em>({r.expectedImpact})</em>
              </li>
            ))}
          </ol>
          <h3 className="mt-3 text-sm font-bold">Scenarios · next 6 months</h3>
          <p className="text-xs">
            {insights.scenarios.map((s) => `${s.name}: ${money(s.revenueNext6Months, currency)}`).join(" · ")}
          </p>
        </section>
      )}

      <section className="mt-5 break-inside-avoid">
        <h2 className="text-base font-bold">Monthly performance</h2>
        <table className="mt-2 w-full">
          <thead>
            <tr>
              <th className={th}>Month</th>
              <th className={th}>Revenue</th>
              {analysis.hasCost && <th className={th}>Gross profit</th>}
              <th className={th}>Orders</th>
            </tr>
          </thead>
          <tbody>
            {analysis.monthly.slice(-12).map((m) => (
              <tr key={m.month}>
                <td className={td}>{m.label}</td>
                <td className={td}>{money(m.revenue, currency, false)}</td>
                {analysis.hasCost && <td className={td}>{money(m.profit ?? 0, currency, false)}</td>}
                <td className={td}>{num(m.orders)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {analysis.products.length > 0 && (
        <section className="mt-5 break-inside-avoid">
          <h2 className="text-base font-bold">Product profitability</h2>
          <table className="mt-2 w-full">
            <thead>
              <tr>
                <th className={th}>Product</th>
                <th className={th}>Revenue</th>
                <th className={th}>Margin</th>
                <th className={th}>Share</th>
                <th className={th}>3-mo trend</th>
              </tr>
            </thead>
            <tbody>
              {analysis.products.slice(0, 15).map((p) => (
                <tr key={p.name}>
                  <td className={td}>{p.name}</td>
                  <td className={td}>{money(p.revenue, currency, false)}</td>
                  <td className={td}>{pct(p.margin)}</td>
                  <td className={td}>{pct(p.share)}</td>
                  <td className={td}>{pct(p.growth, true)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {forecast && (
        <section className="mt-5 break-inside-avoid">
          <h2 className="text-base font-bold">Forecast</h2>
          <p className="text-xs text-muted-foreground">
            {forecast.method}
            {forecast.mape !== null ? ` · back-tested error ${pct(forecast.mape)}` : ""}
          </p>
          <table className="mt-2 w-full">
            <thead>
              <tr>
                <th className={th}>Month</th>
                <th className={th}>Forecast</th>
                <th className={th}>90% range</th>
              </tr>
            </thead>
            <tbody>
              {forecast.points.map((p) => (
                <tr key={p.month}>
                  <td className={td}>{p.label}</td>
                  <td className={td}>{money(p.value, currency, false)}</td>
                  <td className={td}>
                    {money(p.lower, currency)} – {money(p.upper, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      <p className="mt-6 text-[10px] text-muted-foreground">
        Data quality score {report.qualityScore}/100 · {report.duplicatesRemoved} duplicates removed ·{" "}
        {report.missingDate + report.invalidRevenue} rows excluded. Prepared with ZENTRIQUE PULSE.
      </p>
    </div>
  );
}
