import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Plus, Tags } from "lucide-react";
import { AdminHeader, StatusBadge } from "@/components/admin/AdminHeader";
import { EmptyState } from "@/components/site/ui";
import { adminArticles } from "@/lib/admin/queries";
import { formatDate, publicationState } from "@/lib/utils";

export const metadata: Metadata = { title: "Artikel" };

// Session-gated admin page: rendered at request time (see admin/layout.tsx).
export const instant = false;

export default async function ArticlesAdminPage() {
  const articles = await adminArticles();
  return (
    <>
      <AdminHeader
        title="Artikel"
        description="Tulis, sunting, dan terbitkan artikel edukatif."
        actions={
          <>
            <Link href="/admin/articles/categories" className="btn-outline">
              <Tags size={16} aria-hidden /> Kategori
            </Link>
            <Link href="/admin/articles/new" className="btn-primary">
              <Plus size={16} aria-hidden /> Artikel baru
            </Link>
          </>
        }
      />
      {articles.length === 0 ? (
        <EmptyState title="Belum ada artikel" action={<Link href="/admin/articles/new" className="btn-primary">Tulis artikel</Link>} />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-5 py-3 font-semibold">Judul</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Terbit</th>
                <th className="px-5 py-3 font-semibold">Diperbarui</th>
                <th className="px-5 py-3">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {articles.map((a) => {
                const state = publicationState(a.status, a.published_at);
                return (
                  <tr key={a.id} className="align-top">
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink">{a.title}</p>
                      <p className="mt-0.5 text-xs text-muted">{a.categories.map((c) => c.name).join(", ") || "Tanpa kategori"}</p>
                    </td>
                    <td className="px-5 py-4">
                      {state === "draft" ? (
                        <StatusBadge tone="gray">Draf</StatusBadge>
                      ) : state === "scheduled" ? (
                        <StatusBadge tone="amber">Terjadwal</StatusBadge>
                      ) : (
                        <StatusBadge tone="green">Terbit</StatusBadge>
                      )}
                      {a.is_featured && <span className="ml-1.5 text-xs text-bud">★ Pilihan</span>}
                    </td>
                    <td className="px-5 py-4 text-muted">{formatDate(a.published_at) || "—"}</td>
                    <td className="px-5 py-4 text-muted">{formatDate(a.updated_at)}</td>
                    <td className="px-5 py-4 text-right">
                      <Link href={`/admin/articles/${a.id}`} className="btn-outline px-3 py-1.5" aria-label={`Ubah ${a.title}`}>
                        <Pencil size={14} aria-hidden /> Ubah
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
