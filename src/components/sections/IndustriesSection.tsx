import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { industries } from "@/lib/content";

export function IndustriesSection() {
  return (
    <section
      id="industries"
      aria-labelledby="industries-title"
      className="scroll-mt-20 bg-soft-grey py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <SectionHeading id="industries-title" eyebrow="Industries" title="Industries We Empower">
            From growing businesses to global institutions, we tailor intelligence to the decisions
            each sector faces.
          </SectionHeading>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {industries.map((ind, i) => (
            <Reveal key={ind.slug} delay={(i % 2) * 90} className="h-full">
              <article
                id={ind.slug}
                className="industry-card group flex h-full scroll-mt-28 flex-col sm:flex-row"
              >
                <div className="relative h-52 overflow-hidden sm:h-auto sm:w-2/5 sm:shrink-0">
                  <img
                    src={ind.image}
                    alt={ind.imageAlt}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={600}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="industry-card-shade absolute inset-0" />
                  <span className="absolute left-4 top-4 flex size-11 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
                    <ind.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="text-xl font-semibold text-charcoal">{ind.title}</h3>
                  <p className="mt-2 font-medium text-brand-blue">{ind.description}</p>
                  <ul className="mt-5 space-y-2.5">
                    {ind.points.map((p) => (
                      <li key={p} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <Check className="size-4 shrink-0 text-brand-teal" strokeWidth={2.5} aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact"
                    search={{ intent: "consultation" }}
                    className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Talk to us about solutions for ${ind.title}`}
                  >
                    Talk to an expert
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
