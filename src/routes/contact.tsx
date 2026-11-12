import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ContactSection } from "@/components/sections/ContactSection";
import { isContactIntent, isServiceInterest, type ContactIntent, type ServiceInterest } from "@/lib/contact.schema";

type ContactSearch = { intent?: ContactIntent; service?: ServiceInterest };

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): ContactSearch => ({
    ...(isContactIntent(search["intent"]) ? { intent: search["intent"] } : {}),
    ...(isServiceInterest(search["service"]) ? { service: search["service"] } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Contact ZENTRIQUE — Book a Consultation or Request a PULSE Demo" },
      {
        name: "description",
        content:
          "Book a consultation with ZENTRIQUE Intelligence, request a ZENTRIQUE PULSE demonstration or ask about our business intelligence, AI and research services.",
      },
      { property: "og:title", content: "Contact ZENTRIQUE — Book a Consultation or Request a PULSE Demo" },
      {
        property: "og:description",
        content: "Let's turn your data into intelligence. Tell us about your organization and the decisions you want to improve.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { intent, service } = Route.useSearch();
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={intent === "demo" ? "Request a ZENTRIQUE PULSE Demo" : intent === "consultation" ? "Book A Consultation" : "Contact ZENTRIQUE"}
      >
        {intent === "demo"
          ? "See how PULSE turns your business data into dashboards, forecasts and explainable recommendations."
          : "Speak with a ZENTRIQUE specialist about your data, your decisions and where intelligence can make the biggest difference."}
      </PageHero>
      <ContactSection key={`${intent ?? ""}-${service ?? ""}`} initialIntent={intent} initialService={service} />
    </>
  );
}
