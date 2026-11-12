import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { WorkspaceApp } from "@/components/workspace/WorkspaceApp";

export const Route = createFileRoute("/pulse_/workspace")({
  head: () => ({
    meta: [
      { title: "PULSE Workspace — Analyse Your Sales Data | ZENTRIQUE" },
      {
        name: "description",
        content:
          "Upload a CSV or Excel file and get instant KPIs, revenue and product profitability analysis, forecasts, AI recommendations and downloadable reports.",
      },
      { property: "og:title", content: "PULSE Workspace — Analyse Your Sales Data | ZENTRIQUE" },
      {
        property: "og:description",
        content: "Turn your sales spreadsheet into dashboards, forecasts and AI-powered decisions in minutes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkspacePage,
});

function WorkspacePage() {
  return (
    <>
      <div className="print:hidden">
        <PageHero eyebrow="ZENTRIQUE PULSE · Live workspace" title="Analyse Your Business Data Now">
          Upload your sales spreadsheet and PULSE validates it, calculates your KPIs, analyses revenue and
          product profitability, forecasts the months ahead and gives AI-powered recommendations.
        </PageHero>
      </div>
      <section aria-label="PULSE workspace" className="bg-secondary py-12 print:bg-background print:py-0 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 print:max-w-none print:px-0">
          <WorkspaceApp />
        </div>
      </section>
    </>
  );
}
