import { Check } from "lucide-react";
import { StatCounter } from "@/components/hero/StatCounter";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { whyChoose, whyStats } from "@/lib/content";

export function WhyChooseSection() {
  return (
    <section
      id="why-zentrique"
      aria-labelledby="why-title"
      className="relative isolate scroll-mt-20 overflow-hidden bg-hero py-24 text-hero-foreground lg:py-32"
    >
      <div className="hero-grid absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:px-8">
        <div>
          <Reveal>
            <SectionHeading
              id="why-title"
              eyebrow="Why ZENTRIQUE"
              align="left"
              tone="light"
              title="Why Organizations Choose ZENTRIQUE"
            >
              Intelligence you can trust, explain and act on — built by data scientists who
              understand business.
            </SectionHeading>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-hero-line pt-10">
              {whyStats.map((s) => (
                <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} size="lg" />
              ))}
            </div>
          </Reveal>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {whyChoose.map((item, i) => (
            <li key={item}>
              <Reveal delay={(i % 2) * 80} className="h-full">
              <div className="flex h-full items-center gap-4 rounded-xl border border-hero-line bg-glass p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-brand-teal/60">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-teal/20 text-brand-teal">
                  <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="font-medium text-hero-foreground">{item}</span>
              </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
