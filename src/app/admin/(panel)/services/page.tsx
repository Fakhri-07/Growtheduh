import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUp, Pencil, Plus } from "lucide-react";
import { AdminHeader, StatusBadge } from "@/components/admin/AdminHeader";
import { ActionButton } from "@/components/admin/ConfirmButton";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { EmptyState } from "@/components/site/ui";
import { moveItem } from "@/lib/admin/actions";
import { adminServices } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Layanan" };

// Session-gated admin page: rendered at request time (see admin/layout.tsx).
export const instant = false;

export default async function ServicesAdminPage() {
  const services = await adminServices();
  return (
    <>
      <AdminHeader
        title="Layanan"
        description="Atur daftar layanan, urutan tampil, dan status publikasi."
        actions={
          <Link href="/admin/services/new" className="btn-primary">
            <Plus size={16} aria-hidden /> Tambah layanan
          </Link>
        }
      />
      {services.length === 0 ? (
        <EmptyState title="Belum ada layanan" />
      ) : (
        <ul className="space-y-3">
          {services.map((s, i) => (
            <li key={s.id} className="card flex items-center gap-4 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <ServiceIcon name={s.icon} size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{s.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <StatusBadge tone={s.is_published ? "green" : "gray"}>{s.is_published ? "Terbit" : "Disembunyikan"}</StatusBadge>
                  <span>/layanan/{s.slug}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <ActionButton
                  action={moveItem.bind(null, "services", s.id, "up")}
                  title="Naikkan urutan"
                  className={`btn-ghost h-9 w-9 p-0 ${i === 0 ? "invisible" : ""}`}
                >
                  <ArrowUp size={16} aria-hidden />
                </ActionButton>
                <ActionButton
                  action={moveItem.bind(null, "services", s.id, "down")}
                  title="Turunkan urutan"
                  className={`btn-ghost h-9 w-9 p-0 ${i === services.length - 1 ? "invisible" : ""}`}
                >
                  <ArrowDown size={16} aria-hidden />
                </ActionButton>
                <Link href={`/admin/services/${s.id}`} className="btn-outline px-3 py-2" aria-label={`Ubah ${s.title}`}>
                  <Pencil size={14} aria-hidden /> Ubah
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
