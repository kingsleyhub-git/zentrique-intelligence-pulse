import { ArrowRight, BadgeCheck, Check, Eye, Lock, Play, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NetworkCanvas } from "./NetworkCanvas";
import { DashboardCluster } from "./DashboardCluster";
import { StatCounter } from "./StatCounter";

const capabilities = [
  "Business Intelligence",
  "Artificial Intelligence",
  "Predictive Analytics",
  "Decision Support Systems",
  "Data Engineering",
  "Strategic Intelligence",
];

const stats = [
  { value: 7, suffix: "", label: "Intelligence pillars" },
  { value: 3, suffix: "", label: "Dimensions of intelligence" },
  { value: 4, suffix: "", label: "Sectors served" },
  { value: 100, suffix: "%", label: "Explainable insights" },
];

const trust = [
  { icon: Lock, label: "Secure data handling" },
  { icon: Eye, label: "Explainable AI" },
  { icon: BadgeCheck, label: "Validated analytics" },
  { icon: ShieldCheck, label: "Client data separation" },
];

export function Hero() {
  return (
    <section className="relative isolate flex min-h-screen flex-col overflow-hidden bg-hero text-hero-foreground">
      <div className="hero-grid absolute inset-0 -z-10" />
      <NetworkCanvas className="absolute inset-0 -z-10 size-full" />

      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-14 px-6 pb-12 pt-32 lg:grid-cols-[1.05fr_1fr] lg:px-8 lg:pt-36">
        <div>
          <div
            className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-hero-line bg-glass px-4 py-1.5 backdrop-blur-md"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="size-1.5 rounded-full bg-brand-teal animate-pulse-dot" />
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-hero-muted">
              Intelligence Beyond Data
            </span>
          </div>

          <h1
            className="animate-fade-up mt-6 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-[4.1rem]"
            style={{ animationDelay: "0.15s" }}
          >
            Transform Data Into <span className="text-gradient-brand">Strategic Intelligence</span>
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-hero-muted"
            style={{ animationDelay: "0.3s" }}
          >
            AI-powered Business Intelligence, Analytics, Forecasting and Decision Support Solutions
            that help organizations make smarter and faster decisions.
          </p>

          <div
            className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "0.45s" }}
          >
            <Button variant="hero" size="xl" className="group">
              Book A Consultation
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="heroOutline" size="xl">
              <Play className="fill-current text-brand-teal" />
              Explore ZENTRIQUE PULSE
            </Button>
          </div>

          <ul
            className="animate-fade-up mt-10 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-3"
            style={{ animationDelay: "0.6s" }}
          >
            {capabilities.map((c) => (
              <li key={c} className="flex items-center gap-2.5 text-sm font-medium text-hero-foreground">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-teal/20 text-brand-teal">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "0.35s" }}>
          <DashboardCluster />
        </div>
      </div>

      {/* Stats + trust bar */}
      <div className="relative border-t border-hero-line bg-glass-strong backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <StatCounter key={s.label} {...s} />
            ))}
          </div>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 lg:border-l lg:border-hero-line lg:pl-10">
            {trust.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-hero-muted">
                <Icon className="size-4 shrink-0 text-brand-teal" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
