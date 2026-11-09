import type { Metadata } from "next";
import { ArrowDown, ArrowUp, Trash } from "lucide-react";
import { ActionForm } from "@/components/admin/ActionForm";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ActionButton } from "@/components/admin/ConfirmButton";
import { TextField } from "@/components/admin/fields";
import { deleteCategory, moveItem, saveCategory } from "@/lib/admin/actions";
import { adminCategories } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Kategori Artikel" };

// Session-gated admin page: rendered at request time (see admin/layout.tsx).
export const instant = false;

export default async function CategoriesPage() {
  const categories = await adminCategories();
  return (
    <>
      <AdminHeader
        title="Kategori Artikel"
        description="Kategori membantu pembaca menemukan artikel yang relevan."
        back={{ href: "/admin/articles", label: "Kembali ke artikel" }}
      />

      <section className="card p-5 sm:p-6" aria-labelledby="tambah-kategori">
        <h2 id="tambah-kategori" className="font-semibold text-ink">
          Tambah kategori
        </h2>
        <ActionForm action={saveCategory} submitLabel="Tambah" resetOnSuccess className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField name="name" label="Nama" required maxLength={80} />
            <TextField name="slug" label="Slug" hint="Otomatis jika kosong." />
          </div>
          <input type="hidden" name="sort_order" value={categories.length + 1} />
        </ActionForm>
      </section>

      <ul className="mt-6 space-y-3">
        {categories.map((c, i) => (
          <li key={c.id} className="card flex items-start gap-2 p-4">
            <div className="flex shrink-0 flex-col">
              <ActionButton
                action={moveItem.bind(null, "article_categories", c.id, "up")}
                title="Naikkan urutan"
                className={`btn-ghost h-8 w-8 p-0 ${i === 0 ? "invisible" : ""}`}
              >
                <ArrowUp size={16} aria-hidden />
              </ActionButton>
              <ActionButton
                action={moveItem.bind(null, "article_categories", c.id, "down")}
                title="Turunkan urutan"
                className={`btn-ghost h-8 w-8 p-0 ${i === categories.length - 1 ? "invisible" : ""}`}
              >
                <ArrowDown size={16} aria-hidden />
              </ActionButton>
            </div>
            <details className="min-w-0 flex-1">
              <summary className="flex cursor-pointer list-none items-center gap-3 py-1.5 [&::-webkit-details-marker]:hidden">
                <span className="flex-1">
                  <span className="font-medium text-ink">{c.name}</span>
                  <span className="ml-2 text-xs text-muted">/{c.slug}</span>
                </span>
                <span className="btn-outline px-3 py-1.5">Ubah</span>
              </summary>
              <ActionForm
                action={saveCategory}
                className="mt-4 border-t border-line pt-4"
                footer={
                  <ActionButton
                    action={deleteCategory.bind(null, c.id)}
                    confirm={`Hapus kategori "${c.name}"? Artikel tidak akan terhapus.`}
                    className="btn-danger"
                  >
                    <Trash size={16} aria-hidden /> Hapus
                  </ActionButton>
                }
              >
                <input type="hidden" name="id" value={c.id} />
                <input type="hidden" name="sort_order" value={c.sort_order} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField name="name" label="Nama" defaultValue={c.name} required maxLength={80} />
                  <TextField name="slug" label="Slug" defaultValue={c.slug} />
                </div>
              </ActionForm>
            </details>
          </li>
        ))}
      </ul>
    </>
  );
}
