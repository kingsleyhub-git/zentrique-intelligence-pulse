import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-hero-line bg-navy-deep text-hero-muted">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm">
            Turning information into intelligence. Turning intelligence into impact.
          </p>
        </div>
        <nav className="flex gap-6 text-sm" aria-label="Footer">
          <Link to="/" className="hover:text-hero-foreground">Home</Link>
          <Link to="/about" className="hover:text-hero-foreground">About Us</Link>
          <Link to="/about" hash="pillars" className="hover:text-hero-foreground">Pillars</Link>
        </nav>
      </div>
      <div className="border-t border-hero-line py-5 text-center text-xs">
        © {new Date().getFullYear()} ZENTRIQUE Intelligence Limited. All rights reserved.
      </div>
    </footer>
  );
}
