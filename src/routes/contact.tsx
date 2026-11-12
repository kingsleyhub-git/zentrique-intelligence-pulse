import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ContactSection } from "@/components/sections/ContactSection";
import type { ContactIntent } from "@/lib/contact.schema";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): { intent?: ContactIntent } =>
    search["intent"] === "demo" || search["intent"] === "consultation"
      ? { intent: search["intent"] }
      : {},
  head: () => ({
    meta: [
      { title: "Contact ZENTRIQUE — Book a Consultation or Request a Demo" },
      {
        name: "description",
        content:
          "Book a consultation with ZENTRIQUE Intelligence or request a ZENTRIQUE PULSE demo. We reply within one business day.",
      },
      { property: "og:title", content: "Contact ZENTRIQUE — Book a Consultation or Request a Demo" },
      {
        property: "og:description",
        content: "Let's turn your data into intelligence. Book a consultation or request a PULSE demo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { intent } = Route.useSearch();
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={intent === "demo" ? "Request a ZENTRIQUE PULSE Demo" : "Book A Consultation"}
      >
        {intent === "demo"
          ? "See how PULSE turns your business data into dashboards, forecasts and explainable recommendations."
          : "Speak with a ZENTRIQUE specialist about your data, your decisions and where intelligence can make the biggest difference."}
      </PageHero>
      <ContactSection key={intent ?? "default"} initialIntent={intent} />
    </>
  );
}
