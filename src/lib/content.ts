import {
  Building2,
  ChartColumnIncreasing,
  CheckCheck,
  Cloud,
  Code2,
  Cpu,
  Database,
  FileDown,
  FlaskConical,
  Globe,
  LayoutDashboard,
  Lightbulb,
  Package,
  Server,
  ShieldCheck,
  Store,
  TrendingUp,
  Upload,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import smesImg from "@/assets/industry-smes.jpg";
import ngosImg from "@/assets/industry-ngos.jpg";
import enterprisesImg from "@/assets/industry-enterprises.jpg";
import internationalImg from "@/assets/industry-international.jpg";

export type Feature = { icon: LucideIcon; title: string; description: string };

export const pulseFeatures: Feature[] = [
  { icon: Upload, title: "Secure Data Upload", description: "Upload Excel and CSV files into a private, encrypted workspace." },
  { icon: CheckCheck, title: "Data Validation", description: "Automatic checks catch missing values, duplicates and errors." },
  { icon: Wallet, title: "Revenue Analysis", description: "See revenue by month, branch, channel and customer." },
  { icon: ChartColumnIncreasing, title: "Sales Performance Tracking", description: "Track targets, growth and team performance in real time." },
  { icon: Package, title: "Product Profitability Analysis", description: "Find which products earn the most — and which cost you." },
  { icon: LayoutDashboard, title: "Interactive Dashboards", description: "Filter, drill down and explore every number visually." },
  { icon: TrendingUp, title: "Business Forecasting", description: "Forecast revenue and demand with confidence ranges." },
  { icon: Lightbulb, title: "Explainable AI Recommendations", description: "Clear actions with the evidence behind every suggestion." },
  { icon: FileDown, title: "Downloadable Reports", description: "Export board-ready PDF and Excel reports in one click." },
];

export type Industry = {
  slug: string;
  icon: LucideIcon;
  title: string;
  description: string;
  points: string[];
  image: string;
  imageAlt: string;
};

export const industries: Industry[] = [
  {
    slug: "smes",
    icon: Store,
    title: "SMEs",
    description: "Revenue analytics and profitability tracking.",
    points: ["Sales & revenue dashboards", "Product profitability", "Cash-flow forecasting"],
    image: smesImg,
    imageAlt: "Business owner reviewing sales analytics on a tablet",
  },
  {
    slug: "ngos-research",
    icon: FlaskConical,
    title: "NGOs & Research Institutions",
    description: "Monitoring, evaluation and statistical intelligence.",
    points: ["Monitoring & evaluation", "Survey design & analysis", "Impact reporting"],
    image: ngosImg,
    imageAlt: "Research team analysing programme data together",
  },
  {
    slug: "enterprises",
    icon: Building2,
    title: "Enterprises",
    description: "Advanced AI and business intelligence solutions.",
    points: ["Enterprise data platforms", "Machine learning at scale", "Executive decision support"],
    image: enterprisesImg,
    imageAlt: "Executives reviewing a business intelligence dashboard",
  },
  {
    slug: "international",
    icon: Globe,
    title: "International Organizations",
    description: "Predictive intelligence and strategic decision support.",
    points: ["Multi-country analytics", "Risk & scenario forecasting", "Strategic intelligence briefs"],
    image: internationalImg,
    imageAlt: "International delegates in a strategy meeting",
  },
];

export const whyChoose = [
  "AI-Powered Intelligence",
  "Evidence-Based Insights",
  "Predictive Analytics",
  "Business-Focused Recommendations",
  "Scalable Solutions",
  "Secure Data Handling",
  "Modern Technology Stack",
  "Expert Data Science Expertise",
];

export const whyStats = [
  { value: 95, suffix: "%", label: "Faster insights" },
  { value: 80, suffix: "%", label: "Better decision visibility" },
  { value: 24, suffix: "/7", label: "Data intelligence" },
];

export type TechGroup = { icon: LucideIcon; title: string; items: string[] };

export const techStack: TechGroup[] = [
  { icon: Code2, title: "Frontend", items: ["HTML", "CSS", "JavaScript", "React"] },
  { icon: Server, title: "Backend", items: ["Python", "FastAPI"] },
  { icon: Database, title: "Database", items: ["PostgreSQL"] },
  { icon: ChartColumnIncreasing, title: "Analytics", items: ["Pandas", "Plotly"] },
  { icon: Cpu, title: "Machine Learning", items: ["Scikit-Learn", "TensorFlow", "PyTorch"] },
  { icon: Cloud, title: "Hosting", items: ["Vercel", "Cloud Infrastructure"] },
];

export const securityPoints: Feature[] = [
  { icon: ShieldCheck, title: "Secure by design", description: "Encrypted storage and strict client data separation." },
];
