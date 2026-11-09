import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div
      // Page-level h1 headings animate on load (PageHeader); section headings reveal on scroll.
      data-reveal={Tag === "h2" ? "" : undefined}
      className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}
    >
      {eyebrow && <p className={cn("eyebrow", align === "center" && "justify-center")}>{eyebrow}</p>}
      <Tag className="heading-display mt-3 text-3xl leading-tight sm:text-4xl">{title}</Tag>
      {description && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{description}</p>}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-white">
      <div
        aria-hidden
        className="anim-breathe pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-soft blur-2xl"
      />
      <LeafAccent className="absolute top-10 right-[12%] hidden text-leaf/50 sm:block" size={34} rotate={-18} />
      <LeafAccent className="absolute right-[22%] bottom-8 hidden text-brand/25 md:block" size={22} rotate={24} delay={1800} />
      <div className="container-page relative py-14 sm:py-20">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="eyebrow anim-rise" style={{ "--delay": "0ms" } as React.CSSProperties}>
              {eyebrow}
            </p>
          )}
          <h1
            className="heading-display anim-rise mt-3 text-3xl leading-tight sm:text-5xl"
            style={{ "--delay": "100ms" } as React.CSSProperties}
          >
            {title}
          </h1>
          {description && (
            <p
              className="anim-rise mt-4 text-base leading-relaxed text-muted sm:text-lg"
              style={{ "--delay": "220ms" } as React.CSSProperties}
            >
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="anim-rise mt-8" style={{ "--delay": "340ms" } as React.CSSProperties}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

/** Small decorative leaf (echoes the logo) that floats slowly. */
export function LeafAccent({
  className,
  size = 28,
  rotate = 0,
  delay = 0,
  duration = 7000,
}: {
  className?: string;
  size?: number;
  rotate?: number;
  delay?: number;
  duration?: number;
}) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("anim-float pointer-events-none", className)}
      style={
        { "--r": `${rotate}deg`, "--delay": `${delay}ms`, "--dur": `${duration}ms`, transform: `rotate(${rotate}deg)` } as React.CSSProperties
      }
    >
      <path d="M20.5 3.5C11 3.6 5.2 7.9 4.3 14.7c-.2 1.4 0 2.8.5 4.1L3 20.6l1.1 1.1 1.9-1.9c1.2.5 2.6.7 4 .5 6.8-.9 10.9-6.7 10.5-16.8ZM9.7 18.6c-1 .1-2-.1-2.8-.4l7.5-7.5-1.1-1.1-7.5 7.5c-.3-.9-.5-1.8-.4-2.8.7-5.2 4.8-8.6 12.5-9.1-.4 7.8-3.7 12.7-8.2 13.4Z" />
    </svg>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-reveal=""
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
          {icon}
        </div>
      )}
      <p className="font-display text-xl text-ink">{title}</p>
      {description && <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="container-page animate-pulse py-16" aria-busy="true" aria-label="Memuat">
      <div className="h-4 w-32 rounded bg-line" />
      <div className="mt-8 h-14 w-14 rounded-2xl bg-brand-soft" />
      <div className="mt-6 h-10 w-2/3 rounded bg-line" />
      <div className="mt-4 h-5 w-1/2 rounded bg-line" />
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="h-40 rounded-2xl bg-line/60" />
        <div className="h-40 rounded-2xl bg-line/60" />
        <div className="h-40 rounded-2xl bg-line/60" />
      </div>
    </div>
  );
}

export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-sand bg-sand-soft/60 px-4 py-3 text-sm text-ink/70">
      {children}
    </p>
  );
}
