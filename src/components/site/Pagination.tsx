import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  page: number;
  pageCount: number;
  /** Builds the href for a page number, preserving other query params. */
  hrefFor: (page: number) => string;
};

export function Pagination({ page, pageCount, hrefFor }: Props) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1,
  );

  return (
    <nav aria-label="Navigasi halaman" className="mt-12 flex items-center justify-center gap-1.5">
      <PageLink href={page > 1 ? hrefFor(page - 1) : null} label="Halaman sebelumnya">
        <ChevronLeft size={18} aria-hidden />
      </PageLink>
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && p - pages[i - 1] > 1 && <span className="px-1 text-muted">…</span>}
          <Link
            href={hrefFor(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors",
              p === page ? "bg-brand text-white" : "border border-line bg-white text-ink hover:bg-brand-soft",
            )}
          >
            {p}
          </Link>
        </span>
      ))}
      <PageLink href={page < pageCount ? hrefFor(page + 1) : null} label="Halaman berikutnya">
        <ChevronRight size={18} aria-hidden />
      </PageLink>
    </nav>
  );
}

function PageLink({ href, label, children }: { href: string | null; label: string; children: React.ReactNode }) {
  const cls = "inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white";
  if (!href) {
    return (
      <span className={cn(cls, "text-muted/50")} aria-hidden>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} aria-label={label} className={cn(cls, "text-ink hover:bg-brand-soft")}>
      {children}
    </Link>
  );
}
