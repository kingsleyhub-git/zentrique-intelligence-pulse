import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NetworkCanvas } from "@/components/hero/NetworkCanvas";
import { PulseDashboard, pulseViews, type PulseView } from "@/components/pulse/PulseDashboard";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { pulseFeatures } from "@/lib/content";
import { cn } from "@/lib/utils";

const screenNotes: Record<PulseView, string> = {
  overview: "KPIs, revenue trend and AI insight at a glance",
  upload: "Drag-and-drop upload with automatic validation",
  revenue: "Revenue by month, branch and channel",
  products: "Margins and profitability per product",
  forecast: "12-month forecast with confidence range",
  reports: "Board-ready PDF and Excel exports",
};

export function PulseShowcase() {
  const [view, setView] = useState<PulseView>("overview");
  const dashRef = useRef<HTMLDivElement>(null);

  const openScreen = (v: PulseView) => {
    setView(v);
    dashRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section
      id="pulse"
      aria-labelledby="pulse-title"
      className="relative isolate scroll-mt-20 overflow-hidden bg-hero py-24 text-hero-foreground lg:py-32"
    >
      <div className="hero-grid absolute inset-0 -z-10" />
      <NetworkCanvas className="absolute inset-0 -z-10 size-full opacity-40" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            id="pulse-title"
            eyebrow="Flagship platform"
            tone="light"
            title={
              <>
                Meet <span className="text-gradient-brand">ZENTRIQUE PULSE</span>
              </>
            }
          >
            Business Intelligence and Decision Support Platform — upload your data and get
            dashboards, forecasts and explainable recommendations in minutes.
          </SectionHeading>
        </Reveal>

        <Reveal delay={100} className="mt-14">
          <div ref={dashRef} className="scroll-mt-28">
            <PulseDashboard view={view} onViewChange={setView} />
          </div>
        </Reveal>

        {/* Product screenshots: each card opens that screen in the live preview above */}
        <div className="mt-10">
          <h3 className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-hero-muted">
            Product screens
          </h3>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {pulseViews.map((v) => (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => openScreen(v.id)}
                  aria-pressed={view === v.id}
                  className={cn(
                    "group flex h-full w-full flex-col gap-3 rounded-xl border p-4 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    view === v.id
                      ? "border-brand-blue bg-glass-strong shadow-glow"
                      : "border-hero-line bg-glass hover:-translate-y-1 hover:border-brand-teal/60",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg transition-colors",
                      view === v.id
                        ? "bg-brand-blue text-primary-foreground"
                        : "bg-navy-deep text-brand-teal",
                    )}
                  >
                    <v.icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-hero-foreground">{v.label}</span>
                  <span className="text-xs leading-relaxed text-hero-muted">{screenNotes[v.id]}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-20 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {pulseFeatures.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80}>
              <div className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-hero-line bg-glass text-brand-teal">
                  <f.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-hero-foreground">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-hero-muted">{f.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16">
          <div className="flex flex-col items-start gap-6 rounded-2xl border border-hero-line bg-glass p-6 backdrop-blur-md sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <Lock className="mt-1 size-5 shrink-0 text-brand-teal" aria-hidden="true" />
              <p className="max-w-xl text-hero-muted">
                <span className="font-semibold text-hero-foreground">See PULSE with your own data.</span>{" "}
                We'll walk you through a private demo using a sample of your business records.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild variant="hero" size="xl" className="group">
                <Link to="/contact" search={{ intent: "demo" }}>
                  Request Demo
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="heroOutline" size="xl">
                <Link to="/contact" search={{ intent: "consultation" }}>
                  Book A Consultation
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
