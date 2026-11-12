import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { CtaBand } from "@/components/sections/CtaBand";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — ZENTRIQUE Intelligence" },
      {
        name: "description",
        content:
          "Business intelligence, predictive analytics, AI decision support, data engineering, machine learning and statistical research services.",
      },
      { property: "og:title", content: "Services — ZENTRIQUE Intelligence" },
      {
        property: "og:description",
        content: "Intelligence solutions that drive growth, from dashboards to decision intelligence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Services" title="Intelligence Solutions That Drive Growth">
        Data, analytics and AI services that help organizations make smarter and faster decisions.
      </PageHero>
      <ServicesSection />
      <CtaBand />
    </>
  );
}
