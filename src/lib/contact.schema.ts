import { z } from "zod";

export const enquiryTypes = [
  { value: "consultation", label: "Book a consultation" },
  { value: "demo", label: "Request a PULSE demonstration" },
  { value: "bi-services", label: "Business intelligence services" },
  { value: "ai-predictive", label: "AI and predictive analytics" },
  { value: "research", label: "Research and statistical intelligence" },
  { value: "partnership", label: "Partnership or other enquiry" },
] as const;
export const contactIntents = enquiryTypes.map((e) => e.value) as [ContactIntent, ...ContactIntent[]];
export type ContactIntent = (typeof enquiryTypes)[number]["value"];
export const isContactIntent = (v: unknown): v is ContactIntent =>
  typeof v === "string" && enquiryTypes.some((e) => e.value === v);

export const industryOptions = [
  "Retail & SMEs",
  "NGO or research institution",
  "Enterprise / corporate",
  "International organization",
  "Government / public sector",
  "Other",
] as const;

export const serviceOptions = [
  { value: "business-intelligence", label: "Business Intelligence & Analytics" },
  { value: "predictive-analytics", label: "Predictive Analytics" },
  { value: "decision-support", label: "AI-Powered Decision Support" },
  { value: "data-engineering", label: "Data Engineering" },
  { value: "machine-learning", label: "Machine Learning Solutions" },
  { value: "research-statistics", label: "Research & Statistical Intelligence" },
  { value: "pulse", label: "ZENTRIQUE PULSE" },
  { value: "not-sure", label: "Not sure yet" },
] as const;
export type ServiceInterest = (typeof serviceOptions)[number]["value"];
export const isServiceInterest = (v: unknown): v is ServiceInterest =>
  typeof v === "string" && serviceOptions.some((s) => s.value === v);

export const contactMethods = ["Email", "Phone call", "WhatsApp", "Video call"] as const;

/** Enquiry types where the visitor must say which service they're interested in. */
export const SERVICE_REQUIRED_FOR: readonly ContactIntent[] = ["consultation", "bi-services", "ai-predictive", "research"];

const optionalText = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, { message })
    .optional()
    .transform((v) => (v ? v : undefined));

export const contactSchema = z
  .object({
    intent: z.enum(contactIntents, { message: "Please choose the type of enquiry" }),
    name: z
      .string()
      .trim()
      .min(1, { message: "Please enter your full name" })
      .max(100, { message: "Name must be under 100 characters" }),
    email: z
      .string()
      .trim()
      .min(1, { message: "Please enter your business email" })
      .max(255, { message: "Email must be under 255 characters" })
      .email({ message: "Please enter a valid email address" }),
    company: optionalText(150, "Organization must be under 150 characters"),
    phone: optionalText(40, "Phone must be under 40 characters").refine(
      (v) => v === undefined || /^[+()\d\s.-]{6,40}$/.test(v),
      { message: "Please enter a valid phone number" },
    ),
    industry: z.enum(industryOptions, { message: "Please choose your industry" }),
    service: z
      .string()
      .optional()
      .transform((v) => (v ? v : undefined))
      .refine((v) => v === undefined || isServiceInterest(v), { message: "Please choose a service" }),
    preferredContact: z
      .string()
      .optional()
      .transform((v) => (v ? v : undefined))
      .refine((v) => v === undefined || (contactMethods as readonly string[]).includes(v), {
        message: "Please choose a contact method",
      }),
    message: z
      .string()
      .trim()
      .min(1, { message: "Please describe your business challenge" })
      .max(2000, { message: "Message must be under 2000 characters" }),
    // Honeypot: real visitors never see or fill this field.
    website: z.string().max(0).optional(),
  })
  .superRefine((d, ctx) => {
    if (SERVICE_REQUIRED_FOR.includes(d.intent) && !d.service) {
      ctx.addIssue({ code: "custom", path: ["service"], message: "Please choose the service you're interested in" });
    }
    if ((d.preferredContact === "Phone call" || d.preferredContact === "WhatsApp") && !d.phone) {
      ctx.addIssue({ code: "custom", path: ["phone"], message: "Please add a phone number so we can reach you" });
    }
  });

export type ContactInput = z.input<typeof contactSchema>;

export const CONTACT_SUCCESS_MESSAGE =
  "Thank you for contacting ZENTRIQUE INTELLIGENCE. Your enquiry has been received. Our team will review your request and contact you using the details provided.";
