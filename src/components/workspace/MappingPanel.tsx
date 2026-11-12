import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { FIELD_INFO, FIELD_KEYS, monthLabel, type ColumnMapping, type ValidationReport } from "@/lib/pulse/analytics";
import { num } from "@/lib/pulse/format";
import { cn } from "@/lib/utils";
import { Card, CardTitle, SelectField } from "./ui";

const plural = (n: number, word: string) => `${num(n)} ${word}${n === 1 ? "" : "s"}`;

export function MappingPanel({
  headers,
  mapping,
  onChange,
  report,
  problem,
}: {
  headers: string[];
  mapping: ColumnMapping;
  onChange: (m: ColumnMapping) => void;
  report: ValidationReport | null;
  problem: string | null;
}) {
  const options = [{ value: "", label: "— Not in my data —" }, ...headers.map((h) => ({ value: h, label: h }))];
  const checks: { ok: boolean; text: string; sub: string }[] = report
    ? [
        { ok: true, text: `${num(report.totalRows)} rows scanned`, sub: `${num(report.validRows)} ready for analysis` },
        {
          ok: report.duplicatesRemoved === 0,
          text: plural(report.duplicatesRemoved, "duplicate row"),
          sub: report.duplicatesRemoved ? "Removed automatically" : "None found",
        },
        {
          ok: report.missingDate === 0,
          text: `${plural(report.missingDate, "row")} with a missing or unreadable date`,
          sub: report.missingDate ? "Excluded from analysis" : "All dates readable",
        },
        {
          ok: report.invalidRevenue === 0,
          text: `${plural(report.invalidRevenue, "row")} with no valid amount`,
          sub: report.invalidRevenue ? "Excluded from analysis" : "All amounts readable",
        },
        {
          ok: report.filledLabels === 0,
          text: plural(report.filledLabels, "blank label"),
          sub: report.filledLabels ? "Grouped as “Unspecified”" : "All labels present",
        },
      ]
    : [];

  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <Card>
        <CardTitle>Match your columns</CardTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          {FIELD_KEYS.map((f) => (
            <SelectField
              key={f}
              id={`map-${f}`}
              label={FIELD_INFO[f].label}
              hint={FIELD_INFO[f].hint}
              value={mapping[f] ?? ""}
              options={options}
              onChange={(v) => onChange({ ...mapping, [f]: v || null })}
            />
          ))}
        </div>
      </Card>
      <Card>
        <CardTitle>Data validation report</CardTitle>
        {problem ? (
          <p role="alert" className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {problem}
          </p>
        ) : report ? (
          <>
            <ul className="space-y-2.5">
              {checks.map((c) => (
                <li key={c.text} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  {c.ok ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                  ) : (
                    <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-foreground">{c.text}</p>
                    <p className="text-xs text-muted-foreground">{c.sub}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div
              className={cn(
                "mt-4 rounded-lg px-3 py-2.5 text-sm font-semibold",
                report.qualityScore >= 90 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
              )}
            >
              Quality score {report.qualityScore}/100
              {report.firstMonth && report.lastMonth && (
                <span className="block text-xs font-normal text-muted-foreground">
                  {monthLabel(report.firstMonth)} – {monthLabel(report.lastMonth)} · {report.monthsCovered} months with sales
                </span>
              )}
            </div>
          </>
        ) : null}
      </Card>
    </div>
  );
}
