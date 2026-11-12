import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ForecastResult, MonthPoint, Segment } from "@/lib/pulse/analytics";
import { axis, money } from "@/lib/pulse/format";

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--foreground)",
};
const tick = { fontSize: 11, fill: "var(--muted-foreground)" };

export function TrendChart({ data, currency, showProfit }: { data: MonthPoint[]; currency: string; showProfit: boolean }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="ws-rev" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tick={tick} tickLine={false} axisLine={false} minTickGap={20} />
          <YAxis tick={tick} tickLine={false} axisLine={false} tickFormatter={axis} width={48} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => money(v, currency, false)} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area type="monotone" dataKey="revenue" name="Revenue" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#ws-rev)" />
          {showProfit && (
            <Area type="monotone" dataKey="profit" name="Gross profit" stroke="var(--chart-2)" strokeWidth={2} fill="transparent" />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonthlyBars({ data, currency, showCost }: { data: MonthPoint[]; currency: string; showCost: boolean }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tick={tick} tickLine={false} axisLine={false} minTickGap={20} />
          <YAxis tick={tick} tickLine={false} axisLine={false} tickFormatter={axis} width={48} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => money(v, currency, false)} cursor={{ fill: "var(--muted)" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="revenue" name="Revenue" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
          {showCost && <Bar dataKey="cost" name="Cost" fill="var(--chart-5)" radius={[4, 4, 0, 0]} />}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SegmentBars({ data, currency, color = "var(--chart-1)" }: { data: Segment[]; currency: string; color?: string }) {
  const rows = data.slice(0, 8);
  return (
    <div className="w-full" style={{ height: Math.max(160, rows.length * 40) }}>
      <ResponsiveContainer>
        <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" horizontal={false} />
          <XAxis type="number" tick={tick} tickLine={false} axisLine={false} tickFormatter={axis} />
          <YAxis type="category" dataKey="name" tick={tick} tickLine={false} axisLine={false} width={120} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => money(v, currency, false)} cursor={{ fill: "var(--muted)" }} />
          <Bar dataKey="revenue" name="Revenue" fill={color} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ForecastChart({
  history,
  forecast,
  currency,
}: {
  history: MonthPoint[];
  forecast: ForecastResult;
  currency: string;
}) {
  const recent = history.slice(-18);
  const last = recent[recent.length - 1];
  const data = [
    ...recent.map((m) => ({
      label: m.label,
      actual: m.revenue,
      forecast: m === last ? m.revenue : null,
      band: m === last ? [m.revenue, m.revenue] : null,
    })),
    ...forecast.points.map((p) => ({ label: p.label, actual: null, forecast: p.value, band: [p.lower, p.upper] })),
  ];
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tick={tick} tickLine={false} axisLine={false} minTickGap={20} />
          <YAxis tick={tick} tickLine={false} axisLine={false} tickFormatter={axis} width={48} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v: number | number[]) =>
              Array.isArray(v) ? `${money(v[0] ?? 0, currency)} – ${money(v[1] ?? 0, currency)}` : money(v, currency, false)
            }
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area dataKey="band" name="90% confidence" stroke="none" fill="var(--chart-2)" fillOpacity={0.18} />
          <Line dataKey="actual" name="Actual" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} />
          <Line dataKey="forecast" name="Forecast" stroke="var(--chart-2)" strokeWidth={2.5} strokeDasharray="6 5" dot={{ r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
