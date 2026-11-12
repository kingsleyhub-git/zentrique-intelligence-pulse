import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useHydrated } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  CheckCircle2,
  Facebook,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Send,
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
import {
  CONTACT_SUCCESS_MESSAGE,
  SERVICE_REQUIRED_FOR,
  contactMethods,
  contactSchema,
  enquiryTypes,
  industryOptions,
  serviceOptions,
  type ContactIntent,
  type ServiceInterest,
} from "@/lib/contact.schema";
import { company } from "@/lib/site";
import { cn } from "@/lib/utils";

const socialIcons: Record<string, LucideIcon> = {
  LinkedIn: Linkedin,
  "X (Twitter)": Twitter,
  Facebook,
  Instagram,
};

type Field = "intent" | "name" | "email" | "company" | "phone" | "industry" | "service" | "preferredContact" | "message";
type Errors = Partial<Record<Field, string>>;

const submitLabel: Record<ContactIntent, string> = {
  consultation: "Book consultation",
  demo: "Request PULSE demo",
  "bi-services": "Send enquiry",
  "ai-predictive": "Send enquiry",
  research: "Send enquiry",
  partnership: "Send enquiry",
};

const selectClass =
  "flex h-12 w-full rounded-md border border-input bg-background px-3 text-base text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 md:text-sm";

function FieldShell({
  id,
  label,
  required,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string | undefined;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-charcoal">
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden="true"> *</span>
        ) : (
          <span className="font-normal text-muted-foreground"> (optional)</span>
        )}
      </Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactSection({
  initialIntent,
  initialService,
}: {
  initialIntent?: ContactIntent | undefined;
  initialService?: ServiceInterest | undefined;
}) {
  const send = useServerFn(submitContact);
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [intent, setIntent] = useState<ContactIntent | "">(initialIntent ?? "");
  const [service, setService] = useState<string>(initialService ?? (initialIntent === "demo" ? "pulse" : ""));
  // Until the page is interactive, block native submission so details never land in the URL.
  const hydrated = useHydrated();
  const serviceRequired = intent !== "" && SERVICE_REQUIRED_FOR.includes(intent);

  const describe = (f: Field) => (errors[f] ? `contact-${f}-error` : undefined);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const raw = {
      intent,
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      industry: String(fd.get("industry") ?? ""),
      service,
      preferredContact: String(fd.get("preferredContact") ?? ""),
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
    setPending(true);
    try {
      await send({ data: raw });
      setSent(true);
      form.reset();
    } catch {
      toast.error("We couldn't send your enquiry", {
        description: `Nothing was submitted. Please try again, or email us at ${company.email}.`,
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20 bg-soft-grey py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_1.35fr] lg:gap-14 lg:px-8">
        <Reveal className="min-w-0">
          <div className="flex h-full flex-col">
            <span className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.24em] text-brand-teal">
              <span className="h-px w-6 bg-brand-teal" />
              Contact &amp; consultation
            </span>
            <h2 id="contact-title" className="mt-4 text-3xl font-bold leading-tight text-charcoal sm:text-4xl">
              Let's Turn Your Data Into Intelligence.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Tell us about your organization, your data and the decisions you want to improve. Our team
              will help identify an appropriate intelligence solution.
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
                  <span className="min-w-0">
                    <span className="block text-sm text-muted-foreground">Business email</span>
                    <span className="block break-words font-semibold text-charcoal">{company.email}</span>
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
            </ul>

            <div className="mt-8">
              <p className="text-sm font-medium text-charcoal">Follow ZENTRIQUE</p>
              <ul className="mt-3 flex flex-wrap gap-3">
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

        <Reveal delay={120} className="min-w-0">
          <div id="enquiry" className="scroll-mt-28 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-10">
            {sent ? (
              <div role="status" className="flex min-h-[28rem] flex-col items-center justify-center text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
                  <CheckCircle2 className="size-8" aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-2xl font-bold text-charcoal">Enquiry received</h3>
                <p className="mt-3 max-w-md text-muted-foreground">{CONTACT_SUCCESS_MESSAGE}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button variant="outline" size="lg" onClick={() => setSent(false)}>
                    Send another enquiry
                  </Button>
                  <Button asChild size="lg">
                    <Link to="/services">Explore our services</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form noValidate method="post" onSubmit={onSubmit} aria-label="Enquiry form" aria-busy={!hydrated}>
                <h3 className="text-xl font-bold text-charcoal">
                  {intent === "demo" ? "Request a PULSE demonstration" : intent === "consultation" ? "Book a consultation" : "Send us an enquiry"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">Fields marked * are required.</p>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <FieldShell id="contact-intent" label="Type of enquiry" required error={errors.intent} className="sm:col-span-2">
                    <select
                      id="contact-intent"
                      name="intent"
                      value={intent}
                      onChange={(e) => {
                        const v = e.target.value as ContactIntent | "";
                        setIntent(v);
                        if (v === "demo" && !service) setService("pulse");
                      }}
                      aria-invalid={Boolean(errors.intent)}
                      aria-describedby={describe("intent")}
                      className={cn(selectClass, errors.intent && "border-destructive")}
                    >
                      <option value="">Choose the type of enquiry</option>
                      {enquiryTypes.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </FieldShell>

                  <FieldShell id="contact-name" label="Full name" required error={errors.name}>
                    <Input id="contact-name" name="name" autoComplete="name" placeholder="Jane Wanjiru" aria-invalid={Boolean(errors.name)} aria-describedby={describe("name")} className={cn("h-12 bg-background", errors.name && "border-destructive")} />
                  </FieldShell>
                  <FieldShell id="contact-email" label="Business email" required error={errors.email}>
                    <Input id="contact-email" name="email" type="email" autoComplete="email" placeholder="jane@organization.com" aria-invalid={Boolean(errors.email)} aria-describedby={describe("email")} className={cn("h-12 bg-background", errors.email && "border-destructive")} />
                  </FieldShell>
                  <FieldShell id="contact-company" label="Organization" error={errors.company}>
                    <Input id="contact-company" name="company" autoComplete="organization" placeholder="Organization name" aria-invalid={Boolean(errors.company)} aria-describedby={describe("company")} className={cn("h-12 bg-background", errors.company && "border-destructive")} />
                  </FieldShell>
                  <FieldShell id="contact-phone" label="Phone number" error={errors.phone}>
                    <Input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="+254 7XX XXX XXX" aria-invalid={Boolean(errors.phone)} aria-describedby={describe("phone")} className={cn("h-12 bg-background", errors.phone && "border-destructive")} />
                  </FieldShell>

                  <FieldShell id="contact-industry" label="Industry" required error={errors.industry}>
                    <select id="contact-industry" name="industry" defaultValue="" aria-invalid={Boolean(errors.industry)} aria-describedby={describe("industry")} className={cn(selectClass, errors.industry && "border-destructive")}>
                      <option value="">Choose your industry</option>
                      {industryOptions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </FieldShell>

                  <FieldShell id="contact-service" label="Service of interest" required={serviceRequired} error={errors.service}>
                    <select
                      id="contact-service"
                      name="service"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      aria-invalid={Boolean(errors.service)}
                      aria-describedby={describe("service")}
                      className={cn(selectClass, errors.service && "border-destructive")}
                    >
                      <option value="">Choose a service</option>
                      {serviceOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </FieldShell>

                  <FieldShell id="contact-message" label="Business challenge" required error={errors.message} className="sm:col-span-2">
                    <Textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      maxLength={2000}
                      placeholder="Describe your organization, the data you have and the decisions you want to improve."
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={describe("message")}
                      className={cn("bg-background", errors.message && "border-destructive")}
                    />
                  </FieldShell>

                  <FieldShell id="contact-preferredContact" label="Preferred contact method" error={errors.preferredContact}>
                    <select id="contact-preferredContact" name="preferredContact" defaultValue="" aria-describedby={describe("preferredContact")} className={selectClass}>
                      <option value="">No preference</option>
                      {contactMethods.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </FieldShell>
                </div>

                {/* Honeypot for spam bots — hidden from people and screen readers */}
                <div className="hidden" aria-hidden="true">
                  <label>
                    Website
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                <Button type="submit" size="xl" variant="hero" disabled={!hydrated || pending} className="mt-8 w-full sm:w-auto">
                  {pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
                  {intent ? submitLabel[intent] : "Send enquiry"}
                </Button>
                <p className="mt-4 text-xs text-muted-foreground">
                  Your details are stored securely and used only to respond to this enquiry. We never share
                  them with third parties.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
