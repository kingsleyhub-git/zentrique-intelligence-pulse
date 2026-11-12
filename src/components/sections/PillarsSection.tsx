import {
  BarChart3,
  BrainCircuit,
  Database,
  FlaskConical,
  Route as RouteIcon,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";

const pillars: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: BrainCircuit,
    title: "Artificial Intelligence & Machine Learning",
    description:
      "Models that learn from your data to detect patterns, automate analysis and surface opportunities.",
  },
  {
    icon: BarChart3,
    title: "Business Intelligence & Analytics",
    description:
      "Interactive dashboards and performance analytics that turn raw numbers into a clear picture of your business.",
  },
  {
    icon: TrendingUp,
    title: "Predictive Modelling & Forecasting",
    description:
      "Evidence-based forecasts of revenue, demand and risk so you can plan ahead with confidence.",
  },
  {
    icon: RouteIcon,
    title: "Intelligent Decision Support Systems",
    description:
      "Explainable, data-supported recommendations that help leaders choose the right next move.",
  },
  {
    icon: Database,
    title: "Data Engineering & Integration",
    description:
      "Reliable pipelines that collect, clean and connect data from every source into one trusted foundation.",
  },
  {
    icon: Target,
    title: "Strategic & Operational Intelligence",
    description:
      "Insight into operations, profitability and strategy that aligns day-to-day work with long-term goals.",
  },
  {
    icon: FlaskConical,
    title: "Research & Statistical Intelligence",
    description:
      "Rigorous statistical analysis, monitoring and evaluation for research institutions, NGOs and programmes.",
  },
];

export function PillarsSection() {
  return (
    <section id="pillars" className="relative scroll-mt-20 overflow-hidden bg-soft-grey py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <SectionHeading eyebrow="What we deliver" title="Our Seven Intelligence Pillars">
            Seven integrated disciplines working together to move your organization from data to
            intelligence, and from intelligence to impact.
          </SectionHeading>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <Reveal
              key={p.title}
              delay={i * 80}
              className={i === 6 ? "sm:col-span-2 lg:col-span-2" : undefined}
            >
              <article className="pillar-card group h-full">
                <div className="flex items-start justify-between">
                  <span className="pillar-icon">
                    <p.icon className="size-6" strokeWidth={1.75} />
                  </span>
                  <span className="font-mono text-sm font-medium text-muted-foreground/60 transition-colors duration-300 group-hover:text-brand-teal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold leading-snug text-charcoal">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                <span className="pillar-line" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
