import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
  size?: "md" | "lg";
};

/** Counts up from 0 to `value` once the stat scrolls into view. */
export function StatCounter({ value, suffix = "", label, duration = 1800, size = "md" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(Math.round(value * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <div ref={ref} className="flex flex-col gap-1">
      <span
        className={
          size === "lg"
            ? "font-display text-4xl font-bold tabular-nums text-hero-foreground sm:text-5xl xl:text-6xl"
            : "font-display text-3xl font-bold tabular-nums text-hero-foreground sm:text-4xl"
        }
      >
        {display}
        <span className="text-brand-teal">{suffix}</span>
      </span>
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-hero-muted">
        {label}
      </span>
    </div>
  );
}
