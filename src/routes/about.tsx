import { createFileRoute } from "@tanstack/react-router";
import {
  AboutIntro,
  MeaningSection,
  VisionMissionSection,
} from "@/components/sections/AboutSections";
import { PillarsSection } from "@/components/sections/PillarsSection";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About ZENTRIQUE — Intelligence-Driven Decision Making" },
      {
        name: "description",
        content:
          "Meet ZENTRIQUE Intelligence Limited: the meaning behind our name, our vision, our mission and our seven intelligence pillars.",
      },
      { property: "og:title", content: "About ZENTRIQUE — Intelligence-Driven Decision Making" },
      {
        property: "og:description",
        content:
          "The meaning of ZENTRIQUE, our vision and mission, and the seven pillars of intelligence we deliver.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <AboutIntro />
      <MeaningSection />
      <VisionMissionSection />
      <PillarsSection />
    </>
  );
}
