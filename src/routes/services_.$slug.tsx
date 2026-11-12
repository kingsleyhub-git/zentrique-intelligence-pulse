import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, ArrowRight, Check, ClipboardList, Lightbulb, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { enquiryProcess, serviceBySlug, services } from "@/lib/services";
import type { ServiceInterest } from "@/lib/contact.schema";

export const Route = createFileRoute("/services_/$slug")({
  loader: ({ params }) => {
    const service = serviceBySlug(params.slug);
    if (!service) throw notFound();
    return { slug: service.slug };
  },
  head: ({ loaderData }) => {
    const s = loaderData ? serviceBySlug(loaderData.slug) : undefined;
    const title = s ? `${s.title} — ZENTRIQUE Intelligence Services` : "Service — ZENTRIQUE Intelligence";
    const description = s?.description ?? "ZENTRIQUE Intelligence services.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ServiceNotFound,
  component: ServicePage,
});

function ServiceNotFound() {
  return (
    <>
      <PageHero eyebrow="Services" title="Service not found">
        We couldn't find that service. Browse all six ZENTRIQUE services below.
      </PageHero>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <Button asChild size="lg">
          <Link to="/services">View all services</Link>
        </Button>
      </div>
    </>
  );
}

function ServicePage() {
  const { slug } = Route.useLoaderData();
  const s = serviceBySlug(slug)!;
  const others = services.filter((o) => o.slug !== s.slug);

  return (
    <>
      <PageHero eyebrow="Service" title={s.title}>
        {s.description}
      </PageHero>

      <section className="bg-background py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline">
            <ArrowLeft className="size-4" aria-hidden="true" /> All services
          </Link>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal className="h-full">
              <article className="h-full rounded-3xl border border-border bg-card p-8 lg:p-10">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                  <AlertCircle className="size-6" aria-hidden="true" />
                </span>
                <h2 className="mt-6 text-2xl font-bold text-charcoal">The problem</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">{s.problem}</p>
              </article>
            </Reveal>
            <Reveal delay={100} className="h-full">
              <article className="h-full rounded-3xl border border-border bg-card p-8 lg:p-10">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground">
                  <Lightbulb className="size-6" aria-hidden="true" />
                </span>
                <h2 className="mt-6 text-2xl font-bold text-charcoal">Our solution</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">{s.solution}</p>
              </article>
            </Reveal>
            <Reveal className="h-full">
              <article className="h-full rounded-3xl border border-border bg-soft-grey p-8 lg:p-10">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-teal/15 text-brand-teal">
                  <PackageCheck className="size-6" aria-hidden="true" />
                </span>
                <h2 className="mt-6 text-2xl font-bold text-charcoal">What you receive</h2>
                <ul className="mt-5 space-y-3">
                  {s.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-3 text-charcoal">
                      <Check className="mt-1 size-4 shrink-0 text-brand-teal" strokeWidth={3} aria-hidden="true" />
                      {d}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
            <Reveal delay={100} className="h-full">
              <article className="h-full rounded-3xl border border-border bg-soft-grey p-8 lg:p-10">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
                  <ClipboardList className="size-6" aria-hidden="true" />
                </span>
                <h2 className="mt-6 text-2xl font-bold text-charcoal">What we need from you</h2>
                <ul className="mt-5 space-y-3">
                  {s.requirements.map((r) => (
                    <li key={r} className="flex items-start gap-3 text-charcoal">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-blue" aria-hidden="true" />
                      {r}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </div>

          <Reveal className="mt-16">
            <h2 className="text-2xl font-bold text-charcoal sm:text-3xl">How an enquiry works</h2>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {enquiryProcess.map((step, i) => (
                <li key={step.title} className="rounded-2xl border border-border bg-card p-6">
                  <span className="font-mono text-sm font-semibold text-brand-teal">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 font-semibold text-charcoal">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl" variant="hero" className="group">
                <Link to="/contact" search={{ intent: "consultation", service: s.slug as ServiceInterest }} hash="enquiry">
                  Enquire about this service
                  <ArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="other-services" className="bg-soft-grey py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 id="other-services" className="text-xl font-bold text-charcoal">Other services</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug: o.slug }}
                  className="flex h-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm font-semibold text-charcoal transition-colors hover:border-brand-blue/50 hover:text-brand-blue"
                >
                  <o.icon className="size-5 shrink-0 text-brand-blue" aria-hidden="true" />
                  {o.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
