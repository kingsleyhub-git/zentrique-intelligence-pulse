import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { techStack } from "@/lib/content";

export function TechStackSection() {
  return (
    <section aria-labelledby="tech-title" className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <SectionHeading id="tech-title" eyebrow="Technology" title="Our Technology Ecosystem">
            Proven, modern and open technologies — chosen for reliability, security and scale.
          </SectionHeading>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {techStack.map((g, i) => (
            <Reveal key={g.title} delay={(i % 3) * 80} className="h-full">
              <div className="pillar-card group h-full">
                <div className="flex items-center gap-3">
                  <span className="pillar-icon size-11">
                    <g.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-semibold text-charcoal">{g.title}</h3>
                </div>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${g.title} technologies`}>
                  {g.items.map((t) => (
                    <li key={t} className="tech-badge">
                      <span className="size-1.5 rounded-full bg-gradient-brand" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>
                <span className="pillar-line" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
