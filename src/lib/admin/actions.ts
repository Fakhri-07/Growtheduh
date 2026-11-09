"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { adminClient, UnauthorizedError } from "@/lib/auth";
import { resolveImageField, removeStoredImage, UploadError } from "@/lib/admin/upload";
import { TAGS } from "@/lib/data/public";
import { isSupabaseConfigured } from "@/lib/env";
import { createSessionClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types";
import { fromJakartaInput, slugify } from "@/lib/utils";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";

// ============================================================== helpers

type Tag = (typeof TAGS)[keyof typeof TAGS];

/** Runs an admin mutation with uniform authorisation + error handling. */
async function guarded(fn: () => Promise<ActionState>): Promise<ActionState> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof UnauthorizedError || err instanceof UploadError) {
      return { ok: false, message: err.message };
    }
    // Let Next.js handle redirect()/notFound() control-flow errors.
    if (err && typeof err === "object" && "digest" in err) throw err;
    console.error("[admin action]", err);
    return { ok: false, message: "Terjadi kesalahan tak terduga. Silakan coba lagi." };
  }
}

function invalidate(...tags: Tag[]) {
  for (const tag of tags) updateTag(tag);
  refresh();
}

function dbError(error: { code?: string; message: string }): ActionState {
  if (error.code === "23505") return { ok: false, message: "Slug atau nama sudah digunakan. Gunakan yang lain." };
  if (error.code === "23514") return { ok: false, message: "Ada isian yang tidak memenuhi aturan validasi." };
  if (error.code === "42501") return { ok: false, message: "Anda tidak memiliki izin untuk tindakan ini." };
  console.error("[admin db]", error);
  return { ok: false, message: `Gagal menyimpan: ${error.message}` };
}

function firstIssue(error: z.ZodError): ActionState {
  const issue = error.issues[0];
  return { ok: false, message: issue?.message ?? "Data tidak valid." };
}

const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} maksimal ${max} karakter.`)
    .optional()
    .transform((v) => (v ? v : null));

const optionalUrl = (label: string) =>
  z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || /^https?:\/\/\S+$/i.test(v), `${label} harus berupa URL lengkap (https://…).`);

const slugField = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? slugify(v) : ""));

const checkbox = z
  .string()
  .optional()
  .transform((v) => v === "on");

const sortOrder = z.coerce.number().int().min(0).max(9999).default(0);

function data(formData: FormData) {
  return Object.fromEntries(formData) as Record<string, string>;
}

// ================================================================= auth

const LoginSchema = z.object({
  email: z.email("Format email tidak valid."),
  password: z.string().min(6, "Kata sandi minimal 6 karakter."),
});

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Supabase belum dikonfigurasi. Lihat README untuk langkah penyiapan." };
  }
  const parsed = LoginSchema.safeParse(data(formData));
  if (!parsed.success) return firstIssue(parsed.error);

  const supabase = await createSessionClient();
  const { data: auth, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !auth.user) return { ok: false, message: "Email atau kata sandi salah." };

  const { data: role } = await supabase.from("admin_roles").select("user_id").eq("user_id", auth.user.id).maybeSingle();
  if (!role) {
    await supabase.auth.signOut();
    return { ok: false, message: "Akun ini tidak memiliki akses admin." };
  }
  redirect("/admin/dashboard");
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

// ============================================================= settings

const SettingsSchema = z.object({
  brand_name: z.string().trim().min(1, "Nama brand wajib diisi.").max(80),
  tagline: optionalText(200, "Tagline"),
  whatsapp_number: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || normalizeWhatsAppNumber(v) !== null, "Nomor WhatsApp tidak valid (contoh: 0851xxxxxxxx)."),
  whatsapp_message: optionalText(500, "Pesan WhatsApp"),
  email: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v), "Format email tidak valid."),
  instagram_url: optionalUrl("Instagram"),
  tiktok_url: optionalUrl("TikTok"),
  linkedin_url: optionalUrl("LinkedIn"),
  address: optionalText(500, "Alamat"),
  maps_url: optionalUrl("Tautan peta"),
  business_hours: optionalText(500, "Jam layanan"),
  hero_headline: optionalText(200, "Judul hero"),
  hero_description: optionalText(600, "Deskripsi hero"),
  about_intro: optionalText(2000, "Pengantar"),
  brand_story: optionalText(5000, "Cerita brand"),
  vision: optionalText(1000, "Visi"),
  mission: optionalText(3000, "Misi"),
  values_text: optionalText(1000, "Nilai"),
  footer_description: optionalText(400, "Deskripsi footer"),
  emergency_info: optionalText(1000, "Informasi darurat"),
});

export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { supabase } = await adminClient();
    const parsed = SettingsSchema.safeParse(data(formData));
    if (!parsed.success) return firstIssue(parsed.error);

    const logo_url = await resolveImageField(supabase, formData, "logo", "branding");
    const { error } = await supabase.from("site_settings").upsert({ id: 1, ...parsed.data, logo_url });
    if (error) return dbError(error);

    invalidate(TAGS.settings);
    return { ok: true, message: "Pengaturan berhasil disimpan." };
  });
}

// ========================================================== team / profile

const TeamSchema = z.object({
  id: z.string().optional(),
  full_name: z.string().trim().min(2, "Nama lengkap wajib diisi.").max(120),
  slug: slugField,
  professional_title: optionalText(160, "Gelar/jabatan"),
  short_bio: optionalText(400, "Bio singkat"),
  biography: optionalText(8000, "Biografi"),
  education: optionalText(3000, "Pendidikan"),
  experience: optionalText(3000, "Pengalaman"),
  specializations: optionalText(3000, "Keahlian"),
  qualifications: optionalText(3000, "Kualifikasi"),
  linkedin_url: optionalUrl("LinkedIn"),
  profile_url: optionalUrl("Profil lainnya"),
  is_published: checkbox,
  is_featured: checkbox,
  sort_order: sortOrder,
  return_to: z.string().optional(),
});

export async function saveTeamMember(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { supabase } = await adminClient();
    const parsed = TeamSchema.safeParse(data(formData));
    if (!parsed.success) return firstIssue(parsed.error);
    const { id, return_to, ...fields } = parsed.data;
    const slug = fields.slug || slugify(fields.full_name.split(",")[0]);
    if (!slug) return { ok: false, message: "Slug tidak valid." };

    const portrait_url = await resolveImageField(supabase, formData, "portrait", "team");

    // Only one featured profile: un-feature the others first.
    if (fields.is_featured) {
      let q = supabase.from("team_members").update({ is_featured: false }).eq("is_featured", true);
      if (id) q = q.neq("id", id);
      const { error } = await q;
      if (error) return dbError(error);
    }

    const row = { ...fields, slug, portrait_url };
    const { error } = id
      ? await supabase.from("team_members").update(row).eq("id", id)
      : await supabase.from("team_members").insert(row);
    if (error) return dbError(error);

    invalidate(TAGS.team);
    if (!id) redirect(return_to === "profile" ? "/admin/profile" : "/admin/team");
    return { ok: true, message: "Profil berhasil disimpan." };
  });
}

export async function deleteTeamMember(id: string) {
  const { supabase } = await adminClient();
  const { data: row } = await supabase.from("team_members").select("portrait_url").eq("id", id).maybeSingle();
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await removeStoredImage(supabase, row?.portrait_url ?? null);
  invalidate(TAGS.team, TAGS.articles);
  redirect("/admin/team");
}

// ============================================================== services

const ServiceSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2, "Judul layanan wajib diisi.").max(120),
  slug: slugField,
  summary: z.string().trim().min(1, "Ringkasan wajib diisi.").max(400, "Ringkasan maksimal 400 karakter."),
  description: optionalText(8000, "Deskripsi"),
  items: optionalText(3000, "Rincian"),
  icon: optionalText(40, "Ikon"),
  whatsapp_message: optionalText(500, "Pesan WhatsApp"),
  price_info: optionalText(500, "Informasi biaya"),
  duration_info: optionalText(500, "Informasi durasi"),
  location_info: optionalText(500, "Informasi lokasi"),
  is_published: checkbox,
  sort_order: sortOrder,
});

export async function saveService(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { supabase } = await adminClient();
    const parsed = ServiceSchema.safeParse(data(formData));
    if (!parsed.success) return firstIssue(parsed.error);
    const { id, ...fields } = parsed.data;
    const slug = fields.slug || slugify(fields.title);
    const image_url = await resolveImageField(supabase, formData, "image", "services");

    const row = { ...fields, slug, image_url };
    const { error } = id
      ? await supabase.from("services").update(row).eq("id", id)
      : await supabase.from("services").insert(row);
    if (error) return dbError(error);

    invalidate(TAGS.services);
    if (!id) redirect("/admin/services");
    return { ok: true, message: "Layanan berhasil disimpan." };
  });
}

export async function deleteService(id: string) {
  const { supabase } = await adminClient();
  const { data: row } = await supabase.from("services").select("image_url").eq("id", id).maybeSingle();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await removeStoredImage(supabase, row?.image_url ?? null);
  invalidate(TAGS.services);
  redirect("/admin/services");
}

// ------------------------------------------------------------- ordering

const ORDERABLE = { services: TAGS.services, faqs: TAGS.faqs, team_members: TAGS.team, article_categories: TAGS.categories } as const;

/** Moves a row up/down by swapping sort_order with its neighbour (then renumbers). */
export async function moveItem(table: keyof typeof ORDERABLE, id: string, direction: "up" | "down") {
  if (!(table in ORDERABLE)) throw new Error("Tabel tidak valid.");
  const { supabase } = await adminClient();
  const { data: rows, error } = await supabase.from(table).select("id, sort_order").order("sort_order").order("created_at");
  if (error || !rows) throw new Error(error?.message ?? "Gagal memuat urutan.");

  const ids = rows.map((r) => r.id as string);
  const idx = ids.indexOf(id);
  const swap = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swap < 0 || swap >= ids.length) return;
  [ids[idx], ids[swap]] = [ids[swap], ids[idx]];

  await Promise.all(
    ids.map((rowId, i) =>
      rows.find((r) => r.id === rowId)?.sort_order === i + 1
        ? null
        : supabase.from(table).update({ sort_order: i + 1 }).eq("id", rowId),
    ),
  );
  invalidate(ORDERABLE[table]);
}

// ============================================================== articles

const ArticleSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, "Judul minimal 3 karakter.").max(200),
  slug: slugField,
  excerpt: optionalText(400, "Ringkasan"),
  content: z.string().max(100_000, "Konten terlalu panjang.").default(""),
  featured_image_alt: optionalText(200, "Teks alternatif gambar"),
  author_id: z
    .string()
    .optional()
    .transform((v) => (v ? v : null)),
  author_name: optionalText(120, "Nama penulis"),
  status: z.enum(["draft", "published"]),
  published_at: z.string().optional(),
  is_featured: checkbox,
  seo_title: optionalText(120, "Judul SEO"),
  seo_description: optionalText(300, "Deskripsi SEO"),
});

export async function saveArticle(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { supabase } = await adminClient();
    const parsed = ArticleSchema.safeParse(data(formData));
    if (!parsed.success) return firstIssue(parsed.error);
    const { id, published_at: publishedInput, ...fields } = parsed.data;
    const slug = fields.slug || slugify(fields.title);
    if (!slug) return { ok: false, message: "Slug tidak valid." };
    if (fields.status === "published" && fields.content.trim().length < 50) {
      return { ok: false, message: "Konten artikel terlalu pendek untuk dipublikasikan." };
    }

    let published_at = fromJakartaInput(publishedInput);
    if (fields.status === "published" && !published_at) published_at = new Date().toISOString();

    const categoryIds = formData
      .getAll("category_ids")
      .map(String)
      .filter((v) => /^[0-9a-f-]{36}$/i.test(v));

    const featured_image_url = await resolveImageField(supabase, formData, "featured_image", "articles");
    const row = { ...fields, slug, published_at, featured_image_url };

    let articleId = id;
    if (id) {
      const { error } = await supabase.from("articles").update(row).eq("id", id);
      if (error) return dbError(error);
    } else {
      const { data: inserted, error } = await supabase.from("articles").insert(row).select("id").single();
      if (error) return dbError(error);
      articleId = inserted.id as string;
    }

    const { error: delErr } = await supabase.from("article_category_relations").delete().eq("article_id", articleId);
    if (delErr) return dbError(delErr);
    if (categoryIds.length) {
      const { error: relErr } = await supabase
        .from("article_category_relations")
        .insert(categoryIds.map((category_id) => ({ article_id: articleId, category_id })));
      if (relErr) return dbError(relErr);
    }

    invalidate(TAGS.articles);
    if (!id) redirect(`/admin/articles/${articleId}?saved=1`);
    return {
      ok: true,
      message: fields.status === "published" ? "Artikel tersimpan dan dipublikasikan." : "Draf artikel tersimpan.",
    };
  });
}

export async function deleteArticle(id: string) {
  const { supabase } = await adminClient();
  const { data: row } = await supabase.from("articles").select("featured_image_url").eq("id", id).maybeSingle();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await removeStoredImage(supabase, row?.featured_image_url ?? null);
  invalidate(TAGS.articles);
  redirect("/admin/articles");
}

// ============================================================ categories

const CategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "Nama kategori minimal 2 karakter.").max(80),
  slug: slugField,
  description: optionalText(400, "Deskripsi"),
  sort_order: sortOrder,
});

export async function saveCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { supabase } = await adminClient();
    const parsed = CategorySchema.safeParse(data(formData));
    if (!parsed.success) return firstIssue(parsed.error);
    const { id, ...fields } = parsed.data;
    const row = { ...fields, slug: fields.slug || slugify(fields.name) };
    const { error } = id
      ? await supabase.from("article_categories").update(row).eq("id", id)
      : await supabase.from("article_categories").insert(row);
    if (error) return dbError(error);
    invalidate(TAGS.categories, TAGS.articles);
    return { ok: true, message: id ? "Kategori diperbarui." : "Kategori ditambahkan." };
  });
}

export async function deleteCategory(id: string) {
  const { supabase } = await adminClient();
  const { error } = await supabase.from("article_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  invalidate(TAGS.categories, TAGS.articles);
}

// ========================================================= testimonials

export async function setTestimonialStatus(id: string, status: "approved" | "rejected" | "pending") {
  const { supabase } = await adminClient();
  const patch =
    status === "approved"
      ? { status, approved_at: new Date().toISOString() }
      : { status, approved_at: null, ...(status === "rejected" ? { is_verified: false } : {}) };
  const { error } = await supabase.from("testimonials").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  invalidate(TAGS.testimonials);
}

export async function setTestimonialVerified(id: string, verified: boolean) {
  const { supabase } = await adminClient();
  const { error } = await supabase.from("testimonials").update({ is_verified: verified }).eq("id", id);
  if (error) throw new Error(error.message);
  invalidate(TAGS.testimonials);
}

export async function deleteTestimonial(id: string) {
  const { supabase } = await adminClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);
  invalidate(TAGS.testimonials);
}

// ================================================================== faqs

const FaqSchema = z.object({
  id: z.string().optional(),
  question: z.string().trim().min(5, "Pertanyaan minimal 5 karakter.").max(300),
  answer: z.string().trim().min(2, "Jawaban wajib diisi.").max(3000),
  is_published: checkbox,
  sort_order: sortOrder,
});

export async function saveFaq(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { supabase } = await adminClient();
    const parsed = FaqSchema.safeParse(data(formData));
    if (!parsed.success) return firstIssue(parsed.error);
    const { id, ...row } = parsed.data;
    if (!id && !row.sort_order) {
      const { count } = await supabase.from("faqs").select("id", { count: "exact", head: true });
      row.sort_order = (count ?? 0) + 1;
    }
    const { error } = id
      ? await supabase.from("faqs").update(row).eq("id", id)
      : await supabase.from("faqs").insert(row);
    if (error) return dbError(error);
    invalidate(TAGS.faqs);
    return { ok: true, message: id ? "FAQ diperbarui." : "FAQ ditambahkan." };
  });
}

export async function deleteFaq(id: string) {
  const { supabase } = await adminClient();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  invalidate(TAGS.faqs);
}
