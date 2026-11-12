import { AlertTriangle, Brain, CheckCircle2, Loader2, MessageSquareText, Minus, Sparkles, Target, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PulseInsights } from "@/lib/pulse/insights.schema";
import { money } from "@/lib/pulse/format";
import { cn } from "@/lib/utils";
import { Card, CardTitle, Eyebrow } from "./ui";

export type InsightState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; data: PulseInsights; at: Date }
  | { status: "error"; error: string };

const QUESTIONS = [
  "Which product should we prioritise next quarter?",
  "Where are we losing margin and how do we fix it?",
  "Which region has the most growth potential?",
];

export function InsightsPanel({
  state,
  industry,
  question,
  onIndustry,
  onQuestion,
  onGenerate,
  currency,
}: {
  state: InsightState;
  industry: string;
  question: string;
  onIndustry: (v: string) => void;
  onQuestion: (v: string) => void;
  onGenerate: () => void;
  currency: string;
}) {
  const loading = state.status === "loading";
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Brain className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-foreground">AI Decision Support</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              PULSE AI reads your calculated results and returns a diagnosis, three forward scenarios and
              explainable recommendations. Only summary totals are shared — never your rows.
            </p>
          </div>
        </div>
        <form
          className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.6fr_auto] lg:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            onGenerate();
          }}
        >
          <div>
            <label htmlFor="ai-industry" className="text-sm font-medium text-foreground">
              Your business (optional)
            </label>
            <input
              id="ai-industry"
              value={industry}
              maxLength={120}
              onChange={(e) => onIndustry(e.target.value)}
              placeholder="e.g. Coffee retailer in Kenya"
              className="mt-1.5 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="ai-question" className="text-sm font-medium text-foreground">
              Ask a question (optional)
            </label>
            <input
              id="ai-question"
              value={question}
              maxLength={600}
              onChange={(e) => onQuestion(e.target.value)}
              placeholder="e.g. Where should we invest to grow 20% next year?"
              className="mt-1.5 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button type="submit" size="lg" disabled={loading} className="h-10">
            {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Sparkles aria-hidden="true" />}
            {loading ? "Analysing…" : state.status === "done" ? "Regenerate" : "Generate Strategic Intelligence"}
          </Button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onQuestion(q)}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              {q}
            </button>
          ))}
        </div>
      </Card>

      <div aria-live="polite">
        {state.status === "loading" && (
          <Card className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-primary" aria-hidden="true" />
            PULSE AI is studying your trends, margins and forecast. This usually takes 20–40 seconds.
          </Card>
        )}
        {state.status === "error" && (
          <Card className="border-destructive/40">
            <p role="alert" className="flex items-start gap-2 text-sm font-medium text-destructive">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {state.error}
            </p>
          </Card>
        )}
        {state.status === "done" && <InsightsView data={state.data} currency={currency} />}
      </div>
    </div>
  );
}

const sentimentIcon = { positive: TrendingUp, negative: TrendingDown, neutral: Minus };

export function InsightsView({ data, currency }: { data: PulseInsights; currency: string }) {
  return (
    <div className="space-y-6">
      <Card className="bg-hero text-hero-foreground border-transparent">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-brand-teal">Executive summary</p>
            <h3 className="mt-2 text-xl font-bold sm:text-2xl">{data.headline}</h3>
            <p className="mt-3 text-sm leading-relaxed text-hero-muted">{data.summary}</p>
          </div>
          <div className="shrink-0 rounded-xl border border-hero-line bg-glass p-4 text-center">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-hero-muted">Health score</p>
            <p className="mt-1 font-display text-4xl font-bold">{data.healthScore}</p>
            <p className="text-xs text-hero-muted">out of 100</p>
          </div>
        </div>
      </Card>

      {data.answer && (
        <Card className="border-primary/30">
          <CardTitle>
            <span className="inline-flex items-center gap-2">
              <MessageSquareText className="size-4 text-primary" aria-hidden="true" /> Answer to your question
            </span>
          </CardTitle>
          <p className="text-sm leading-relaxed text-foreground">{data.answer}</p>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Key findings</CardTitle>
          <ul className="space-y-3">
            {data.findings.map((f) => {
              const Icon = sentimentIcon[f.sentiment];
              return (
                <li key={f.title} className="flex gap-3">
                  <Icon
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      f.sentiment === "positive" ? "text-success" : f.sentiment === "negative" ? "text-destructive" : "text-muted-foreground",
                    )}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{f.title}</p>
                    <p className="text-sm text-muted-foreground">{f.detail}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card>
          <CardTitle>Risks to watch</CardTitle>
          <ul className="space-y-3">
            {data.risks.map((r) => (
              <li key={r.title} className="flex gap-3">
                <AlertTriangle
                  className={cn("mt-0.5 size-4 shrink-0", r.severity === "high" ? "text-destructive" : "text-chart-4")}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {r.title} <span className="ml-1 text-xs font-normal uppercase text-muted-foreground">{r.severity}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{r.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div>
        <Eyebrow>Predictive scenarios · next 6 months</Eyebrow>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          {data.scenarios.map((s) => (
            <Card key={s.name} className={cn(s.name === "Base" && "border-primary/50")}>
              <p className="text-sm font-semibold text-foreground">{s.name}</p>
              <p className="mt-2 font-display text-2xl font-bold text-foreground">{money(s.revenueNext6Months, currency)}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.assumption}</p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Eyebrow>Explainable recommendations</Eyebrow>
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          {data.recommendations.map((r, i) => (
            <Card key={r.title}>
              <div className="flex items-start justify-between gap-3">
                <p className="flex items-start gap-2 text-base font-semibold text-foreground">
                  <Target className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  {i + 1}. {r.title}
                </p>
                <span
                  className={cn(
                    "shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold capitalize",
                    r.priority === "high" ? "bg-destructive/10 text-destructive" : r.priority === "medium" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                  )}
                >
                  {r.priority} priority
                </span>
              </div>
              <p className="mt-3 text-sm text-foreground">{r.action}</p>
              <p className="mt-2 text-sm text-muted-foreground">{r.rationale}</p>
              <p className="mt-3 flex items-start gap-2 text-sm font-medium text-success">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {r.expectedImpact}
              </p>
              <div className="mt-4 space-y-1.5">
                <Eyebrow>Why this recommendation</Eyebrow>
                {r.drivers.map((d) => (
                  <div key={d.factor} className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="w-40 shrink-0 truncate" title={d.factor}>{d.factor}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <span className="block h-full rounded-full bg-gradient-brand" style={{ width: `${d.weight}%` }} />
                    </span>
                    <span className="w-8 text-right">{d.weight}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        AI-generated guidance based on your figures. Review with your team before acting on it.
      </p>
    </div>
  );
}
