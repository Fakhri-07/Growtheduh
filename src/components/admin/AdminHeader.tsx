import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

export function AdminHeader({
  title,
  description,
  back,
  actions,
}: {
  title: string;
  description?: ReactNode;
  back?: { href: string; label: string };
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8">
      {back && (
        <Link href={back.href} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-dark">
          <ArrowLeft size={16} aria-hidden /> {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="heading-display text-2xl sm:text-3xl">{title}</h1>
          {description && <p className="mt-1.5 text-sm text-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  );
}

export function StatusBadge({ tone, children }: { tone: "green" | "gray" | "amber" | "red"; children: ReactNode }) {
  const tones = {
    green: "bg-brand-soft text-brand-dark",
    gray: "bg-canvas text-muted border border-line",
    amber: "bg-[#fff3dc] text-[#8a5300]",
    red: "bg-red-50 text-danger",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}
