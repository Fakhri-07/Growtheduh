"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { NAV_LINKS } from "@/components/site/navigation";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNav({ waUrl }: { waUrl: string | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the menu after navigation (state adjustment during render).
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="menu-mobile"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-brand-soft"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div
          id="menu-mobile"
          className="fixed inset-x-0 top-20 bottom-0 z-40 overflow-y-auto border-t border-line bg-white"
        >
          <nav aria-label="Navigasi seluler" className="container-page py-6">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium",
                        active ? "bg-brand-soft text-brand-dark" : "text-ink hover:bg-canvas",
                      )}
                    >
                      <SiteIcon name={link.icon} size={20} className={active ? "text-brand" : "text-ink/45"} />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 border-t border-line pt-6">
              {waUrl ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full py-3.5 text-base"
                >
                  <WhatsAppIcon size={20} />
                  Konsultasi via WhatsApp
                </a>
              ) : (
                <p className="rounded-xl border border-dashed border-line p-4 text-center text-sm text-muted">
                  Nomor WhatsApp belum dikonfigurasi.
                </p>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
