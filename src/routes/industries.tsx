import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { IndustriesSection } from "@/components/sections/IndustriesSection";
import { WhyChooseSection } from "@/components/sections/WhyChooseSection";
import { CtaBand } from "@/components/sections/CtaBand";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries — ZENTRIQUE Intelligence for SMEs, NGOs, Enterprises & Global Organizations" },
      {
        name: "description",
        content:
          "Business intelligence, monitoring & evaluation, AI and predictive decision support for SMEs, NGOs, research institutions, enterprises and international organizations.",
      },
      { property: "og:title", content: "Industries We Empower — ZENTRIQUE Intelligence" },
      {
        property: "og:description",
        content: "Intelligence tailored to SMEs, NGOs & research institutions, enterprises and international organizations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IndustriesPage,
});

function IndustriesPage() {
  return (
    <>
      <PageHero eyebrow="Industries" title="Intelligence for Every Kind of Organization">
        Whether you run a growing business, a research programme or a global institution, we turn
        your data into the decisions that matter most.
      </PageHero>
      <IndustriesSection />
      <WhyChooseSection />
      <CtaBand />
    </>
  );
}
