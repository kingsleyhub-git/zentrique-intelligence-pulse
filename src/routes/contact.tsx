import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { company } from "@/lib/site";
import type { ContactIntent } from "@/lib/contact.schema";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): { intent?: ContactIntent } =>
    search["intent"] === "demo" || search["intent"] === "consultation"
      ? { intent: search["intent"] }
      : {},
  head: () => ({
    meta: [
      { title: "Contact — ZENTRIQUE Intelligence" },
      {
        name: "description",
        content: "Book a consultation or request a ZENTRIQUE PULSE demo.",
      },
      { property: "og:title", content: "Contact — ZENTRIQUE Intelligence" },
      { property: "og:description", content: "Let's turn your data into intelligence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's Turn Your Data Into Intelligence">
        Book a consultation or request a demo of ZENTRIQUE PULSE.
      </PageHero>
      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-2 lg:px-8">
          <a
            href={`mailto:${company.email}`}
            className="flex items-center gap-4 rounded-2xl border border-border bg-soft-grey p-6"
          >
            <Mail className="size-6 text-brand-blue" aria-hidden="true" />
            <span>
              <span className="block text-sm text-muted-foreground">Business email</span>
              <span className="font-semibold text-charcoal">{company.email}</span>
            </span>
          </a>
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-soft-grey p-6">
            <MapPin className="size-6 text-brand-blue" aria-hidden="true" />
            <span>
              <span className="block text-sm text-muted-foreground">Office location</span>
              <span className="font-semibold text-charcoal">{company.location}</span>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
