import "server-only";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { DEFAULT_SETTINGS } from "@/lib/content/defaults";
import { isSupabaseConfigured } from "@/lib/env";
import { createSessionClient as sessionClient } from "@/lib/supabase/server";
import type { Article, ArticleCategory, Faq, Service, SiteSettings, TeamMember, Testimonial, TestimonialStatus } from "@/lib/types";

/**
 * Admin reads (uncached, per request). Each read authorises the caller first
 * — pages can render independently of the layout, so the layout gate alone
 * is not enough — and then uses the admin's session so RLS applies.
 */
async function createSessionClient() {
  if (!isSupabaseConfigured()) redirect("/admin/login");
  await requireAdmin();
  return sessionClient();
}

export async function adminStats() {
  const supabase = await createSessionClient();
  const count = async (table: string, filter?: (q: ReturnType<typeof base>) => ReturnType<typeof base>) => {
    let q = base(table);
    if (filter) q = filter(q);
    const { count } = await q;
    return count ?? 0;
  };
  function base(table: string) {
    return supabase.from(table).select("id", { count: "exact", head: true });
  }
  const [published, drafts, services, team, reviews, pending] = await Promise.all([
    count("articles", (q) => q.eq("status", "published")),
    count("articles", (q) => q.eq("status", "draft")),
    count("services"),
    count("team_members"),
    count("testimonials"),
    count("testimonials", (q) => q.eq("status", "pending")),
  ]);
  return { published, drafts, services, team, reviews, pending };
}

export async function adminSettings(): Promise<SiteSettings> {
  const supabase = await createSessionClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return { ...DEFAULT_SETTINGS, ...(data ?? {}) } as SiteSettings;
}

export async function adminTeam(): Promise<TeamMember[]> {
  const supabase = await createSessionClient();
  const { data } = await supabase.from("team_members").select("*").order("sort_order").order("created_at");
  return (data ?? []) as TeamMember[];
}

export async function adminTeamMember(id: string): Promise<TeamMember | null> {
  if (!isUuid(id)) return null;
  const supabase = await createSessionClient();
  const { data } = await supabase.from("team_members").select("*").eq("id", id).maybeSingle();
  return (data as TeamMember) ?? null;
}

export async function adminFeaturedProfile(): Promise<TeamMember | null> {
  const supabase = await createSessionClient();
  const { data } = await supabase.from("team_members").select("*").eq("is_featured", true).maybeSingle();
  return (data as TeamMember) ?? null;
}

export async function adminServices(): Promise<Service[]> {
  const supabase = await createSessionClient();
  const { data } = await supabase.from("services").select("*").order("sort_order").order("created_at");
  return (data ?? []) as Service[];
}

export async function adminService(id: string): Promise<Service | null> {
  if (!isUuid(id)) return null;
  const supabase = await createSessionClient();
  const { data } = await supabase.from("services").select("*").eq("id", id).maybeSingle();
  return (data as Service) ?? null;
}

export async function adminCategories(): Promise<ArticleCategory[]> {
  const supabase = await createSessionClient();
  const { data } = await supabase
    .from("article_categories")
    .select("id, name, slug, description, sort_order")
    .order("sort_order")
    .order("name");
  return (data ?? []) as ArticleCategory[];
}

type ArticleRow = Omit<Article, "categories"> & {
  article_category_relations: { article_categories: ArticleCategory | null }[] | null;
};

const ARTICLE_SELECT = "*, article_category_relations(article_categories(id, name, slug, description, sort_order))";

function mapArticle(row: ArticleRow): Article {
  const { article_category_relations, ...rest } = row;
  return {
    ...rest,
    categories: (article_category_relations ?? []).map((r) => r.article_categories).filter(Boolean) as ArticleCategory[],
  };
}

export async function adminArticles(): Promise<Article[]> {
  const supabase = await createSessionClient();
  const { data } = await supabase.from("articles").select(ARTICLE_SELECT).order("updated_at", { ascending: false });
  return ((data ?? []) as unknown as ArticleRow[]).map(mapArticle);
}

export async function adminArticle(id: string): Promise<Article | null> {
  if (!isUuid(id)) return null;
  const supabase = await createSessionClient();
  const { data } = await supabase.from("articles").select(ARTICLE_SELECT).eq("id", id).maybeSingle();
  return data ? mapArticle(data as unknown as ArticleRow) : null;
}

export async function adminTestimonials(status: TestimonialStatus | "all"): Promise<Testimonial[]> {
  const supabase = await createSessionClient();
  let q = supabase
    .from("testimonials")
    .select("id, display_name, rating, content, service_category, claims_client, is_verified, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status !== "all") q = q.eq("status", status);
  const { data } = await q;
  return (data ?? []) as Testimonial[];
}

export async function adminFaqs(): Promise<Faq[]> {
  const supabase = await createSessionClient();
  const { data } = await supabase.from("faqs").select("*").order("sort_order").order("created_at");
  return (data ?? []) as Faq[];
}

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}
