import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h3 className="text-base font-semibold text-foreground">{children}</h3>
      {action}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </p>
  );
}

export function Kpi({
  label,
  value,
  delta,
  deltaLabel,
  invert = false,
}: {
  label: string;
  value: string;
  delta?: number | null;
  deltaLabel?: string;
  invert?: boolean;
}) {
  const good = delta != null && (invert ? delta < 0 : delta > 0);
  return (
    <Card className="p-4 sm:p-5">
      <Eyebrow>{label}</Eyebrow>
      <p className="mt-2 font-display text-xl font-bold text-foreground sm:text-2xl">{value}</p>
      {delta != null && Number.isFinite(delta) ? (
        <p
          className={cn(
            "mt-1 flex items-center gap-1 text-xs font-semibold",
            good ? "text-success" : "text-destructive",
          )}
        >
          {delta >= 0 ? <TrendingUp className="size-3.5" aria-hidden="true" /> : <TrendingDown className="size-3.5" aria-hidden="true" />}
          {delta > 0 ? "+" : ""}
          {(delta * 100).toFixed(1)}% {deltaLabel}
        </p>
      ) : (
        deltaLabel && <p className="mt-1 text-xs text-muted-foreground">{deltaLabel}</p>
      )}
    </Card>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
