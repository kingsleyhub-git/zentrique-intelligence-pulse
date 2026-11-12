import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { services } from "@/lib/services";

export function ServicesSection() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="relative scroll-mt-20 bg-background py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            id="services-title"
            eyebrow="Services"
            title="Intelligence Solutions That Drive Growth"
          >
            End-to-end data, analytics and AI services — from your first dashboard to
            enterprise-scale decision intelligence.
          </SectionHeading>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 70} className="h-full">
              <article className="pillar-card group h-full">
                <div className="flex items-start justify-between">
                  <span className="pillar-icon">
                    <s.icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="font-mono text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-brand-teal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold leading-snug text-charcoal">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{s.description}</p>
                <div className="mt-auto pt-8">
                  <Link
                    to="/services"
                    hash={s.slug}
                    className="inline-flex items-center gap-2 rounded-md text-sm font-semibold text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
                    aria-label={`Learn more about ${s.title}`}
                  >
                    Learn More
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
                <span className="pillar-line" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceDetails() {
  return (
    <section aria-label="Service details" className="bg-soft-grey py-24 lg:py-32">
      <div className="mx-auto max-w-7xl space-y-6 px-6 lg:px-8">
        {services.map((s) => (
          <Reveal key={s.slug}>
            <article
              id={s.slug}
              className="grid scroll-mt-28 gap-8 rounded-3xl border border-border bg-card p-8 lg:grid-cols-[auto_1.2fr_1fr] lg:items-start lg:gap-12 lg:p-12"
            >
              <span className="flex size-16 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
                <s.icon className="size-8" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-2xl font-bold text-charcoal sm:text-3xl">{s.title}</h2>
                <p className="mt-2 font-medium text-brand-blue">{s.description}</p>
                <p className="mt-4 leading-relaxed text-muted-foreground">{s.detail}</p>
              </div>
              <div>
                <h3 className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  What's included
                </h3>
                <ul className="mt-4 space-y-3">
                  {s.deliverables.map((d) => (
                    <li key={d} className="flex items-center gap-3 text-sm font-medium text-charcoal">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-teal/15 text-brand-teal">
                        <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  search={{ intent: "consultation" }}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline"
                >
                  Discuss this service <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
