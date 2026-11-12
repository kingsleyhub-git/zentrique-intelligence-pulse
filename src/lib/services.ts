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
  detail: string;
  deliverables: string[];
};

export const services: Service[] = [
  {
    slug: "business-intelligence",
    icon: BarChart3,
    title: "Business Intelligence & Analytics",
    description: "Transform business data into actionable insights.",
    detail:
      "We assess, clean and model your business data, then deliver interactive dashboards that show exactly how revenue, costs and operations are performing.",
    deliverables: [
      "Business data assessment",
      "Sales & revenue analysis",
      "Profitability dashboards",
      "Performance reporting",
    ],
  },
  {
    slug: "predictive-analytics",
    icon: TrendingUp,
    title: "Predictive Analytics",
    description: "Forecast trends and future outcomes.",
    detail:
      "Statistical and machine-learning forecasts of demand, revenue and risk, validated against your history before they are used for planning.",
    deliverables: [
      "Revenue & demand forecasting",
      "Trend and seasonality analysis",
      "Risk scoring",
      "Scenario planning",
    ],
  },
  {
    slug: "decision-support",
    icon: RouteIcon,
    title: "AI-Powered Decision Support",
    description: "Generate evidence-based recommendations.",
    detail:
      "Explainable recommendations that show the evidence behind every suggestion, so leaders can act with confidence and accountability.",
    deliverables: [
      "Explainable recommendations",
      "KPI alerts & monitoring",
      "What-if analysis",
      "Executive briefings",
    ],
  },
  {
    slug: "data-engineering",
    icon: Database,
    title: "Data Engineering",
    description: "Build reliable data infrastructures.",
    detail:
      "Pipelines and data models that collect, validate and integrate data from spreadsheets, databases and business systems into one trusted source.",
    deliverables: [
      "Data pipelines & integration",
      "Data cleaning & validation",
      "Data warehouse design",
      "Secure access controls",
    ],
  },
  {
    slug: "machine-learning",
    icon: BrainCircuit,
    title: "Machine Learning Solutions",
    description: "Develop intelligent business systems.",
    detail:
      "Custom models for classification, segmentation and automation — built, tested and deployed into the tools your teams already use.",
    deliverables: [
      "Customer segmentation",
      "Classification & prediction models",
      "AI-powered automation",
      "Model monitoring",
    ],
  },
  {
    slug: "research-statistics",
    icon: FlaskConical,
    title: "Research & Statistical Intelligence",
    description: "Advanced data analysis for organizations.",
    detail:
      "Rigorous statistical analysis, survey design and monitoring & evaluation for NGOs, research institutions and programme teams.",
    deliverables: [
      "Statistical analysis",
      "Monitoring & evaluation",
      "Survey design & analysis",
      "Research reporting",
    ],
  },
];
