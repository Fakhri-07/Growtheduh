import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Check, RotateCcw, Trash, X } from "lucide-react";
import { AdminHeader, StatusBadge } from "@/components/admin/AdminHeader";
import { ActionButton } from "@/components/admin/ConfirmButton";
import { StarRating } from "@/components/site/StarRating";
import { EmptyState } from "@/components/site/ui";
import { deleteTestimonial, setTestimonialStatus, setTestimonialVerified } from "@/lib/admin/actions";
import { adminTestimonials } from "@/lib/admin/queries";
import type { TestimonialStatus } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Ulasan" };

// Session-gated admin page: rendered at request time (see admin/layout.tsx).
export const instant = false;

const FILTERS: { value: TestimonialStatus | "all"; label: string }[] = [
  { value: "pending", label: "Menunggu" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
  { value: "all", label: "Semua" },
];

export default async function TestimonialsAdminPage({ searchParams }: PageProps<"/admin/testimonials">) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.status) ? sp.status[0] : sp.status;
  const status = FILTERS.some((f) => f.value === raw) ? (raw as TestimonialStatus | "all") : "pending";
  const items = await adminTestimonials(status);

  return (
    <>
      <AdminHeader
        title="Moderasi Ulasan"
        description="Hanya ulasan yang disetujui yang tampil di website. Jangan publikasikan ulasan yang memuat data pribadi atau informasi sensitif."
      />

      <nav aria-label="Filter status ulasan" className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "pending" ? "/admin/testimonials" : `/admin/testimonials?status=${f.value}`}
            aria-current={status === f.value ? "page" : undefined}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium",
              status === f.value ? "bg-brand text-white" : "border border-line bg-white text-ink/75 hover:bg-brand-soft",
            )}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      {items.length === 0 ? (
        <EmptyState title="Tidak ada ulasan" description="Belum ada ulasan dengan status ini." />
      ) : (
        <ul className="space-y-4">
          {items.map((t) => (
            <li key={t.id} className="card p-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <p className="font-semibold text-ink">{t.display_name}</p>
                <StarRating value={t.rating} size={14} />
                <StatusBadge tone={t.status === "approved" ? "green" : t.status === "pending" ? "amber" : "red"}>
                  {t.status === "approved" ? "Disetujui" : t.status === "pending" ? "Menunggu" : "Ditolak"}
                </StatusBadge>
                {t.is_verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand">
                    <BadgeCheck size={14} aria-hidden /> Terverifikasi
                  </span>
                )}
                <span className="ml-auto text-xs text-muted">{formatDate(t.created_at)}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-ink/85">{t.content}</p>
              <p className="mt-2 text-xs text-muted">
                {t.service_category ? `Layanan: ${t.service_category}` : "Layanan tidak disebutkan"} ·{" "}
                {t.claims_client ? "Mengaku pernah menggunakan layanan" : "Tidak menyatakan sebagai klien"}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                {t.status !== "approved" && (
                  <ActionButton action={setTestimonialStatus.bind(null, t.id, "approved")} className="btn-primary px-4 py-2">
                    <Check size={16} aria-hidden /> Setujui
                  </ActionButton>
                )}
                {t.status !== "rejected" && (
                  <ActionButton action={setTestimonialStatus.bind(null, t.id, "rejected")} className="btn-outline px-4 py-2">
                    <X size={16} aria-hidden /> Tolak
                  </ActionButton>
                )}
                {t.status !== "pending" && (
                  <ActionButton action={setTestimonialStatus.bind(null, t.id, "pending")} className="btn-ghost px-4 py-2">
                    <RotateCcw size={16} aria-hidden /> Kembalikan ke menunggu
                  </ActionButton>
                )}
                {t.status === "approved" &&
                  (t.is_verified ? (
                    <ActionButton action={setTestimonialVerified.bind(null, t.id, false)} className="btn-ghost px-4 py-2">
                      Hapus label terverifikasi
                    </ActionButton>
                  ) : (
                    <ActionButton
                      action={setTestimonialVerified.bind(null, t.id, true)}
                      confirm="Tandai sebagai klien terverifikasi HANYA jika Anda telah memastikan penulis ulasan benar-benar menggunakan layanan GROWTHEDUH. Lanjutkan?"
                      className="btn-ghost px-4 py-2"
                    >
                      <BadgeCheck size={16} aria-hidden /> Tandai terverifikasi
                    </ActionButton>
                  ))}
                <ActionButton
                  action={deleteTestimonial.bind(null, t.id)}
                  confirm="Hapus ulasan ini secara permanen?"
                  className="btn-danger ml-auto px-4 py-2"
                >
                  <Trash size={16} aria-hidden /> Hapus
                </ActionButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
