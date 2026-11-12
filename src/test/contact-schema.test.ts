import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact.schema";

const valid = {
  intent: "consultation",
  name: "Amina Otieno",
  email: "amina@example.co.ke",
  message: "We'd like a sales dashboard.",
};

describe("contact form rules", () => {
  it("accepts name, email and message with company and phone left empty", () => {
    expect(contactSchema.safeParse({ ...valid, company: "", phone: "" }).success).toBe(true);
  });

  it("requires a name", () => {
    expect(contactSchema.safeParse({ ...valid, name: "  " }).success).toBe(false);
  });

  it("requires a valid email", () => {
    expect(contactSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("requires a message", () => {
    expect(contactSchema.safeParse({ ...valid, message: "" }).success).toBe(false);
  });

  it("only allows consultation or demo requests", () => {
    expect(contactSchema.safeParse({ ...valid, intent: "demo" }).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, intent: "other" }).success).toBe(false);
  });

  it("rejects messages over 2000 characters", () => {
    expect(contactSchema.safeParse({ ...valid, message: "a".repeat(2001) }).success).toBe(false);
  });

  it("rejects an invalid phone number", () => {
    expect(contactSchema.safeParse({ ...valid, phone: "call me" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, phone: "+254 712 345 678" }).success).toBe(true);
  });

  it("rejects bots that fill the hidden field", () => {
    expect(contactSchema.safeParse({ ...valid, website: "spam.com" }).success).toBe(false);
  });
});
