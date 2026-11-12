import { useState, type ReactNode, type JSX } from "react";
import {
  BarChart3,
  Brain,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  LayoutDashboard,
  LineChart,
  Package,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* Illustrative ZENTRIQUE PULSE workspace with sample data — not live figures. */

export const pulseViews = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "upload", label: "Data Upload", icon: Upload },
  { id: "revenue", label: "Revenue", icon: BarChart3 },
  { id: "products", label: "Products", icon: Package },
  { id: "forecast", label: "Forecast", icon: LineChart },
  { id: "reports", label: "Reports", icon: FileText },
] as const;

export type PulseView = (typeof pulseViews)[number]["id"];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const revenue = [3.1, 3.4, 3.2, 3.8, 3.6, 4.1, 4.4, 4.2, 4.7, 4.9, 5.2, 5.6];

function path(
  values: number[],
  w: number,
  h: number,
  min: number,
  max: number,
  offset = 0,
  total = values.length,
) {
  return values
    .map((v, i) => {
      const x = ((i + offset) / (total - 1)) * w;
      const y = h - ((v - min) / (max - min)) * h;
      return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-xl border border-hero-line bg-navy-deep/60 p-4", className)}>
      {children}
    </div>
  );
}

function PanelTitle({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-hero-muted">{children}</p>
  );
}

function Kpi({
  label,
  value,
  delta,
  up = true,
}: {
  label: string;
  value: string;
  delta: string;
  up?: boolean;
}) {
  return (
    <Panel>
      <PanelTitle>{label}</PanelTitle>
      <p className="mt-2 font-display text-xl font-bold text-hero-foreground sm:text-2xl">{value}</p>
      <p
        className={cn(
          "mt-1 flex items-center gap-1 text-xs font-semibold",
          up ? "text-success" : "text-brand-teal",
        )}
      >
        {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
        {delta}
      </p>
    </Panel>
  );
}

function RevenueChart() {
  const [hover, setHover] = useState<number | null>(null);
  const W = 600;
  const H = 176;
  const min = 2.5;
  const max = 6;
  const d = path(revenue, W, H, min, max);
  const area = `${d} L${W},${H} L0,${H} Z`;
  const idx = hover ?? revenue.length - 1;
  const value = revenue[idx] ?? 0;
  const x = (idx / (revenue.length - 1)) * 100;
  const yPx = (1 - (value - min) / (max - min)) * H;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-44 w-full overflow-visible"
        preserveAspectRatio="none"
        role="img"
        aria-label="Monthly revenue rising from KES 3.1M in January to KES 5.6M in December"
      >
        <defs>
          <linearGradient id="pulse-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--brand-blue)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--brand-blue)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1="0"
            x2={W}
            y1={H * f}
            y2={H * f}
            stroke="var(--hero-line)"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path d={area} fill="url(#pulse-area)" />
        <path
          d={d}
          fill="none"
          stroke="var(--brand-blue-glow)"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
        {revenue.map((_, i) => (
          <rect
            key={i}
            x={(i / (revenue.length - 1)) * W - W / 22}
            y={0}
            width={W / 11}
            height={H}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </svg>
      <span
        className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-hero-foreground bg-brand-blue shadow-glow transition-all duration-200"
        style={{ left: `${x}%`, top: `${yPx}px` }}
      />
      <div
        className="pointer-events-none absolute -translate-x-1/2 rounded-lg border border-hero-line bg-glass-strong px-3 py-1.5 text-center shadow-lg backdrop-blur transition-all duration-200"
        style={{ left: `${Math.min(88, Math.max(12, x))}%`, top: `${Math.max(0, yPx - 56)}px` }}
      >
        <p className="text-[0.6rem] text-hero-muted">{months[idx]} 2026</p>
        <p className="text-xs font-bold text-hero-foreground">KES {value.toFixed(1)}M</p>
      </div>
      <div className="mt-2 flex justify-between text-[0.6rem] text-hero-muted">
        {months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}

function Recommendation() {
  const drivers: [string, number][] = [
    ["Seasonal demand", 82],
    ["Margin contribution", 64],
    ["Stock-out risk", 48],
  ];
  return (
    <Panel className="border-brand-teal/30 bg-brand-teal/5">
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-lg bg-brand-teal/20 text-brand-teal">
          <Brain className="size-4" />
        </span>
        <p className="text-sm font-semibold text-hero-foreground">AI Recommendation</p>
        <Sparkles className="ml-auto size-4 text-brand-teal" />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-hero-muted">
        Increase stock of <span className="font-semibold text-hero-foreground">Product C</span> by
        15% before December. It has the highest margin (42%) and demand is forecast to rise 18%.
      </p>
      <div className="mt-3 space-y-1.5">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-hero-muted">
          Why this recommendation
        </p>
        {drivers.map(([k, v]) => (
          <div key={k} className="flex items-center gap-2 text-[0.7rem] text-hero-muted">
            <span className="w-32 shrink-0">{k}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-hero-line">
              <span className="block h-full rounded-full bg-gradient-brand" style={{ width: `${v}%` }} />
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

const products = [
  { name: "Product C", revenue: 14.2, margin: 42 },
  { name: "Product A", revenue: 12.8, margin: 35 },
  { name: "Product E", revenue: 9.6, margin: 29 },
  { name: "Product B", revenue: 7.4, margin: 18 },
  { name: "Product D", revenue: 4.2, margin: 6 },
];

function OverviewView() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi label="Revenue YTD" value="KES 48.2M" delta="+18.4% vs LY" />
        <Kpi label="Gross margin" value="31.6%" delta="+2.1 pts" />
        <Kpi label="Orders" value="12,480" delta="+9.7%" />
        <Kpi label="Cost per order" value="KES 1,240" delta="-4.3%" up={false} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel>
          <div className="mb-3 flex items-center justify-between">
            <PanelTitle>Monthly revenue · hover to explore</PanelTitle>
            <span className="rounded-md bg-brand-blue/20 px-2 py-0.5 text-[0.6rem] font-semibold text-hero-foreground">
              2026
            </span>
          </div>
          <RevenueChart />
        </Panel>
        <Recommendation />
      </div>
    </div>
  );
}

function UploadView() {
  const checks = [
    ["12,480 rows scanned", "Columns match the sales template"],
    ["37 missing values", "Filled using product averages"],
    ["12 duplicate records", "Removed automatically"],
    ["Dates & currencies", "Standardised to KES and ISO dates"],
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <Panel className="flex flex-col items-center justify-center border-dashed py-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-blue/15 text-brand-blue-glow">
          <Upload className="size-6" />
        </span>
        <p className="mt-4 text-sm font-semibold text-hero-foreground">Drop CSV or Excel files</p>
        <p className="mt-1 text-xs text-hero-muted">Encrypted in transit and at rest</p>
        <div className="mt-6 w-full max-w-xs rounded-lg border border-hero-line bg-glass p-3 text-left">
          <div className="flex items-center gap-2 text-xs text-hero-foreground">
            <FileSpreadsheet className="size-4 text-brand-teal" /> sales_2026_q3.csv
            <span className="ml-auto text-hero-muted">2.4 MB</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-hero-line">
            <div className="h-full w-full rounded-full bg-gradient-brand" />
          </div>
        </div>
      </Panel>
      <Panel>
        <PanelTitle>Data validation report</PanelTitle>
        <ul className="mt-4 space-y-3">
          {checks.map(([a, b]) => (
            <li key={a} className="flex items-start gap-3 rounded-lg border border-hero-line bg-glass p-3">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
              <div>
                <p className="text-sm font-semibold text-hero-foreground">{a}</p>
                <p className="text-xs text-hero-muted">{b}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-xs font-semibold text-success">
          <CheckCircle2 className="size-4" /> Dataset ready for analysis · quality score 98/100
        </p>
      </Panel>
    </div>
  );
}

function RevenueView() {
  const channels = [
    { name: "Retail", cls: "bg-brand-blue" },
    { name: "Online", cls: "bg-brand-teal" },
    { name: "Wholesale", cls: "bg-chart-3" },
  ];
  const data = [
    [1.6, 0.9, 0.6],
    [1.7, 1.0, 0.7],
    [1.6, 1.0, 0.6],
    [1.8, 1.2, 0.8],
    [1.7, 1.2, 0.7],
    [1.9, 1.4, 0.8],
  ];
  const regions = [
    ["Nairobi", "KES 21.4M", "+22%"],
    ["Mombasa", "KES 11.0M", "+15%"],
    ["Kisumu", "KES 8.3M", "+11%"],
    ["Nakuru", "KES 7.5M", "+9%"],
  ];
  return (
    <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PanelTitle>Revenue by channel · last 6 months</PanelTitle>
          <div className="flex gap-3">
            {channels.map((c) => (
              <span key={c.name} className="flex items-center gap-1.5 text-[0.65rem] text-hero-muted">
                <span className={cn("size-2 rounded-sm", c.cls)} />
                {c.name}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-6 flex h-48 items-end gap-3 sm:gap-4">
          {data.map((m, i) => (
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <div
                className="animate-grow flex w-full flex-col-reverse overflow-hidden rounded-md"
                style={{
                  height: `${(m.reduce((a, b) => a + b, 0) / 4.2) * 100}%`,
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                {m.map((v, j) => (
                  <div key={j} className={cn("w-full", channels[j]?.cls)} style={{ flex: v }} />
                ))}
              </div>
              <span className="text-[0.6rem] text-hero-muted">{months[i + 6]}</span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel>
        <PanelTitle>Top regions</PanelTitle>
        <table className="mt-3 w-full text-left text-sm">
          <tbody>
            {regions.map(([r, v, g]) => (
              <tr key={r} className="border-b border-hero-line last:border-0">
                <td className="py-3 text-hero-foreground">{r}</td>
                <td className="py-3 text-hero-muted">{v}</td>
                <td className="py-3 text-right font-semibold text-success">{g}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function ProductsView() {
  return (
    <Panel>
      <PanelTitle>Product profitability · YTD</PanelTitle>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="text-[0.65rem] uppercase tracking-[0.14em] text-hero-muted">
              <th className="pb-3 font-medium">Product</th>
              <th className="pb-3 font-medium">Revenue</th>
              <th className="pb-3 font-medium">Margin</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.name} className="border-t border-hero-line">
                <td className="py-3.5 font-medium text-hero-foreground">{p.name}</td>
                <td className="py-3.5 text-hero-muted">KES {p.revenue}M</td>
                <td className="py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-32 overflow-hidden rounded-full bg-hero-line">
                      <span
                        className={cn(
                          "block h-full rounded-full",
                          p.margin < 10 ? "bg-destructive" : "bg-gradient-brand",
                        )}
                        style={{ width: `${(p.margin / 45) * 100}%` }}
                      />
                    </span>
                    <span className="text-hero-foreground">{p.margin}%</span>
                  </div>
                </td>
                <td className="py-3.5">
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[0.65rem] font-semibold",
                      p.margin >= 30
                        ? "bg-success/15 text-success"
                        : p.margin >= 15
                          ? "bg-brand-blue/20 text-hero-foreground"
                          : "bg-destructive/20 text-hero-foreground",
                    )}
                  >
                    {p.margin >= 30 ? "Star" : p.margin >= 15 ? "Healthy" : "Review pricing"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function ForecastView() {
  const W = 600;
  const H = 180;
  const hist = revenue.slice(4);
  const fc = [5.6, 5.9, 6.3, 6.6];
  const total = hist.length + fc.length - 1;
  const min = 3;
  const max = 7.5;
  const up = fc.map((v, i) => v + i * 0.25);
  const lo = fc.map((v, i) => v - i * 0.25);
  const upPath = path(up, W, H, min, max, hist.length - 1, total);
  const loPts = lo
    .map(
      (v, i) =>
        `${(((hist.length - 1 + i) / (total - 1)) * W).toFixed(1)},${(H - ((v - min) / (max - min)) * H).toFixed(1)}`,
    )
    .reverse()
    .join(" L");
  return (
    <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
      <Panel>
        <PanelTitle>Revenue forecast · next 3 months</PanelTitle>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mt-4 h-48 w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label="Revenue forecast continuing upward to KES 6.6M with a 90% confidence band"
        >
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1="0"
              x2={W}
              y1={H * f}
              y2={H * f}
              stroke="var(--hero-line)"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path d={`${upPath} L${loPts} Z`} fill="var(--brand-teal)" opacity="0.15" />
          <path
            d={path(hist, W, H, min, max, 0, total)}
            fill="none"
            stroke="var(--brand-blue-glow)"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={path(fc, W, H, min, max, hist.length - 1, total)}
            fill="none"
            stroke="var(--brand-teal)"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="mt-2 flex flex-wrap gap-4 text-[0.65rem] text-hero-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-brand-blue" /> Actual
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-brand-teal" /> Forecast
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-sm bg-brand-teal/30" /> 90% confidence
          </span>
        </div>
      </Panel>
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Kpi label="Q1 forecast" value="KES 18.8M" delta="+14% vs Q4" />
          <Panel>
            <PanelTitle>Model error</PanelTitle>
            <p className="mt-2 font-display text-2xl font-bold text-hero-foreground">6.1%</p>
            <p className="mt-1 text-xs text-hero-muted">Back-tested</p>
          </Panel>
        </div>
        <Panel>
          <PanelTitle>Key drivers</PanelTitle>
          <ul className="mt-3 space-y-2 text-sm text-hero-muted">
            <li className="flex justify-between">
              <span>Holiday seasonality</span>
              <span className="text-success">+9.2%</span>
            </li>
            <li className="flex justify-between">
              <span>Online growth trend</span>
              <span className="text-success">+5.4%</span>
            </li>
            <li className="flex justify-between">
              <span>Price adjustment</span>
              <span className="text-hero-foreground">-1.1%</span>
            </li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function ReportsView() {
  const reports = [
    ["Monthly Performance Report", "December 2026 · 14 pages", "PDF"],
    ["Product Profitability Analysis", "YTD 2026 · 8 pages", "PDF"],
    ["Sales Data Export", "12,480 rows", "Excel"],
    ["Q1 Forecast & Recommendations", "Board pack · 6 pages", "PDF"],
  ];
  return (
    <Panel>
      <PanelTitle>Downloadable reports</PanelTitle>
      <ul className="mt-4 divide-y divide-hero-line">
        {reports.map(([t, m, f]) => (
          <li key={t} className="flex items-center gap-4 py-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue/15 text-brand-blue-glow">
              {f === "PDF" ? <FileText className="size-5" /> : <FileSpreadsheet className="size-5" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-hero-foreground">{t}</p>
              <p className="text-xs text-hero-muted">{m}</p>
            </div>
            <span className="hidden items-center gap-1.5 rounded-md border border-hero-line px-3 py-1.5 text-xs font-medium text-hero-foreground sm:inline-flex">
              <Download className="size-3.5" /> {f}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

const viewMap: Record<PulseView, () => JSX.Element> = {
  overview: OverviewView,
  upload: UploadView,
  revenue: RevenueView,
  products: ProductsView,
  forecast: ForecastView,
  reports: ReportsView,
};

export function PulseDashboard({
  view,
  onViewChange,
}: {
  view: PulseView;
  onViewChange: (v: PulseView) => void;
}) {
  const View = viewMap[view];
  const current = pulseViews.find((v) => v.id === view) ?? pulseViews[0];

  return (
    <div className="overflow-hidden rounded-2xl border border-hero-line bg-navy shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2 border-b border-hero-line bg-navy-deep px-4 py-3">
        <span className="size-2.5 rounded-full bg-destructive/70" />
        <span className="size-2.5 rounded-full bg-chart-4/70" />
        <span className="size-2.5 rounded-full bg-success/70" />
        <span className="ml-4 hidden rounded-md bg-glass px-3 py-1 font-mono text-[0.65rem] text-hero-muted sm:block">
          ZENTRIQUE PULSE · Sample Retail Ltd workspace
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-[0.65rem] text-hero-muted">
          <span className="size-1.5 rounded-full bg-success animate-pulse-dot" /> Interactive preview
        </span>
      </div>

      <div className="grid md:grid-cols-[200px_1fr]">
        <div
          role="tablist"
          aria-label="PULSE modules"
          aria-orientation="vertical"
          className="flex gap-1 overflow-x-auto border-b border-hero-line p-3 md:flex-col md:border-b-0 md:border-r"
        >
          {pulseViews.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              id={`pulse-tab-${v.id}`}
              aria-selected={view === v.id}
              aria-controls="pulse-panel"
              onClick={() => onViewChange(v.id)}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                view === v.id
                  ? "bg-brand-blue text-primary-foreground shadow-glow"
                  : "text-hero-muted hover:bg-glass hover:text-hero-foreground",
              )}
            >
              <v.icon className="size-4" aria-hidden="true" />
              {v.label}
            </button>
          ))}
        </div>

        <div
          id="pulse-panel"
          role="tabpanel"
          aria-labelledby={`pulse-tab-${view}`}
          className="min-w-0 p-4 sm:p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-hero-foreground">
              {current.label}
            </h3>
            <span className="text-xs text-hero-muted">Sample data</span>
          </div>
          <div key={view} className="animate-fade-up" style={{ animationDuration: "0.5s" }}>
            <View />
          </div>
        </div>
      </div>
    </div>
  );
}
