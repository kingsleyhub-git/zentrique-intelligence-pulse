import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || open
          ? "border-b border-hero-line bg-navy/90 shadow-lg backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link to="/" aria-label="ZENTRIQUE Intelligence home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              className="rounded-lg px-4 py-2 text-sm font-medium text-hero-muted transition-colors hover:text-hero-foreground data-[status=active]:text-hero-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/about"
            hash="pillars"
            className="rounded-lg px-4 py-2 text-sm font-medium text-hero-muted transition-colors hover:text-hero-foreground"
          >
            Intelligence Pillars
          </Link>
        </nav>

        <div className="hidden md:block">
          <Button variant="hero" size="lg" className="rounded-lg">
            Book A Consultation
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg p-2 text-hero-foreground md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-hero-line px-6 py-4 md:hidden" aria-label="Mobile">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-hero-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/about"
            hash="pillars"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-3 text-base font-medium text-hero-foreground"
          >
            Intelligence Pillars
          </Link>
          <Button variant="hero" size="lg" className="mt-2">
            Book A Consultation
          </Button>
        </nav>
      )}
    </header>
  );
}
