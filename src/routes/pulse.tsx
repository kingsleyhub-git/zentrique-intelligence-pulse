import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { PulseShowcase } from "@/components/sections/PulseShowcase";
import { WhyChooseSection } from "@/components/sections/WhyChooseSection";
import { CtaBand } from "@/components/sections/CtaBand";

export const Route = createFileRoute("/pulse")({
  head: () => ({
    meta: [
      { title: "ZENTRIQUE PULSE — Business Intelligence & Decision Support Platform" },
      {
        name: "description",
        content:
          "ZENTRIQUE PULSE: secure data upload, validation, revenue and profitability analysis, forecasting, explainable AI recommendations and downloadable reports.",
      },
      { property: "og:title", content: "ZENTRIQUE PULSE — Business Intelligence & Decision Support Platform" },
      {
        property: "og:description",
        content: "Upload your data and get dashboards, forecasts and explainable recommendations in minutes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PulsePage,
});

function PulsePage() {
  return (
    <>
      <PageHero eyebrow="ZENTRIQUE PULSE" title="Your Business Data, Turned Into Decisions">
        PULSE brings data validation, analytics, forecasting and explainable AI together in one
        secure platform — built for organizations that need answers, not spreadsheets.
      </PageHero>
      <PulseShowcase />
      <WhyChooseSection />
      <CtaBand />
    </>
  );
}
