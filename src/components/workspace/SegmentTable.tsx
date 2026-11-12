import { useState } from "react";
import { ArrowDownUp } from "lucide-react";
import type { Segment } from "@/lib/pulse/analytics";
import { money, num, pct } from "@/lib/pulse/format";
import { cn } from "@/lib/utils";

type SortKey = "name" | "revenue" | "profit" | "margin" | "share" | "growth" | "quantity";

export function statusFor(s: Segment): { label: string; tone: "good" | "ok" | "bad" } {
  if (s.margin !== null) {
    if (s.margin >= 0.35) return { label: "Star", tone: "good" };
    if (s.margin >= 0.15) return { label: "Healthy", tone: "ok" };
    return { label: "Review pricing", tone: "bad" };
  }
  if (s.growth !== null) {
    if (s.growth >= 0.1) return { label: "Growing", tone: "good" };
    if (s.growth >= -0.05) return { label: "Stable", tone: "ok" };
    return { label: "Declining", tone: "bad" };
  }
  return { label: "—", tone: "ok" };
}

export function SegmentTable({
  rows,
  currency,
  label,
  showCost,
  showQty,
}: {
  rows: Segment[];
  currency: string;
  label: string;
  showCost: boolean;
  showQty: boolean;
}) {
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "revenue", dir: -1 });
  const sorted = [...rows].sort((a, b) => {
    const av = a[sort.key];
    const bv = b[sort.key];
    if (typeof av === "string" && typeof bv === "string") return av.localeCompare(bv) * sort.dir;
    return (((av as number | null) ?? -Infinity) - ((bv as number | null) ?? -Infinity)) * sort.dir;
  });
  const cols: { key: SortKey; label: string; show: boolean }[] = [
    { key: "name", label, show: true },
    { key: "revenue", label: "Revenue", show: true },
    { key: "quantity", label: "Units", show: showQty },
    { key: "profit", label: "Gross profit", show: showCost },
    { key: "margin", label: "Margin", show: showCost },
    { key: "share", label: "Share", show: true },
    { key: "growth", label: "3-mo trend", show: true },
  ];
  const maxMargin = Math.max(0.01, ...rows.map((r) => r.margin ?? 0));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            {cols
              .filter((c) => c.show)
              .map((c) => (
                <th key={c.key} scope="col" className="pb-3 pr-4 font-medium text-muted-foreground"
                  aria-sort={sort.key === c.key ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
                  <button
                    type="button"
                    onClick={() => setSort((s) => ({ key: c.key, dir: s.key === c.key ? (s.dir === 1 ? -1 : 1) : -1 }))}
                    className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.12em] hover:text-foreground"
                  >
                    {c.label}
                    <ArrowDownUp className="size-3" aria-hidden="true" />
                  </button>
                </th>
              ))}
            <th scope="col" className="pb-3 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s) => {
            const st = statusFor(s);
            return (
              <tr key={s.name} className="border-b border-border last:border-0">
                <td className="py-3 pr-4 font-medium text-foreground">{s.name}</td>
                <td className="py-3 pr-4 text-foreground">{money(s.revenue, currency)}</td>
                {showQty && <td className="py-3 pr-4 text-muted-foreground">{s.quantity === null ? "—" : num(s.quantity)}</td>}
                {showCost && <td className="py-3 pr-4 text-muted-foreground">{s.profit === null ? "—" : money(s.profit, currency)}</td>}
                {showCost && (
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                        <span
                          className={cn("block h-full rounded-full", (s.margin ?? 0) < 0.15 ? "bg-destructive" : "bg-gradient-brand")}
                          style={{ width: `${Math.max(0, ((s.margin ?? 0) / maxMargin) * 100)}%` }}
                        />
                      </span>
                      <span className="text-foreground">{pct(s.margin)}</span>
                    </div>
                  </td>
                )}
                <td className="py-3 pr-4 text-muted-foreground">{pct(s.share)}</td>
                <td className={cn("py-3 pr-4 font-medium", (s.growth ?? 0) >= 0 ? "text-success" : "text-destructive")}>
                  {pct(s.growth, true)}
                </td>
                <td className="py-3">
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-xs font-semibold",
                      st.tone === "good" && "bg-success/15 text-success",
                      st.tone === "ok" && "bg-primary/10 text-primary",
                      st.tone === "bad" && "bg-destructive/10 text-destructive",
                    )}
                  >
                    {st.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
