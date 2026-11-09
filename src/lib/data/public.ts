import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_FAQS,
  DEFAULT_SERVICES,
  DEFAULT_SETTINGS,
  DEFAULT_TEAM,
} from "@/lib/content/defaults";
import type {
  Article,
  ArticleCategory,
  Faq,
  Service,
  SiteSettings,
  TeamMember,
  Testimonial,
} from "@/lib/types";

/**
 * Public, cached read layer.
 *
 * Every function runs under `'use cache'` with a cache tag; admin server
 * actions call `updateTag(<tag>)` after a mutation so visitors see changes
 * immediately. Only published/approved rows are visible thanks to RLS.
 */

export const TAGS = {
  settings: "settings",
  team: "team",
  services: "services",
  articles: "articles",
  categories: "categories",
  testimonials: "testimonials",
  faqs: "faqs",
} as const;

function logError(scope: string, error: unknown) {
  console.error(`[data:${scope}]`, error instanceof Error ? error.message : error);
}

// ---------------------------------------------------------------- settings

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.settings);

  const supabase = createPublicClient();
  if (!supabase) return DEFAULT_SETTINGS;

  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) {
    if (error) logError("settings", error);
    return DEFAULT_SETTINGS;
  }
  return { ...DEFAULT_SETTINGS, ...stripNulls(data) } as SiteSettings;
}

/** Keep DB nulls (an admin may clear a field) but drop unknown columns. */
function stripNulls(row: Record<string, unknown>): Partial<SiteSettings> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    if (key in row) out[key] = row[key];
  }
  return out as Partial<SiteSettings>;
}

// -------------------------------------------------------------------- team

export async function getTeamMembers(): Promise<TeamMember[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.team);

  const supabase = createPublicClient();
  if (!supabase) return DEFAULT_TEAM;

  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("sort_order", { ascending: true });
  if (error) {
    logError("team", error);
    return [];
  }
  return (data ?? []) as TeamMember[];
}

export async function getFeaturedProfile(): Promise<TeamMember | null> {
  const team = await getTeamMembers();
  return team.find((m) => m.is_featured) ?? team[0] ?? null;
}

export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  const team = await getTeamMembers();
  return team.find((m) => m.slug === slug) ?? null;
}

// ---------------------------------------------------------------- services

export async function getServices(): Promise<Service[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.services);

  const supabase = createPublicClient();
  if (!supabase) return DEFAULT_SERVICES;

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) {
    logError("services", error);
    return [];
  }
  return (data ?? []) as Service[];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const services = await getServices();
  return services.find((s) => s.slug === slug) ?? null;
}

// -------------------------------------------------------------- categories

export async function getCategories(): Promise<ArticleCategory[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.categories);

  const supabase = createPublicClient();
  if (!supabase) return DEFAULT_CATEGORIES;

  const { data, error } = await supabase
    .from("article_categories")
    .select("id, name, slug, description, sort_order")
    .order("sort_order", { ascending: true });
  if (error) {
    logError("categories", error);
    return [];
  }
  return (data ?? []) as ArticleCategory[];
}

// ---------------------------------------------------------------- articles

const ARTICLE_SELECT =
  "id, slug, title, excerpt, content, featured_image_url, featured_image_alt, author_id, author_name, status, is_featured, published_at, seo_title, seo_description, created_at, updated_at, article_category_relations(article_categories(id, name, slug, description, sort_order))";

type ArticleRow = Omit<Article, "categories"> & {
  article_category_relations?: { article_categories: ArticleCategory | null }[] | null;
};

function mapArticle(row: ArticleRow): Article {
  const { article_category_relations, ...rest } = row;
  return {
    ...rest,
    categories: (article_category_relations ?? [])
      .map((r) => r.article_categories)
      .filter((c): c is ArticleCategory => Boolean(c)),
  };
}

export const ARTICLES_PER_PAGE = 9;

export type ArticleQuery = { q?: string; category?: string; page?: number };

export type ArticleList = { articles: Article[]; total: number; page: number; pageCount: number };

/** PostgREST `or()` filters break on these characters, so strip them. */
function sanitizeSearch(q: string): string {
  return q.replace(/[,()%*\\:."']/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
}

export async function getArticles({ q = "", category = "", page = 1 }: ArticleQuery): Promise<ArticleList> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.articles);

  const empty: ArticleList = { articles: [], total: 0, page: 1, pageCount: 1 };
  const supabase = createPublicClient();
  if (!supabase) return empty;

  const safePage = Math.max(1, Math.floor(page) || 1);
  let query = supabase
    .from("articles")
    .select(ARTICLE_SELECT, { count: "exact" })
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (category) {
    const { data: cat } = await supabase.from("article_categories").select("id").eq("slug", category).maybeSingle();
    if (!cat) return empty;
    const { data: rel } = await supabase
      .from("article_category_relations")
      .select("article_id")
      .eq("category_id", cat.id);
    const ids = (rel ?? []).map((r) => r.article_id as string);
    if (ids.length === 0) return empty;
    query = query.in("id", ids);
  }

  const term = sanitizeSearch(q);
  if (term) {
    query = query.or(`title.ilike.%${term}%,excerpt.ilike.%${term}%,content.ilike.%${term}%`);
  }

  const from = (safePage - 1) * ARTICLES_PER_PAGE;
  const { data, error, count } = await query.range(from, from + ARTICLES_PER_PAGE - 1);
  if (error) {
    logError("articles", error);
    return empty;
  }
  const total = count ?? 0;
  return {
    articles: ((data ?? []) as unknown as ArticleRow[]).map(mapArticle),
    total,
    page: safePage,
    pageCount: Math.max(1, Math.ceil(total / ARTICLES_PER_PAGE)),
  };
}

export async function getLatestArticles(limit = 3): Promise<Article[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.articles);

  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) {
    logError("latest-articles", error);
    return [];
  }
  return ((data ?? []) as unknown as ArticleRow[]).map(mapArticle);
}

export async function getFeaturedArticle(): Promise<Article | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.articles);

  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .eq("is_featured", true)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    logError("featured-article", error);
    return null;
  }
  return data ? mapArticle(data as unknown as ArticleRow) : null;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.articles);

  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();
  if (error) {
    logError("article", error);
    return null;
  }
  return data ? mapArticle(data as unknown as ArticleRow) : null;
}

export async function getRelatedArticles(
  articleId: string,
  categoryIds: string[],
  limit = 3,
): Promise<Article[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.articles);

  const supabase = createPublicClient();
  if (!supabase) return [];

  let ids: string[] = [];
  if (categoryIds.length) {
    const { data } = await supabase
      .from("article_category_relations")
      .select("article_id")
      .in("category_id", categoryIds)
      .neq("article_id", articleId)
      .limit(30);
    ids = [...new Set((data ?? []).map((r) => r.article_id as string))];
  }

  let query = supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .neq("id", articleId)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);
  if (ids.length) query = query.in("id", ids);

  const { data, error } = await query;
  if (error) {
    logError("related-articles", error);
    return [];
  }
  return ((data ?? []) as unknown as ArticleRow[]).map(mapArticle);
}

export async function getAllArticleSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.articles);

  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("articles")
    .select("slug, updated_at")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString());
  return (data ?? []) as { slug: string; updated_at: string }[];
}

// ------------------------------------------------------------ testimonials

export const TESTIMONIALS_PER_PAGE = 12;

export type TestimonialStats = {
  count: number;
  average: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

export async function getTestimonialStats(): Promise<TestimonialStats> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.testimonials);

  const stats: TestimonialStats = { count: 0, average: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
  const supabase = createPublicClient();
  if (!supabase) return stats;

  const { data, error } = await supabase.from("testimonials").select("rating").eq("status", "approved");
  if (error) {
    logError("testimonial-stats", error);
    return stats;
  }
  let sum = 0;
  for (const { rating } of (data ?? []) as { rating: number }[]) {
    if (rating >= 1 && rating <= 5) {
      stats.distribution[rating as 1 | 2 | 3 | 4 | 5] += 1;
      sum += rating;
      stats.count += 1;
    }
  }
  stats.average = stats.count ? Math.round((sum / stats.count) * 10) / 10 : 0;
  return stats;
}

const TESTIMONIAL_SELECT =
  "id, display_name, rating, content, service_category, claims_client, is_verified, status, created_at";

export async function getApprovedTestimonials(
  page = 1,
): Promise<{ items: Testimonial[]; page: number; pageCount: number }> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.testimonials);

  const supabase = createPublicClient();
  if (!supabase) return { items: [], page: 1, pageCount: 1 };
  const safePage = Math.max(1, Math.floor(page) || 1);
  const from = (safePage - 1) * TESTIMONIALS_PER_PAGE;
  const { data, error, count } = await supabase
    .from("testimonials")
    .select(TESTIMONIAL_SELECT, { count: "exact" })
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .range(from, from + TESTIMONIALS_PER_PAGE - 1);
  if (error) {
    logError("testimonials", error);
    return { items: [], page: 1, pageCount: 1 };
  }
  return {
    items: (data ?? []) as Testimonial[],
    page: safePage,
    pageCount: Math.max(1, Math.ceil((count ?? 0) / TESTIMONIALS_PER_PAGE)),
  };
}

export async function getLatestTestimonials(limit = 3): Promise<Testimonial[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.testimonials);

  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("testimonials")
    .select(TESTIMONIAL_SELECT)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    logError("latest-testimonials", error);
    return [];
  }
  return (data ?? []) as Testimonial[];
}

// -------------------------------------------------------------------- faqs

export async function getFaqs(): Promise<Faq[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.faqs);

  const supabase = createPublicClient();
  if (!supabase) return DEFAULT_FAQS;
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) {
    logError("faqs", error);
    return [];
  }
  return (data ?? []) as Faq[];
}
