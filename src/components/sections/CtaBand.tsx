import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";

export function CtaBand() {
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-3xl bg-hero px-8 py-14 text-hero-foreground shadow-[var(--shadow-card)] sm:px-14 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:py-16">
            <div className="hero-grid absolute inset-0 -z-10" />
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                Ready to turn your data into <span className="text-gradient-brand">intelligence</span>?
              </h2>
              <p className="mt-4 text-lg text-hero-muted">
                Start with a ZENTRIQUE Business Intelligence Pilot and see what your data can tell
                you.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
              <Button asChild variant="hero" size="xl" className="group">
                <Link to="/contact" search={{ intent: "consultation" }}>
                  Book A Consultation
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="heroOutline" size="xl">
                <Link to="/contact" search={{ intent: "demo" }}>
                  Request Demo
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
