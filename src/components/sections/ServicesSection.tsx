import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
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
            eyebrow="Services · what you can engage us for"
            title="Intelligence Solutions That Drive Growth"
          >
            Six commercial services, each with defined deliverables. Choose one to see the problem it
            solves, what you receive and how to get started.
          </SectionHeading>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 70} className="h-full">
              <article className="pillar-card group h-full">
                <div className="flex items-center justify-between">
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
                    to="/services/$slug"
                    params={{ slug: s.slug }}
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
