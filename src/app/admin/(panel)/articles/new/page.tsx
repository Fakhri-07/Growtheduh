import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { adminCategories, adminTeam } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Artikel Baru" };

// Session-gated admin page: rendered at request time (see admin/layout.tsx).
export const instant = false;

export default async function NewArticlePage() {
  const [categories, team] = await Promise.all([adminCategories(), adminTeam()]);
  return (
    <>
      <AdminHeader title="Artikel Baru" back={{ href: "/admin/articles", label: "Kembali ke artikel" }} />
      <ArticleForm categories={categories} team={team} />
    </>
  );
}
