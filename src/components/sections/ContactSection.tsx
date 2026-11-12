import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Presentation,
  Twitter,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/site/Reveal";
import { submitContact } from "@/lib/contact.functions";
import { contactSchema, type ContactIntent } from "@/lib/contact.schema";
import { company } from "@/lib/site";
import { cn } from "@/lib/utils";

const socialIcons: Record<string, LucideIcon> = {
  LinkedIn: Linkedin,
  "X (Twitter)": Twitter,
  Facebook,
  Instagram,
};

type Field = "name" | "email" | "company" | "phone" | "message";
type Errors = Partial<Record<Field, string>>;

const fields: {
  name: Field;
  label: string;
  type?: string;
  autoComplete: string;
  required?: boolean;
  placeholder: string;
}[] = [
  { name: "name", label: "Full name", autoComplete: "name", required: true, placeholder: "Jane Wanjiru" },
  { name: "email", label: "Work email", type: "email", autoComplete: "email", required: true, placeholder: "jane@company.com" },
  { name: "company", label: "Company", autoComplete: "organization", placeholder: "Company or organization" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", placeholder: "+254 7XX XXX XXX" },
];

export function ContactSection({ initialIntent }: { initialIntent?: ContactIntent | undefined }) {
  const send = useServerFn(submitContact);
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState<ContactIntent | null>(null);
  const [sent, setSent] = useState<{ intent: ContactIntent; name: string } | null>(null);
  const preferred: ContactIntent = initialIntent ?? "consultation";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const intent = (submitter?.value as ContactIntent | undefined) ?? preferred;
    const fd = new FormData(form);
    const raw = {
      intent,
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""),
    };

    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Field;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      const first = Object.keys(next)[0];
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setErrors({});
    setPending(intent);
    try {
      await send({ data: raw });
      setSent({ intent, name: parsed.data.name.split(" ")[0] ?? parsed.data.name });
      form.reset();
    } catch {
      toast.error("We couldn't send your message", {
        description: `Please try again, or email us at ${company.email}.`,
      });
    } finally {
      setPending(null);
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20 bg-soft-grey py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_1.35fr] lg:gap-14 lg:px-8">
        <Reveal>
          <div className="flex h-full flex-col">
            <span className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.24em] text-brand-teal">
              <span className="h-px w-6 bg-brand-teal" />
              Get in touch
            </span>
            <h2 id="contact-title" className="mt-4 text-3xl font-bold leading-tight text-charcoal sm:text-4xl">
              Let's Turn Your Data Into Intelligence
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Tell us about your organization and the decisions you want to improve. A ZENTRIQUE
              specialist will reply within one business day.
            </p>

            <ul className="mt-10 space-y-4">
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-brand-blue/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground">
                    <Mail className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm text-muted-foreground">Business email</span>
                    <span className="font-semibold text-charcoal">{company.email}</span>
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground">
                  <MapPin className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm text-muted-foreground">Office location</span>
                  <span className="font-semibold text-charcoal">{company.location}</span>
                </span>
              </li>
              <li className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground">
                  <Clock className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm text-muted-foreground">Response time</span>
                  <span className="font-semibold text-charcoal">Within one business day</span>
                </span>
              </li>
            </ul>

            <div className="mt-8">
              <p className="text-sm font-medium text-charcoal">Follow ZENTRIQUE</p>
              <ul className="mt-3 flex gap-3">
                {company.socials.map((s) => {
                  const Icon = socialIcons[s.label] ?? Mail;
                  return (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`ZENTRIQUE on ${s.label}`}
                        className="flex size-11 items-center justify-center rounded-xl border border-border bg-card text-charcoal transition-all hover:-translate-y-0.5 hover:border-brand-blue hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Icon className="size-5" aria-hidden="true" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_30px_60px_-30px_oklch(0.2_0.04_262/0.25)] sm:p-10">
            {sent ? (
              <div role="status" className="flex min-h-[28rem] flex-col items-center justify-center text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
                  <CheckCircle2 className="size-8" aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-2xl font-bold text-charcoal">Thank you, {sent.name}!</h3>
                <p className="mt-3 max-w-md text-muted-foreground">
                  {sent.intent === "demo"
                    ? "Your ZENTRIQUE PULSE demo request has been received. We'll be in touch within one business day to schedule it."
                    : "Your consultation request has been received. We'll be in touch within one business day to arrange a time."}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button variant="outline" size="lg" onClick={() => setSent(null)}>
                    Send another message
                  </Button>
                  <Button asChild size="lg">
                    <Link to="/services">Explore our services</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={onSubmit} aria-label="Contact form">
                <div className="grid gap-5 sm:grid-cols-2">
                  {fields.map((f) => (
                    <div key={f.name} className="space-y-2">
                      <Label htmlFor={`contact-${f.name}`} className="text-charcoal">
                        {f.label}
                        {f.required ? (
                          <span className="text-destructive" aria-hidden="true"> *</span>
                        ) : (
                          <span className="font-normal text-muted-foreground"> (optional)</span>
                        )}
                      </Label>
                      <Input
                        id={`contact-${f.name}`}
                        name={f.name}
                        type={f.type ?? "text"}
                        autoComplete={f.autoComplete}
                        placeholder={f.placeholder}
                        required={f.required}
                        aria-invalid={Boolean(errors[f.name])}
                        aria-describedby={errors[f.name] ? `contact-${f.name}-error` : undefined}
                        className={cn("h-12 bg-background", errors[f.name] && "border-destructive")}
                      />
                      {errors[f.name] && (
                        <p id={`contact-${f.name}-error`} className="text-sm text-destructive">
                          {errors[f.name]}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="contact-message" className="text-charcoal">
                      How can we help?<span className="text-destructive" aria-hidden="true"> *</span>
                    </Label>
                    <Textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      required
                      maxLength={2000}
                      placeholder="Tell us about your data, goals and timeline."
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? "contact-message-error" : undefined}
                      className={cn("bg-background", errors.message && "border-destructive")}
                    />
                    {errors.message && (
                      <p id="contact-message-error" className="text-sm text-destructive">
                        {errors.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Honeypot for spam bots — hidden from people and screen readers */}
                <div className="hidden" aria-hidden="true">
                  <label>
                    Website
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="submit"
                    name="intent"
                    value="consultation"
                    size="xl"
                    variant={preferred === "consultation" ? "hero" : "outline"}
                    disabled={pending !== null}
                    className="flex-1"
                  >
                    {pending === "consultation" ? (
                      <Loader2 className="animate-spin" aria-hidden="true" />
                    ) : (
                      <CalendarCheck aria-hidden="true" />
                    )}
                    Schedule Consultation
                  </Button>
                  <Button
                    type="submit"
                    name="intent"
                    value="demo"
                    size="xl"
                    variant={preferred === "demo" ? "hero" : "outline"}
                    disabled={pending !== null}
                    className="flex-1"
                  >
                    {pending === "demo" ? (
                      <Loader2 className="animate-spin" aria-hidden="true" />
                    ) : (
                      <Presentation aria-hidden="true" />
                    )}
                    Request Demo
                  </Button>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  By submitting, you agree that ZENTRIQUE may contact you about your enquiry. We never
                  share your details.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
