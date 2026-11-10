"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { NAV_LINKS } from "@/components/site/navigation";
import { cn } from "@/lib/utils";

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Vertical icon navigation. `pathname` is null in the static fallback. */
export function SidebarNavList({ pathname }: { pathname: string | null }) {
  return (
    <ul className="space-y-1">
      {NAV_LINKS.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3.5 rounded-2xl px-4 py-3 text-[15px] font-medium transition duration-200 [@media(max-height:820px)]:py-2.5 [@media(max-height:700px)]:py-2",
                active
                  ? "bg-gradient-to-r from-brand-soft to-white text-brand-dark shadow-soft ring-1 ring-brand/10"
                  : "text-ink/65 hover:bg-canvas hover:text-ink",
              )}
            >
              {active && (
                <span aria-hidden className="absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand" />
              )}
              <SiteIcon
                name={link.icon}
                size={20}
                className={cn("transition-transform duration-200 group-hover:scale-110", active ? "text-brand" : "text-ink/45")}
              />
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function SidebarNav() {
  const pathname = usePathname();
  return <SidebarNavList pathname={pathname} />;
}
