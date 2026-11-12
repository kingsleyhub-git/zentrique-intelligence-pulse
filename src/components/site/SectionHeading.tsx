import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  id,
  eyebrow,
  title,
  children,
  align = "center",
  tone = "dark",
  as: Heading = "h2",
}: {
  id?: string | undefined;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "center" | "left";
  tone?: "dark" | "light";
  /** Use "h1" when the heading is the page's main title. */
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <span
        className={cn(
          "inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.24em] text-brand-teal",
        )}
      >
        <span className="h-px w-6 bg-brand-teal" />
        {eyebrow}
      </span>
      <Heading
        id={id}
        className={cn(
          "mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl",
          tone === "dark" ? "text-charcoal" : "text-hero-foreground",
        )}
      >
        {title}
      </Heading>
      {children && (
        <p
          className={cn(
            "mt-5 text-lg leading-relaxed",
            tone === "dark" ? "text-muted-foreground" : "text-hero-muted",
          )}
        >
          {children}
        </p>
      )}
    </div>
  );
}
