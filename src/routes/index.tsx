import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/hero/Hero";
import { AboutTeaser } from "@/components/sections/AboutSections";
import { PillarsSection } from "@/components/sections/PillarsSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZENTRIQUE Intelligence — Transform Data Into Strategic Intelligence" },
      {
        name: "description",
        content:
          "AI-powered business intelligence, analytics, forecasting and decision support that help organizations make smarter, faster decisions.",
      },
      { property: "og:title", content: "ZENTRIQUE Intelligence — Transform Data Into Strategic Intelligence" },
      {
        property: "og:description",
        content:
          "AI-powered business intelligence, analytics, forecasting and decision support for smarter, faster decisions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <AboutTeaser />
      <PillarsSection />
    </>
  );
}
