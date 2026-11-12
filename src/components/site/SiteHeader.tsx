import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mainNav } from "@/lib/site";
import { Logo } from "./Logo";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the page changes.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        open
          ? "border-b border-hero-line bg-navy-deep shadow-lg"
          : scrolled
            ? "border-b border-hero-line bg-navy/90 shadow-lg backdrop-blur-xl"
            : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6 lg:px-8">
        <Link to="/" aria-label="ZENTRIQUE Intelligence home" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {mainNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative rounded-lg px-4 py-2 text-sm font-medium text-hero-muted transition-colors hover:text-hero-foreground data-[status=active]:text-hero-foreground data-[status=active]:after:absolute data-[status=active]:after:inset-x-4 data-[status=active]:after:-bottom-0.5 data-[status=active]:after:h-0.5 data-[status=active]:after:rounded-full data-[status=active]:after:bg-brand-teal"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="heroOutline" size="lg" className="rounded-lg">
            <Link to="/contact" search={{ intent: "demo" }}>
              Request Demo
            </Link>
          </Button>
          <Button asChild variant="hero" size="lg" className="group rounded-lg">
            <Link to="/contact" search={{ intent: "consultation" }}>
              Book A Consultation
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg p-2 text-hero-foreground lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="flex max-h-[calc(100dvh-5rem)] flex-col gap-1 overflow-y-auto border-t border-hero-line px-6 py-4 lg:hidden"
          aria-label="Mobile"
        >
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="rounded-lg px-3 py-3 text-base font-medium text-hero-muted data-[status=active]:bg-hero-line/40 data-[status=active]:text-hero-foreground"
          >
            Home
          </Link>
          {mainNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg px-3 py-3 text-base font-medium text-hero-muted data-[status=active]:bg-hero-line/40 data-[status=active]:text-hero-foreground"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Button asChild variant="hero" size="lg">
              <Link to="/contact" search={{ intent: "consultation" }}>
                Book A Consultation
              </Link>
            </Button>
            <Button asChild variant="heroOutline" size="lg">
              <Link to="/contact" search={{ intent: "demo" }}>
                Request Demo
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
