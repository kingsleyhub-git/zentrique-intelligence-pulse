import { Link } from "@tanstack/react-router";
import { ArrowRight, Compass, Crosshair, Eye, Layers, Rocket, Sparkles } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { NetworkCanvas } from "@/components/hero/NetworkCanvas";
import mark from "@/assets/zentrique-mark.png";

export function AboutIntro() {
  return (
    <section className="relative isolate overflow-hidden bg-hero pb-24 pt-40 text-hero-foreground lg:pb-32 lg:pt-48">
      <div className="hero-grid absolute inset-0 -z-10" />
      <NetworkCanvas className="absolute inset-0 -z-10 size-full opacity-60" />
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1.4fr_1fr] lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="About ZENTRIQUE"
            align="left"
            tone="light"
            title={
              <>
                The Future of{" "}
                <span className="text-gradient-brand">Intelligence-Driven</span> Decision Making
              </>
            }
          >
            ZENTRIQUE INTELLIGENCE LIMITED is an AI-powered business intelligence and
            decision-support company helping organizations transform complex data into actionable
            intelligence.
          </SectionHeading>
          <p className="mt-8 font-display text-base font-medium italic text-hero-foreground/90">
            “From Data to Intelligence. From Intelligence to Impact.”
          </p>
        </Reveal>
        <Reveal delay={150} className="hidden lg:block">
          <div className="relative mx-auto flex aspect-square max-w-sm items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-brand opacity-25 blur-3xl" />
            <div className="absolute inset-6 animate-[spin_40s_linear_infinite] rounded-full border border-dashed border-hero-line" />
            <div className="absolute inset-16 rounded-full border border-hero-line" />
            <img src={mark} alt="ZENTRIQUE mark" className="animate-float relative w-1/2" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const meanings = [
  {
    syllable: "ZEN",
    icon: Crosshair,
    heading: "Clarity, Focus and Precision",
    body: "Clear thinking, balance and the ability to simplify complex challenges into decisions that matter.",
  },
  {
    syllable: "TRI",
    icon: Layers,
    heading: "Three Dimensions of Intelligence",
    list: ["Data Intelligence", "Artificial Intelligence", "Strategic Innovation"],
  },
  {
    syllable: "QUE",
    icon: Compass,
    heading: "Quest for Understanding and Excellence",
    body: "The continuous pursuit of knowledge, innovation, intelligent solutions and excellence.",
  },
];

export function MeaningSection() {
  return (
    <section className="relative overflow-hidden bg-navy py-24 text-hero-foreground lg:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-brand opacity-40" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Our name"
            tone="light"
            title={
              <>
                What <span className="text-gradient-brand">ZENTRIQUE</span> Means
              </>
            }
          >
            A pursuit of clarity, three dimensions of intelligence, and excellence through
            innovation.
          </SectionHeading>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {meanings.map((m, i) => (
            <Reveal key={m.syllable} delay={i * 120} className="h-full">
              <article className="meaning-card group h-full">
                <span className="pointer-events-none absolute -right-4 -top-6 select-none font-display text-[7rem] font-extrabold leading-none text-hero-foreground/5 transition-colors duration-500 group-hover:text-brand-blue/15">
                  {m.syllable}
                </span>
                <span className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]">
                  <m.icon className="size-7" strokeWidth={1.75} />
                </span>
                <p className="relative mt-8 font-display text-4xl font-extrabold tracking-[0.12em] text-hero-foreground">
                  {m.syllable}
                </p>
                <h3 className="relative mt-3 text-lg font-semibold text-brand-teal">{m.heading}</h3>
                {m.body && (
                  <p className="relative mt-4 leading-relaxed text-hero-muted">{m.body}</p>
                )}
                {m.list && (
                  <ul className="relative mt-5 space-y-3">
                    {m.list.map((item, idx) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 rounded-xl border border-hero-line bg-glass-strong px-4 py-3 text-sm font-medium text-hero-foreground"
                      >
                        <span className="font-mono text-xs text-brand-teal">0{idx + 1}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VisionMissionSection() {
  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <SectionHeading eyebrow="Purpose" title="Our Vision & Mission" />
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal className="h-full">
            <article className="group relative h-full overflow-hidden rounded-3xl bg-navy p-10 text-hero-foreground shadow-[var(--shadow-card)] transition-transform duration-500 hover:-translate-y-1.5 lg:p-12">
              <div className="absolute -right-20 -top-20 size-64 rounded-full bg-brand-blue/30 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />
              <span className="relative flex size-14 items-center justify-center rounded-2xl border border-hero-line bg-glass text-brand-teal">
                <Eye className="size-7" strokeWidth={1.75} />
              </span>
              <h3 className="relative mt-8 text-2xl font-bold">Our Vision</h3>
              <p className="relative mt-4 text-lg leading-relaxed text-hero-muted">
                To become a globally recognized intelligence technology company, empowering
                organizations to make smarter, faster and evidence-driven decisions through
                artificial intelligence, advanced analytics and predictive intelligence.
              </p>
            </article>
          </Reveal>
          <Reveal delay={120} className="h-full">
            <article className="group relative h-full overflow-hidden rounded-3xl bg-gradient-brand p-10 text-primary-foreground shadow-glow transition-transform duration-500 hover:-translate-y-1.5 lg:p-12">
              <Sparkles className="absolute right-8 top-8 size-24 opacity-15 transition-transform duration-700 group-hover:rotate-12" />
              <span className="relative flex size-14 items-center justify-center rounded-2xl bg-primary-foreground/15 backdrop-blur">
                <Rocket className="size-7" strokeWidth={1.75} />
              </span>
              <h3 className="relative mt-8 text-2xl font-bold">Our Mission</h3>
              <p className="relative mt-4 text-lg leading-relaxed text-primary-foreground/90">
                To democratize access to advanced intelligence by transforming data into meaningful
                insights, predictive knowledge and actionable strategic decisions.
              </p>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function AboutTeaser() {
  return (
    <section className="bg-background py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="About us"
            align="left"
            title="The Future of Intelligence-Driven Decision Making"
          >
            ZENTRIQUE INTELLIGENCE LIMITED is an AI-powered business intelligence and
            decision-support company helping organizations transform complex data into actionable
            intelligence.
          </SectionHeading>
        </Reveal>
        <Reveal delay={120}>
          <div className="grid grid-cols-3 gap-3">
            {meanings.map((m) => (
              <div
                key={m.syllable}
                className="rounded-2xl border border-border bg-soft-grey p-5 text-center transition-transform duration-500 hover:-translate-y-1"
              >
                <m.icon className="mx-auto size-6 text-brand-blue" strokeWidth={1.75} />
                <p className="mt-3 font-display text-xl font-extrabold tracking-[0.1em] text-charcoal">
                  {m.syllable}
                </p>
              </div>
            ))}
          </div>
          <Link
            to="/about"
            className="group mt-6 inline-flex items-center gap-2 font-semibold text-brand-blue"
          >
            Discover our story
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
