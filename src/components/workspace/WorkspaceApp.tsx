import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  BarChart3,
  Brain,
  Download,
  FileSpreadsheet,
  FileText,
  LayoutDashboard,
  LineChart,
  Package,
  Printer,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  analyze,
  cleanData,
  detectMapping,
  forecastSeries,
  mappingProblem,
  type ColumnMapping,
  type RawRow,
} from "@/lib/pulse/analytics";
import { downloadCsv, downloadWorkbook, parseSpreadsheet, type ParsedWorkbook } from "@/lib/pulse/file";
import { CURRENCIES, money, num, pct } from "@/lib/pulse/format";
import { requestPulseInsights } from "@/lib/pulse/insights.functions";
import { buildInsightPayload } from "@/lib/pulse/payload";
import { generateSampleRows, SAMPLE_HEADERS, SAMPLE_NAME } from "@/lib/pulse/sample";
import { ForecastChart, MonthlyBars, SegmentBars, TrendChart } from "./charts";
import { DataSourcePanel } from "./DataSourcePanel";
import { InsightsPanel, type InsightState } from "./InsightsPanel";
import { MappingPanel } from "./MappingPanel";
import { PrintReport } from "./PrintReport";
import { SegmentTable } from "./SegmentTable";
import { Card, CardTitle, Kpi, SelectField } from "./ui";

interface Source {
  name: string;
  headers: string[];
  rows: RawRow[];
  workbook?: ParsedWorkbook;
  sheet?: string;
}

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "revenue", label: "Revenue", icon: BarChart3 },
  { id: "products", label: "Products", icon: Package },
  { id: "forecast", label: "Forecast", icon: LineChart },
  { id: "insights", label: "AI Insights", icon: Brain },
  { id: "reports", label: "Reports", icon: FileText },
] as const;

export function WorkspaceApp() {
  const [source, setSource] = useState<Source | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping>(() => detectMapping([]));
  const [currency, setCurrency] = useState<string>("KES");
  const [horizon, setHorizon] = useState(6);
  const [tab, setTab] = useState<string>("overview");
  const [busy, setBusy] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [industry, setIndustry] = useState("");
  const [question, setQuestion] = useState("");
  const [insights, setInsights] = useState<InsightState>({ status: "idle" });
  const getInsights = useServerFn(requestPulseInsights);

  const load = (s: Source) => {
    setSource(s);
    setMapping(detectMapping(s.headers));
    setInsights({ status: "idle" });
    setTab("overview");
  };

  const onFile = async (file: File) => {
    setBusy(true);
    setFileError(null);
    try {
      const wb = await parseSpreadsheet(file);
      const sheet = wb.sheetNames.find((n) => wb.read(n).rows.length > 0) ?? wb.sheetNames[0]!;
      const { headers, rows } = wb.read(sheet);
      if (!rows.length) throw new Error("We couldn't find any data rows in this file.");
      load({ name: file.name, headers, rows, workbook: wb, sheet });
      toast.success(`Loaded ${num(rows.length)} rows from ${file.name}`);
    } catch (e) {
      setFileError(e instanceof Error ? e.message : "We couldn't read this file.");
    } finally {
      setBusy(false);
    }
  };

  const onSample = () => load({ name: SAMPLE_NAME, headers: SAMPLE_HEADERS, rows: generateSampleRows() });
  const onTemplate = () =>
    downloadCsv("pulse-sales-template.csv", generateSampleRows().slice(0, 60) as Record<string, unknown>[]);

  const changeSheet = (sheet: string) => {
    if (!source?.workbook) return;
    const { headers, rows } = source.workbook.read(sheet);
    load({ ...source, headers, rows, sheet });
  };

  const problem = mappingProblem(mapping);
  const cleaned = useMemo(() => (source ? cleanData(source.rows, mapping) : null), [source, mapping]);
  const analysis = useMemo(
    () => (cleaned && cleaned.records.length ? analyze(cleaned.records) : null),
    [cleaned],
  );
  const lastMonth = analysis?.monthly[analysis.monthly.length - 1]?.month;
  const series = useMemo(() => analysis?.monthly.map((m) => m.revenue) ?? [], [analysis]);
  const forecast = useMemo(
    () => (lastMonth ? forecastSeries(series, lastMonth, horizon) : null),
    [series, lastMonth, horizon],
  );

  const generate = async () => {
    if (!analysis || !cleaned) return;
    setInsights({ status: "loading" });
    try {
      const sixMonth = lastMonth ? forecastSeries(series, lastMonth, 6) : null;
      const payload = buildInsightPayload(analysis, sixMonth, cleaned.report, currency, { industry, question });
      const res = await getInsights({ data: payload });
      setInsights(res.ok ? { status: "done", data: res.insights, at: new Date() } : { status: "error", error: res.error });
    } catch {
      setInsights({ status: "error", error: "We couldn't reach PULSE AI. Check your connection and try again." });
    }
  };

  const reportTitle = source?.name.replace(/\.(csv|xlsx|xls)$/i, "") ?? "Sales analysis";

  const exportExcel = async () => {
    if (!analysis || !cleaned) return;
    const k = analysis.kpis;
    const ai = insights.status === "done" ? insights.data : null;
    await downloadWorkbook(`zentrique-pulse-report-${new Date().toISOString().slice(0, 10)}.xlsx`, [
      {
        name: "Summary",
        rows: [
          { Metric: "Data source", Value: source?.name ?? "" },
          { Metric: "Period", Value: `${analysis.monthly[0]?.label} – ${analysis.monthly[analysis.monthly.length - 1]?.label}` },
          { Metric: `Total revenue (${currency})`, Value: Math.round(k.totalRevenue) },
          { Metric: `Total cost (${currency})`, Value: k.totalCost === null ? "n/a" : Math.round(k.totalCost) },
          { Metric: `Gross profit (${currency})`, Value: k.grossProfit === null ? "n/a" : Math.round(k.grossProfit) },
          { Metric: "Gross margin", Value: pct(k.grossMargin) },
          { Metric: "Orders", Value: k.orders },
          { Metric: `Average order value (${currency})`, Value: Math.round(k.avgOrderValue) },
          { Metric: "Month-on-month growth", Value: pct(k.momGrowth, true) },
          { Metric: "Year-on-year growth", Value: pct(k.yoyGrowth, true) },
          { Metric: "Data quality score", Value: `${cleaned.report.qualityScore}/100` },
          ...(ai
            ? [
                { Metric: "AI headline", Value: ai.headline },
                { Metric: "AI summary", Value: ai.summary },
                ...ai.recommendations.map((r, i) => ({ Metric: `Recommendation ${i + 1}`, Value: `${r.title}: ${r.action}` })),
              ]
            : []),
        ],
      },
      {
        name: "Monthly",
        rows: analysis.monthly.map((m) => ({ Month: m.label, Revenue: Math.round(m.revenue), Cost: m.cost === null ? "" : Math.round(m.cost), "Gross profit": m.profit === null ? "" : Math.round(m.profit), Orders: m.orders })),
      },
      ...(["products", "regions", "channels"] as const)
        .filter((key) => analysis[key].length)
        .map((key) => ({
          name: key[0]!.toUpperCase() + key.slice(1),
          rows: analysis[key].map((s) => ({
            Name: s.name,
            Revenue: Math.round(s.revenue),
            Cost: s.cost === null ? "" : Math.round(s.cost),
            "Gross profit": s.profit === null ? "" : Math.round(s.profit),
            Margin: pct(s.margin),
            Units: s.quantity ?? "",
            Orders: s.orders,
            Share: pct(s.share),
            "3-month trend": pct(s.growth, true),
          })),
        })),
      {
        name: "Forecast",
        rows: (forecast?.points ?? []).map((p) => ({ Month: p.label, Forecast: Math.round(p.value), "Low (90%)": Math.round(p.lower), "High (90%)": Math.round(p.upper) })),
      },
      {
        name: "Cleaned data",
        rows: cleaned.records.map((r) => ({ Month: r.month, Revenue: r.revenue, Cost: r.cost ?? "", Quantity: r.quantity ?? "", Product: r.product ?? "", Region: r.region ?? "", Channel: r.channel ?? "" })),
      },
    ]);
    toast.success("Excel report downloaded");
  };

  const exportCsv = async () => {
    if (!cleaned) return;
    await downloadCsv(
      "zentrique-pulse-cleaned-data.csv",
      cleaned.records.map((r) => ({ Month: r.month, Revenue: r.revenue, Cost: r.cost ?? "", Quantity: r.quantity ?? "", Product: r.product ?? "", Region: r.region ?? "", Channel: r.channel ?? "" })),
    );
  };

  if (!source) {
    return <DataSourcePanel onFile={onFile} onSample={onSample} onTemplate={onTemplate} busy={busy} error={fileError} />;
  }

  const k = analysis?.kpis;

  return (
    <>
      <div className="space-y-6 print:hidden">
        {/* Data source bar */}
        <Card className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileSpreadsheet className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">{source.name}</p>
              <p className="text-sm text-muted-foreground">
                {num(source.rows.length)} rows · {source.headers.length} columns
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-[auto_auto_auto] sm:items-end">
            {source.workbook && source.workbook.sheetNames.length > 1 && (
              <SelectField
                id="ws-sheet"
                label="Sheet"
                value={source.sheet ?? ""}
                onChange={changeSheet}
                options={source.workbook.sheetNames.map((s) => ({ value: s, label: s }))}
              />
            )}
            <SelectField
              id="ws-currency"
              label="Currency"
              value={currency}
              onChange={setCurrency}
              options={CURRENCIES.map((c) => ({ value: c, label: c }))}
            />
            <Button variant="outline" className="h-10" onClick={() => setSource(null)}>
              <RefreshCw aria-hidden="true" /> Use different data
            </Button>
          </div>
        </Card>

        <MappingPanel
          headers={source.headers}
          mapping={mapping}
          onChange={(m) => {
            setMapping(m);
            setInsights({ status: "idle" });
          }}
          report={cleaned?.report ?? null}
          problem={problem}
        />

        {analysis && k && cleaned ? (
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-xl bg-card p-1.5 shadow-soft">
              {TABS.map((t) => (
                <TabsTrigger key={t.id} value={t.id} className="gap-2 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <t.icon className="size-4" aria-hidden="true" /> {t.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                <Kpi label="Total revenue" value={money(k.totalRevenue, currency)} delta={k.yoyGrowth} deltaLabel={k.yoyGrowth !== null ? "last 12 mo vs prior" : `${analysis.monthly.length} months`} />
                <Kpi label="Gross margin" value={pct(k.grossMargin)} deltaLabel={k.grossProfit !== null ? `${money(k.grossProfit, currency)} profit` : "Map a Cost column"} />
                <Kpi label={`Revenue · ${k.lastMonth?.label ?? ""}`} value={money(k.lastMonth?.revenue ?? 0, currency)} delta={k.momGrowth} deltaLabel="vs previous month" />
                <Kpi label="Avg order value" value={money(k.avgOrderValue, currency)} deltaLabel={`${num(k.orders)} orders`} />
              </div>
              <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
                <Card>
                  <CardTitle>Monthly revenue{analysis.hasCost ? " & gross profit" : ""}</CardTitle>
                  <TrendChart data={analysis.monthly} currency={currency} showProfit={analysis.hasCost} />
                </Card>
                <Card>
                  <CardTitle
                    action={
                      <Button size="sm" variant="outline" onClick={() => setTab("insights")}>
                        <Brain aria-hidden="true" /> AI insights
                      </Button>
                    }
                  >
                    Highlights
                  </CardTitle>
                  <ul className="space-y-4 text-sm">
                    {k.bestMonth && (
                      <li>
                        <p className="text-muted-foreground">Best month</p>
                        <p className="font-semibold text-foreground">{k.bestMonth.label} · {money(k.bestMonth.revenue, currency)}</p>
                      </li>
                    )}
                    {analysis.products[0] && (
                      <li>
                        <p className="text-muted-foreground">Top product</p>
                        <p className="font-semibold text-foreground">{analysis.products[0].name} · {pct(analysis.products[0].share)} of revenue</p>
                      </li>
                    )}
                    {analysis.regions[0] && (
                      <li>
                        <p className="text-muted-foreground">Top region</p>
                        <p className="font-semibold text-foreground">{analysis.regions[0].name} · {money(analysis.regions[0].revenue, currency)}</p>
                      </li>
                    )}
                    {forecast && (
                      <li>
                        <p className="text-muted-foreground">Next {horizon} months (forecast)</p>
                        <p className="font-semibold text-foreground">{money(forecast.total, currency)}</p>
                      </li>
                    )}
                    <li>
                      <p className="text-muted-foreground">Average per month</p>
                      <p className="font-semibold text-foreground">{money(k.avgMonthlyRevenue, currency)}</p>
                    </li>
                  </ul>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="revenue" className="mt-6 space-y-6">
              <Card>
                <CardTitle>Revenue{analysis.hasCost ? " vs cost" : ""} by month</CardTitle>
                <MonthlyBars data={analysis.monthly} currency={currency} showCost={analysis.hasCost} />
              </Card>
              <div className="grid gap-6 xl:grid-cols-2">
                {[
                  { key: "regions" as const, title: "Revenue by region / branch", color: "var(--chart-1)" },
                  { key: "channels" as const, title: "Revenue by channel / category", color: "var(--chart-2)" },
                ].map(({ key, title, color }) => (
                  <Card key={key}>
                    <CardTitle>{title}</CardTitle>
                    {analysis[key].length ? (
                      <SegmentBars data={analysis[key]} currency={currency} color={color} />
                    ) : (
                      <p className="text-sm text-muted-foreground">Map a {key === "regions" ? "Region" : "Channel"} column above to see this breakdown.</p>
                    )}
                  </Card>
                ))}
              </div>
              {analysis.regions.length > 0 && (
                <Card>
                  <CardTitle>Sales performance by region</CardTitle>
                  <SegmentTable rows={analysis.regions} currency={currency} label="Region" showCost={analysis.hasCost} showQty={analysis.hasQuantity} />
                </Card>
              )}
            </TabsContent>

            <TabsContent value="products" className="mt-6 space-y-6">
              {analysis.products.length ? (
                <>
                  <Card>
                    <CardTitle>Product profitability</CardTitle>
                    <SegmentTable rows={analysis.products} currency={currency} label="Product" showCost={analysis.hasCost} showQty={analysis.hasQuantity} />
                  </Card>
                  <Card>
                    <CardTitle>Top products by revenue</CardTitle>
                    <SegmentBars data={analysis.products} currency={currency} />
                  </Card>
                </>
              ) : (
                <Card>
                  <p className="text-sm text-muted-foreground">Map a Product column above to analyse product profitability.</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="forecast" className="mt-6 space-y-6">
              {forecast ? (
                <>
                  <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                    <Kpi label={`Next ${horizon} months`} value={money(forecast.total, currency)} delta={k.avgMonthlyRevenue ? forecast.total / horizon / k.avgMonthlyRevenue - 1 : null} deltaLabel="vs average month" />
                    <Kpi label={`Forecast · ${forecast.points[0]?.label}`} value={money(forecast.points[0]?.value ?? 0, currency)} deltaLabel={`${money(forecast.points[0]?.lower ?? 0, currency)} – ${money(forecast.points[0]?.upper ?? 0, currency)}`} />
                    <Kpi label="Back-tested error" value={forecast.mape === null ? "—" : pct(forecast.mape)} deltaLabel="Average miss on recent months" />
                    <Kpi label="Model" value={forecast.seasonal ? "Seasonal" : "Trend"} deltaLabel={forecast.method} />
                  </div>
                  <Card>
                    <CardTitle
                      action={
                        <div className="w-40">
                          <SelectField
                            id="ws-horizon"
                            label="Forecast horizon"
                            value={String(horizon)}
                            onChange={(v) => setHorizon(Number(v))}
                            options={[3, 6, 12].map((h) => ({ value: String(h), label: `${h} months` }))}
                          />
                        </div>
                      }
                    >
                      Revenue forecast
                    </CardTitle>
                    <ForecastChart history={analysis.monthly} forecast={forecast} currency={currency} />
                    <p className="mt-3 text-xs text-muted-foreground">
                      {forecast.seasonal
                        ? "Uses your trend and 12-month seasonal pattern."
                        : "Uses your recent trend. Upload 24+ months of data to include seasonality."}{" "}
                      The shaded band shows the range the result should fall in 9 times out of 10.
                    </p>
                  </Card>
                </>
              ) : (
                <Card>
                  <p className="text-sm text-muted-foreground">PULSE needs at least 3 months of sales to build a forecast.</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="insights" className="mt-6">
              <InsightsPanel
                state={insights}
                industry={industry}
                question={question}
                onIndustry={setIndustry}
                onQuestion={setQuestion}
                onGenerate={generate}
                currency={currency}
              />
            </TabsContent>

            <TabsContent value="reports" className="mt-6">
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  { icon: FileSpreadsheet, title: "Excel intelligence report", text: "Summary, monthly results, products, regions, channels, forecast and cleaned data on separate sheets.", action: exportExcel, cta: "Download Excel" },
                  { icon: Printer, title: "PDF board report", text: "A print-ready report with KPIs, tables, forecast and AI recommendations. Choose “Save as PDF” in the print window.", action: () => window.print(), cta: "Print / Save PDF" },
                  { icon: Download, title: "Cleaned dataset (CSV)", text: "Your validated, de-duplicated records ready to reuse in other tools.", action: exportCsv, cta: "Download CSV" },
                ].map((r) => (
                  <Card key={r.title} className="flex flex-col">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <r.icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 font-semibold text-foreground">{r.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">{r.text}</p>
                    <Button className="mt-5" onClick={r.action}>
                      {r.cta}
                    </Button>
                  </Card>
                ))}
              </div>
              {insights.status !== "done" && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Tip: generate AI insights first to include the executive summary and recommendations in your reports.
                </p>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          !problem && (
            <Card>
              <p className="text-sm text-muted-foreground">
                No rows could be analysed with the current column choices. Check that the Date and Revenue columns are correct.
              </p>
            </Card>
          )
        )}
      </div>
      {analysis && cleaned && (
        <PrintReport
          title={reportTitle}
          analysis={analysis}
          forecast={forecast}
          report={cleaned.report}
          insights={insights.status === "done" ? insights.data : null}
          currency={currency}
        />
      )}
    </>
  );
}
