import type { ReactNode } from "react";
import { NetworkCanvas } from "@/components/hero/NetworkCanvas";
import { Reveal } from "./Reveal";

/** Navy intro band used at the top of inner pages. */
export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-hero pb-20 pt-36 text-hero-foreground lg:pb-28 lg:pt-44">
      <div className="hero-grid absolute inset-0 -z-10" />
      <NetworkCanvas className="absolute inset-0 -z-10 size-full opacity-50" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <span className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.24em] text-brand-teal">
            <span className="h-px w-6 bg-brand-teal" />
            {eyebrow}
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">{title}</h1>
          {children && <p className="mt-6 text-lg leading-relaxed text-hero-muted">{children}</p>}
        </Reveal>
      </div>
    </section>
  );
}
