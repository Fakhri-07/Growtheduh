import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Briefcase, FilePen, MessageSquareQuote, Plus, Users } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { adminSettings, adminStats } from "@/lib/admin/queries";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Dasbor" };

// Session-gated admin page: rendered at request time (see admin/layout.tsx).
export const instant = false;

export default async function DashboardPage() {
  const [stats, settings] = await Promise.all([adminStats(), adminSettings()]);
  const cards = [
    { label: "Artikel terbit", value: stats.published, icon: BookOpen, href: "/admin/articles" },
    { label: "Draf artikel", value: stats.drafts, icon: FilePen, href: "/admin/articles" },
    { label: "Layanan", value: stats.services, icon: Briefcase, href: "/admin/services" },
    { label: "Anggota tim", value: stats.team, icon: Users, href: "/admin/team" },
    { label: "Total ulasan masuk", value: stats.reviews, icon: MessageSquareQuote, href: "/admin/testimonials?status=all" },
    {
      label: "Ulasan menunggu",
      value: stats.pending,
      icon: MessageSquareQuote,
      href: "/admin/testimonials",
      highlight: stats.pending > 0,
    },
  ];

  const checklist = [
    { done: Boolean(normalizeWhatsAppNumber(settings.whatsapp_number)), text: "Verifikasi nomor WhatsApp admin", href: "/admin/settings" },
    { done: Boolean(settings.linkedin_url), text: "Tambahkan URL LinkedIn", href: "/admin/settings" },
    { done: Boolean(settings.mission), text: "Isi misi GROWTHEDUH", href: "/admin/settings" },
    { done: Boolean(settings.address || settings.business_hours), text: "Isi lokasi & jam layanan (jika ada)", href: "/admin/settings" },
    { done: stats.published > 0, text: "Terbitkan artikel pertama", href: "/admin/articles/new" },
  ];

  return (
    <>
      <AdminHeader
        title="Dasbor"
        description="Ringkasan konten website GROWTHEDUH."
        actions={
          <Link href="/admin/articles/new" className="btn-primary">
            <Plus size={16} aria-hidden /> Artikel baru
          </Link>
        }
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, href, highlight }) => (
          <li key={label}>
            <Link
              href={href}
              className={`card flex items-center gap-4 p-5 transition-shadow hover:shadow-lift ${highlight ? "border-bud/50 bg-[#fffaf0]" : ""}`}
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${highlight ? "bg-bud/15 text-[#9a5b00]" : "bg-brand-soft text-brand"}`}>
                <Icon size={20} aria-hidden />
              </div>
              <div>
                <p className="font-display text-3xl leading-none text-ink">{value}</p>
                <p className="mt-1 text-sm text-muted">{label}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <section className="card mt-8 p-6" aria-labelledby="checklist">
        <h2 id="checklist" className="font-semibold text-ink">
          Checklist sebelum peluncuran
        </h2>
        <p className="mt-1 text-sm text-muted">
          Lengkapi informasi resmi GROWTHEDUH. Jangan mengisi data yang belum dikonfirmasi.
        </p>
        <ul className="mt-4 divide-y divide-line">
          {checklist.map((item) => (
            <li key={item.text} className="flex items-center justify-between gap-3 py-3 text-sm">
              <span className={item.done ? "text-muted line-through" : "text-ink"}>
                {item.done ? "✓ " : "○ "}
                {item.text}
              </span>
              {!item.done && (
                <Link href={item.href} className="inline-flex items-center gap-1 font-medium text-brand">
                  Buka <ArrowRight size={14} aria-hidden />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
