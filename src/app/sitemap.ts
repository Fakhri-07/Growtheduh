import type { MetadataRoute } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { getAllArticleSlugs, getServices, getTeamMembers, TAGS } from "@/lib/data/public";
import { getSiteUrl } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.articles, TAGS.services, TAGS.team);

  const base = getSiteUrl();
  const [articles, services, team] = await Promise.all([getAllArticleSlugs(), getServices(), getTeamMembers()]);

  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/tentang-kami", priority: 0.8 },
    { path: "/layanan", priority: 0.9 },
    { path: "/tim", priority: 0.7 },
    { path: "/artikel", priority: 0.8 },
    { path: "/ulasan", priority: 0.6 },
    { path: "/kontak", priority: 0.7 },
    { path: "/kebijakan-privasi", priority: 0.2 },
    { path: "/syarat-layanan", priority: 0.2 },
  ];

  return [
    ...staticRoutes.map((r) => ({ url: `${base}${r.path}`, priority: r.priority })),
    ...services.map((s) => ({ url: `${base}/layanan/${s.slug}`, priority: 0.7 })),
    ...team.map((m) => ({ url: `${base}/tim/${m.slug}`, priority: 0.6 })),
    ...articles.map((a) => ({ url: `${base}/artikel/${a.slug}`, lastModified: a.updated_at, priority: 0.6 })),
  ];
}
