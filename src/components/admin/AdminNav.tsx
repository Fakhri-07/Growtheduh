"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  Briefcase,
  CircleQuestionMark,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Settings,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { signOut } from "@/lib/admin/actions";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin/dashboard", label: "Dasbor", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profil Utama", icon: UserRound },
  { href: "/admin/team", label: "Tim", icon: Users },
  { href: "/admin/services", label: "Layanan", icon: Briefcase },
  { href: "/admin/articles", label: "Artikel", icon: BookOpen },
  { href: "/admin/testimonials", label: "Ulasan", icon: MessageSquareQuote },
  { href: "/admin/faqs", label: "FAQ", icon: CircleQuestionMark },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

function NavList({ pendingCount, onNavigate }: { pendingCount: number; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-1">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-brand text-white" : "text-ink/75 hover:bg-brand-soft hover:text-ink",
              )}
            >
              <Icon size={18} aria-hidden />
              <span className="flex-1">{label}</span>
              {href === "/admin/testimonials" && pendingCount > 0 && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    active ? "bg-white/20 text-white" : "bg-bud/15 text-[#9a5b00]",
                  )}
                  aria-label={`${pendingCount} ulasan menunggu`}
                >
                  {pendingCount}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Footer({ email }: { email: string | null }) {
  return (
    <div className="space-y-2 border-t border-line pt-4">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink/70 hover:bg-brand-soft"
      >
        <ExternalLink size={16} aria-hidden /> Lihat website
      </Link>
      {email && <p className="truncate px-3 text-xs text-muted">{email}</p>}
      <form action={signOut}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-danger hover:bg-red-50"
        >
          <LogOut size={16} aria-hidden /> Keluar
        </button>
      </form>
    </div>
  );
}

export function AdminSidebar({ email, pendingCount }: { email: string | null; pendingCount: number }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-white p-4 lg:flex">
      <Link href="/admin/dashboard" className="mb-6 flex items-center gap-2 px-3 pt-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/leaf-mark.png" alt="" width={28} height={28} />
        <span className="font-display text-lg font-medium text-ink">Admin GROWTHEDUH</span>
      </Link>
      <nav aria-label="Navigasi admin" className="flex-1 overflow-y-auto">
        <NavList pendingCount={pendingCount} />
      </nav>
      <Footer email={email} />
    </aside>
  );
}

export function AdminMobileBar({ email, pendingCount }: { email: string | null; pendingCount: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="sticky top-0 z-30 border-b border-line bg-white lg:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <span className="font-display text-base font-medium text-ink">Admin GROWTHEDUH</span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="admin-menu"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <div id="admin-menu" className="space-y-4 border-t border-line p-4">
          <nav aria-label="Navigasi admin seluler">
            <NavList pendingCount={pendingCount} onNavigate={() => setOpen(false)} />
          </nav>
          <Footer email={email} />
        </div>
      )}
    </div>
  );
}
