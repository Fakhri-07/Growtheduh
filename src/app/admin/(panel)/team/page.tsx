import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUp, Pencil, Plus, UserRound } from "lucide-react";
import { AdminHeader, StatusBadge } from "@/components/admin/AdminHeader";
import { ActionButton } from "@/components/admin/ConfirmButton";
import { SmartImage } from "@/components/site/SmartImage";
import { EmptyState } from "@/components/site/ui";
import { moveItem } from "@/lib/admin/actions";
import { adminTeam } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Tim" };

// Session-gated admin page: rendered at request time (see admin/layout.tsx).
export const instant = false;

export default async function TeamAdminPage() {
  const team = await adminTeam();
  return (
    <>
      <AdminHeader
        title="Tim Profesional"
        description="Kelola profil anggota tim. Jangan menambahkan anggota atau kredensial yang belum dikonfirmasi."
        actions={
          <Link href="/admin/team/new" className="btn-primary">
            <Plus size={16} aria-hidden /> Tambah anggota
          </Link>
        }
      />
      {team.length === 0 ? (
        <EmptyState title="Belum ada anggota tim" />
      ) : (
        <ul className="space-y-3">
          {team.map((m, i) => (
            <li key={m.id} className="card flex items-center gap-4 p-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-brand-soft">
                {m.portrait_url ? (
                  <SmartImage src={m.portrait_url} alt="" fill sizes="56px" className="object-cover object-top" />
                ) : (
                  <UserRound className="m-auto mt-3.5 text-brand/50" size={28} aria-hidden />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{m.full_name}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {m.is_featured && <StatusBadge tone="green">Profil utama</StatusBadge>}
                  <StatusBadge tone={m.is_published ? "green" : "gray"}>{m.is_published ? "Tampil" : "Disembunyikan"}</StatusBadge>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <ActionButton
                  action={moveItem.bind(null, "team_members", m.id, "up")}
                  title="Naikkan urutan"
                  className={`btn-ghost h-9 w-9 p-0 ${i === 0 ? "invisible" : ""}`}
                >
                  <ArrowUp size={16} aria-hidden />
                </ActionButton>
                <ActionButton
                  action={moveItem.bind(null, "team_members", m.id, "down")}
                  title="Turunkan urutan"
                  className={`btn-ghost h-9 w-9 p-0 ${i === team.length - 1 ? "invisible" : ""}`}
                >
                  <ArrowDown size={16} aria-hidden />
                </ActionButton>
                <Link href={`/admin/team/${m.id}`} className="btn-outline px-3 py-2" aria-label={`Ubah ${m.full_name}`}>
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
