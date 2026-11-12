import mark from "@/assets/zentrique-mark.png";
import { cn } from "@/lib/utils";

export function Logo({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <img src={mark} alt="" width={36} height={30} className="h-8 w-auto" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-bold tracking-[0.18em]",
            tone === "light" ? "text-hero-foreground" : "text-charcoal",
          )}
        >
          ZENTRIQUE
        </span>
        <span className="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.42em] text-brand-teal">
          Intelligence
        </span>
      </span>
    </span>
  );
}
