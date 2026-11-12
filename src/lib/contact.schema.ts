import { z } from "zod";

export const contactIntents = ["consultation", "demo"] as const;
export type ContactIntent = (typeof contactIntents)[number];

const optionalText = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, { message })
    .optional()
    .transform((v) => (v ? v : undefined));

export const contactSchema = z.object({
  intent: z.enum(contactIntents),
  name: z
    .string()
    .trim()
    .min(1, { message: "Please enter your name" })
    .max(100, { message: "Name must be under 100 characters" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Please enter your email" })
    .max(255, { message: "Email must be under 255 characters" })
    .email({ message: "Please enter a valid email address" }),
  company: optionalText(150, "Company must be under 150 characters"),
  phone: optionalText(40, "Phone must be under 40 characters").refine(
    (v) => v === undefined || /^[+()\d\s.-]{6,40}$/.test(v),
    { message: "Please enter a valid phone number" },
  ),
  message: z
    .string()
    .trim()
    .min(1, { message: "Please tell us how we can help" })
    .max(2000, { message: "Message must be under 2000 characters" }),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().max(0).optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
