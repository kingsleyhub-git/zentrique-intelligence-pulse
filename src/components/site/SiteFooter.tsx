import { Link } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";
import { company, mainNav } from "@/lib/site";
import { services } from "@/lib/services";
import { Logo } from "./Logo";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-hero-line bg-navy-deep text-hero-muted print:hidden">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.2fr] lg:px-8">
        <div>
          <Link to="/" aria-label="ZENTRIQUE Intelligence home" className="inline-block">
            <Logo />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            AI-powered business intelligence, analytics, forecasting and decision support for
            organizations that want to decide with confidence.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {company.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-hero-foreground"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-display text-sm font-semibold tracking-wide text-hero-foreground">Company</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link to="/" className="transition-colors hover:text-hero-foreground">Home</Link></li>
            {mainNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition-colors hover:text-hero-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/about" hash="pillars" className="transition-colors hover:text-hero-foreground">
                Intelligence Pillars
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-semibold tracking-wide text-hero-foreground">Services</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link to="/services/$slug" params={{ slug: s.slug }} className="transition-colors hover:text-hero-foreground">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold tracking-wide text-hero-foreground">Get in touch</h2>
          <ul className="mt-4 space-y-4 text-sm">
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-brand-teal" aria-hidden="true" />
              <a href={`mailto:${company.email}`} className="transition-colors hover:text-hero-foreground">
                {company.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-teal" aria-hidden="true" />
              <span>{company.location}</span>
            </li>
          </ul>
          <div className="mt-6 flex flex-col gap-2 text-sm font-medium">
            <Link to="/contact" search={{ intent: "consultation" }} className="text-brand-teal transition-colors hover:text-hero-foreground">
              Book A Consultation →
            </Link>
            <Link to="/contact" search={{ intent: "demo" }} className="text-brand-teal transition-colors hover:text-hero-foreground">
              Request a PULSE Demo →
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-hero-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-xs sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {year} {company.name}. All rights reserved.</p>
          <p>Turning information into intelligence. Turning intelligence into impact.</p>
        </div>
      </div>
    </footer>
  );
}
