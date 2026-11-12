import { Brain, Sparkles, TrendingUp } from "lucide-react";

/* Illustrative ZENTRIQUE PULSE preview — sample figures, not live data. */
const actual = [38, 42, 40, 47, 45, 52, 58, 55, 63, 68];
const forecast = [68, 72, 75, 80];

function toPath(values: number[], startIndex: number, total: number, w: number, h: number) {
  return values
    .map((v, i) => {
      const x = ((startIndex + i) / (total - 1)) * w;
      const y = h - ((v - 30) / 55) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

const W = 340;
const H = 120;
const TOTAL = actual.length + forecast.length - 1;
const actualPath = toPath(actual, 0, TOTAL, W, H);
const forecastPath = toPath(forecast, actual.length - 1, TOTAL, W, H);
const bandUpper = toPath(forecast.map((v, i) => v + i * 2.5), actual.length - 1, TOTAL, W, H);
const bandLower = toPath(
  forecast.map((v, i) => v - i * 2.5).reverse(),
  actual.length - 1,
  TOTAL,
  W,
  H,
);
// reverse x for the lower edge so the polygon closes cleanly
const lowerPts = forecast
  .map((v, i) => v - i * 2.5)
  .map((v, i) => {
    const x = ((actual.length - 1 + i) / (TOTAL - 1)) * W;
    const y = H - ((v - 30) / 55) * H;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  })
  .reverse()
  .join(" L");
void bandLower;
const bandPath = `${bandUpper} L${lowerPts} Z`;
const areaPath = `${actualPath} L${(((actual.length - 1) / (TOTAL - 1)) * W).toFixed(1)},${H} L0,${H} Z`;

const bars = [
  { label: "A", v: 82 },
  { label: "B", v: 64 },
  { label: "C", v: 91 },
  { label: "D", v: 47 },
  { label: "E", v: 73 },
];

export function DashboardCluster() {
  return (
    <div className="relative mx-auto aspect-[1/0.95] w-full max-w-[560px]" aria-hidden="true">
      {/* Glow */}
      <div className="absolute inset-[10%] rounded-full bg-gradient-brand opacity-20 blur-3xl" />

      {/* Main revenue intelligence card */}
      <div className="glass-panel animate-float absolute left-[4%] top-[8%] w-[84%] rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-brand-teal animate-pulse-dot" />
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-hero-muted">
              PULSE · Revenue Intelligence
            </span>
          </div>
          <div className="flex gap-1 text-[0.65rem] font-medium">
            <span className="rounded-md bg-glass-strong px-2 py-1 text-hero-foreground">12M</span>
            <span className="px-2 py-1 text-hero-muted">YTD</span>
          </div>
        </div>
        <div className="mt-4 flex items-end gap-3">
          <span className="font-display text-3xl font-bold text-hero-foreground">KES 4.82M</span>
          <span className="mb-1 flex items-center gap-1 rounded-md bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">
            <TrendingUp className="size-3" /> +18.4%
          </span>
        </div>
        <svg viewBox={`0 0 ${W} ${H + 10}`} className="mt-4 h-auto w-full overflow-visible">
          <defs>
            <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--brand-blue)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="var(--brand-blue)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="var(--hero-line)" />
          ))}
          <path d={areaPath} fill="url(#area)" className="animate-fade-up" />
          <path d={bandPath} fill="var(--brand-teal)" opacity="0.14" />
          <path
            d={actualPath}
            fill="none"
            stroke="var(--brand-blue-glow)"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="animate-draw"
          />
          <path
            d={forecastPath}
            fill="none"
            stroke="var(--brand-teal)"
            strokeWidth="2.5"
            strokeDasharray="5 5"
            strokeLinecap="round"
          />
        </svg>
        <div className="mt-3 flex gap-4 text-[0.65rem] text-hero-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded bg-brand-blue" /> Actual
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded bg-brand-teal" /> Forecast · 90% band
          </span>
        </div>
      </div>

      {/* Forecast accuracy gauge */}
      <div
        className="glass-panel animate-float-slow absolute right-0 top-0 w-[34%] rounded-2xl p-4"
        style={{ animationDelay: "-2s" }}
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-hero-muted">
          Model accuracy
        </span>
        <div className="relative mx-auto mt-2 size-20">
          <svg viewBox="0 0 36 36" className="size-full -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--hero-line)" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="var(--brand-teal)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="94 100"
              className="animate-draw"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display text-lg font-bold text-hero-foreground">
            94%
          </span>
        </div>
      </div>

      {/* Profitability bars */}
      <div
        className="glass-panel animate-float-slow absolute bottom-[2%] left-0 w-[44%] rounded-2xl p-4"
        style={{ animationDelay: "-4s" }}
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-hero-muted">
          Product profitability
        </span>
        <div className="mt-3 flex h-20 items-end justify-between gap-2">
          {bars.map((b, i) => (
            <div key={b.label} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="animate-grow w-full rounded-t-md bg-gradient-brand"
                style={{ height: `${b.v}%`, animationDelay: `${0.8 + i * 0.12}s` }}
              />
              <span className="text-[0.6rem] text-hero-muted">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI recommendation */}
      <div
        className="glass-panel animate-float absolute bottom-[6%] right-[2%] w-[50%] rounded-2xl p-4"
        style={{ animationDelay: "-3s" }}
      >
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-brand-teal/20 text-brand-teal">
            <Brain className="size-4" />
          </span>
          <span className="text-xs font-semibold text-hero-foreground">AI Recommendation</span>
          <Sparkles className="ml-auto size-3.5 text-brand-teal" />
        </div>
        <p className="mt-2.5 text-[0.72rem] leading-relaxed text-hero-muted">
          Shift 12% of stock budget to Product C — projected margin{" "}
          <span className="font-semibold text-success">+8.4%</span>.
        </p>
        <div className="mt-2.5 flex gap-1.5">
          <span className="rounded-md border border-hero-line px-2 py-0.5 text-[0.6rem] text-hero-muted">
            Explainable
          </span>
          <span className="rounded-md border border-hero-line px-2 py-0.5 text-[0.6rem] text-hero-muted">
            Evidence-based
          </span>
        </div>
      </div>
    </div>
  );
}
