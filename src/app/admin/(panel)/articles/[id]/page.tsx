import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CircleCheck, ExternalLink, Trash } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { ActionButton } from "@/components/admin/ConfirmButton";
import { deleteArticle } from "@/lib/admin/actions";
import { adminArticle, adminCategories, adminTeam } from "@/lib/admin/queries";
import { publicationState } from "@/lib/utils";

export const metadata: Metadata = { title: "Ubah Artikel" };

// Session-gated admin page: rendered at request time (see admin/layout.tsx).
export const instant = false;

export default async function EditArticlePage({ params, searchParams }: PageProps<"/admin/articles/[id]">) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const [article, categories, team] = await Promise.all([adminArticle(id), adminCategories(), adminTeam()]);
  if (!article) notFound();

  const isLive = publicationState(article.status, article.published_at) === "live";

  return (
    <>
      <AdminHeader
        title="Ubah Artikel"
        description={article.title}
        back={{ href: "/admin/articles", label: "Kembali ke artikel" }}
        actions={
          <>
            {isLive && (
              <Link href={`/artikel/${article.slug}`} target="_blank" className="btn-outline">
                <ExternalLink size={16} aria-hidden /> Lihat
              </Link>
            )}
            <ActionButton
              action={deleteArticle.bind(null, article.id)}
              confirm={`Hapus artikel "${article.title}"? Tindakan ini tidak dapat dibatalkan.`}
              className="btn-danger"
            >
              <Trash size={16} aria-hidden /> Hapus
            </ActionButton>
          </>
        }
      />
      {sp.saved && (
        <p role="status" className="mb-6 flex items-center gap-2 rounded-xl bg-brand-soft px-4 py-3 text-sm font-medium text-brand-dark">
          <CircleCheck size={16} aria-hidden /> Artikel berhasil dibuat.
        </p>
      )}
      <ArticleForm article={article} categories={categories} team={team} />
    </>
  );
}
