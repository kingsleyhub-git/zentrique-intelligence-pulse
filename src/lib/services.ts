import {
  BarChart3,
  BrainCircuit,
  Database,
  FlaskConical,
  Route as RouteIcon,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  slug: string;
  icon: LucideIcon;
  title: string;
  description: string;
  problem: string;
  solution: string;
  deliverables: string[];
  requirements: string[];
};

/** The six commercial services a client can engage ZENTRIQUE for. */
export const services: Service[] = [
  {
    slug: "business-intelligence",
    icon: BarChart3,
    title: "Business Intelligence & Analytics",
    description:
      "Transform organizational data into interactive dashboards, performance insights and measurable business intelligence.",
    problem:
      "Performance data sits in spreadsheets, accounting packages and separate systems. Reports take days to prepare, numbers don't agree between teams, and leaders lack a clear, current view of revenue, costs and operations.",
    solution:
      "We assess and clean your data, agree the KPIs that matter, and build interactive dashboards and reports that show how the organization is performing — by period, product, branch, channel or programme.",
    deliverables: [
      "Data assessment and KPI definitions",
      "Interactive performance dashboards",
      "Revenue, cost and profitability analysis",
      "Monthly or quarterly performance report",
      "Handover session for your team",
    ],
    requirements: [
      "Access to the data sources (exports, spreadsheets or system access)",
      "A named contact who understands the business processes",
      "Agreement on the decisions the dashboards should support",
    ],
  },
  {
    slug: "predictive-analytics",
    icon: TrendingUp,
    title: "Predictive Analytics",
    description:
      "Apply statistical and machine learning techniques to forecast business trends, demand, revenue and potential risks.",
    problem:
      "Budgets, stock levels and staffing are planned on intuition or last year's figures, so the organization is regularly surprised by demand swings, seasonal peaks and emerging risks.",
    solution:
      "We build forecasting models from your historical data, test them against past periods to measure their accuracy, and present forecasts with realistic ranges and scenarios for planning.",
    deliverables: [
      "Revenue and demand forecasts with confidence ranges",
      "Trend and seasonality analysis",
      "Documented model testing (back-test results)",
      "Scenario and risk analysis",
      "Forecast refresh process",
    ],
    requirements: [
      "At least 12–24 months of consistent historical data (more is better)",
      "Context on known events such as promotions, price changes or closures",
      "A clear planning question the forecast should answer",
    ],
  },
  {
    slug: "decision-support",
    icon: RouteIcon,
    title: "AI-Powered Decision Support",
    description:
      "Deliver explainable, data-driven recommendations that support informed strategic and operational decisions.",
    problem:
      "Leaders have reports but still have to work out what to do next. Recommendations from analysts or tools are hard to trust when the reasoning behind them isn't visible.",
    solution:
      "We combine analytics, forecasting and AI to produce recommendations that show their evidence, assumptions and expected impact — so decisions can be reviewed, explained and owned.",
    deliverables: [
      "Decision framework for your priority decisions",
      "Explainable recommendations with evidence and assumptions",
      "KPI monitoring and alert rules",
      "What-if and scenario analysis",
      "Executive decision briefings",
    ],
    requirements: [
      "The key decisions you want to improve and who makes them",
      "Relevant historical and operational data",
      "Time with decision-makers to agree success measures",
    ],
  },
  {
    slug: "data-engineering",
    icon: Database,
    title: "Data Engineering",
    description:
      "Build reliable data pipelines and integrate information from multiple sources into consistent, analysis-ready data.",
    problem:
      "Data is duplicated, inconsistent and spread across many files and systems. Every analysis starts with hours of manual cleaning, and errors creep into reports.",
    solution:
      "We design data models and pipelines that collect, validate and combine data from your sources into one consistent, documented and access-controlled foundation for analysis.",
    deliverables: [
      "Data source audit and integration plan",
      "Automated data pipelines with validation checks",
      "Analysis-ready data model or warehouse",
      "Data dictionary and documentation",
      "Access controls appropriate to your data",
    ],
    requirements: [
      "A list of current data sources and their owners",
      "Technical access (or exports) for each source",
      "Your data protection and retention requirements",
    ],
  },
  {
    slug: "machine-learning",
    icon: BrainCircuit,
    title: "Machine Learning Solutions",
    description:
      "Develop and evaluate machine learning models to identify patterns, predict outcomes and automate analytical processes.",
    problem:
      "Valuable patterns — which customers are likely to leave, which transactions look unusual, which cases need attention first — are hidden in large volumes of data that people can't review manually.",
    solution:
      "We frame the business problem, build and evaluate candidate models on your data, report their measured performance honestly, and deploy the model that is fit for purpose with monitoring in place.",
    deliverables: [
      "Problem framing and success metrics",
      "Trained and evaluated models with performance report",
      "Model explanation (key drivers of predictions)",
      "Deployment into your workflow or tools",
      "Monitoring and retraining plan",
    ],
    requirements: [
      "Historical data that includes the outcome you want to predict",
      "Domain experts available to review results",
      "Agreement on how predictions will be used and by whom",
    ],
  },
  {
    slug: "research-statistics",
    icon: FlaskConical,
    title: "Research & Statistical Intelligence",
    description:
      "Apply statistical methods, quantitative research and advanced analytics to generate reliable evidence and insights.",
    problem:
      "Programmes, studies and policies need credible evidence, but survey design, sampling and statistical analysis require specialist skills and careful quality control.",
    solution:
      "We design studies and surveys, apply appropriate statistical methods, and turn results into clear evidence for monitoring, evaluation, research publications and donor or board reporting.",
    deliverables: [
      "Study or survey design and sampling plan",
      "Data quality review and cleaning",
      "Statistical analysis with documented methods",
      "Monitoring & evaluation indicators and dashboards",
      "Research or evaluation report",
    ],
    requirements: [
      "Research or evaluation questions and objectives",
      "Existing data, survey instruments or access to respondents",
      "Ethical, consent and data-protection requirements",
    ],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

/** How an enquiry about any service is handled. */
export const enquiryProcess = [
  { title: "Send an enquiry", text: "Tell us about your organization, your data and the decision you want to improve." },
  { title: "Discovery call", text: "We discuss your objectives, data sources and constraints to confirm the right approach." },
  { title: "Proposal", text: "You receive a written scope with deliverables, timeline and cost." },
  { title: "Delivery & handover", text: "We deliver in agreed stages, review results with you and hand over documentation." },
];
