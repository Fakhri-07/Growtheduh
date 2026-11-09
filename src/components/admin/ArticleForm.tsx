import { ActionForm } from "@/components/admin/ActionForm";
import { Checkbox, FormSection, Select, TextArea, TextField } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/ImageField";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { saveArticle } from "@/lib/admin/actions";
import type { Article, ArticleCategory, TeamMember } from "@/lib/types";
import { toJakartaInput } from "@/lib/utils";

export function ArticleForm({
  article,
  categories,
  team,
}: {
  article?: Article | null;
  categories: ArticleCategory[];
  team: TeamMember[];
}) {
  const selected = new Set(article?.categories.map((c) => c.id));

  return (
    <ActionForm action={saveArticle} submitLabel="Simpan artikel">
      {article && <input type="hidden" name="id" value={article.id} />}

      <div className="rounded-xl border border-sand bg-sand-soft/60 px-4 py-3 text-sm text-ink/80">
        Artikel edukatif wajib ditinjau oleh tim GROWTHEDUH sebelum diterbitkan. Hindari klaim ilmiah tanpa sumber dan
        jangan menjanjikan hasil tertentu.
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-5 rounded-2xl border border-line bg-white p-5 sm:p-6">
            <TextField name="title" label="Judul" defaultValue={article?.title} required maxLength={200} />
            <TextArea
              name="excerpt"
              label="Ringkasan"
              defaultValue={article?.excerpt}
              rows={2}
              maxLength={400}
              hint="Tampil di kartu artikel dan sebagai deskripsi bawaan."
            />
            <MarkdownEditor name="content" defaultValue={article?.content ?? ""} />
          </div>

          <FormSection title="SEO" description="Opsional. Jika kosong, judul dan ringkasan artikel yang digunakan.">
            <TextField name="slug" label="Slug URL" defaultValue={article?.slug} hint="Otomatis dari judul jika kosong." />
            <TextField name="seo_title" label="Judul SEO" defaultValue={article?.seo_title} maxLength={120} />
            <TextArea
              name="seo_description"
              label="Deskripsi SEO"
              defaultValue={article?.seo_description}
              rows={2}
              maxLength={300}
              className="sm:col-span-2"
            />
          </FormSection>
        </div>

        <div className="space-y-6">
          <div className="space-y-5 rounded-2xl border border-line bg-white p-5">
            <Select
              name="status"
              label="Status"
              defaultValue={article?.status ?? "draft"}
              options={[
                { value: "draft", label: "Draf (tidak tampil)" },
                { value: "published", label: "Terbit" },
              ]}
            />
            <TextField
              name="published_at"
              label="Tanggal terbit (WIB)"
              type="datetime-local"
              defaultValue={toJakartaInput(article?.published_at)}
              hint="Kosongkan untuk memakai waktu saat diterbitkan. Tanggal di masa depan = terjadwal."
            />
            <Checkbox name="is_featured" label="Artikel pilihan" defaultChecked={article?.is_featured} />
          </div>

          <fieldset className="rounded-2xl border border-line bg-white p-5">
            <legend className="sr-only">Kategori</legend>
            <p className="label">Kategori</p>
            {categories.length ? (
              <div className="space-y-2">
                {categories.map((c) => (
                  <label key={c.id} className="flex items-center gap-2.5 text-sm text-ink/85">
                    <input
                      type="checkbox"
                      name="category_ids"
                      value={c.id}
                      defaultChecked={selected.has(c.id)}
                      className="h-4 w-4 accent-brand"
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">Belum ada kategori.</p>
            )}
          </fieldset>

          <div className="space-y-5 rounded-2xl border border-line bg-white p-5">
            <Select
              name="author_id"
              label="Penulis (anggota tim)"
              defaultValue={article?.author_id ?? ""}
              options={[{ value: "", label: "— Bukan anggota tim —" }, ...team.map((m) => ({ value: m.id, label: m.full_name }))]}
            />
            <TextField
              name="author_name"
              label="Nama penulis lain"
              defaultValue={article?.author_name}
              hint="Dipakai jika penulis bukan anggota tim. Default: Tim GROWTHEDUH."
            />
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <ImageField name="featured_image" label="Gambar utama" currentUrl={article?.featured_image_url} />
            <TextField
              name="featured_image_alt"
              label="Teks alternatif gambar"
              defaultValue={article?.featured_image_alt}
              maxLength={200}
              className="mt-4"
              hint="Deskripsi singkat gambar untuk aksesibilitas."
            />
          </div>
        </div>
      </div>
    </ActionForm>
  );
}
