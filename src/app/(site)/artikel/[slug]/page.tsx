import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Clock } from "lucide-react";
import { ArticleCard } from "@/components/site/cards";
import { JsonLd } from "@/components/site/JsonLd";
import { Markdown } from "@/components/site/Markdown";
import { EducationalDisclaimer } from "@/components/site/Notices";
import { ShareButtons } from "@/components/site/ShareButtons";
import { SmartImage } from "@/components/site/SmartImage";
import { PageSkeleton } from "@/components/site/ui";
import { getArticleBySlug, getRelatedArticles, getSiteSettings, getTeamMembers } from "@/lib/data/public";
import { getSiteUrl } from "@/lib/env";
import { formatDate, plainText, readingMinutes, truncate } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/artikel/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Artikel tidak ditemukan", robots: { index: false } };
  const description =
    article.seo_description || article.excerpt || truncate(plainText(article.content), 160);
  const title = article.seo_title || article.title;
  return {
    title,
    description,
    alternates: { canonical: `/artikel/${article.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: article.published_at ?? undefined,
      modifiedTime: article.updated_at,
      section: article.categories[0]?.name,
      images: article.featured_image_url
        ? [{ url: article.featured_image_url, alt: article.featured_image_alt || article.title }]
        : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function ArticlePage({ params }: PageProps<"/artikel/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ArticleView params={params} />
    </Suspense>
  );
}

async function ArticleView({ params }: Pick<PageProps<"/artikel/[slug]">, "params">) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [related, team, settings] = await Promise.all([
    getRelatedArticles(article.id, article.categories.map((c) => c.id)),
    getTeamMembers(),
    getSiteSettings(),
  ]);
  const author = team.find((m) => m.id === article.author_id);
  const authorName = author?.full_name || article.author_name || `Tim ${settings.brand_name}`;
  const url = `${getSiteUrl()}/artikel/${article.slug}`;
  const minutes = readingMinutes(article.content);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt ?? undefined,
          image: article.featured_image_url ?? undefined,
          datePublished: article.published_at ?? undefined,
          dateModified: article.updated_at,
          author: { "@type": author ? "Person" : "Organization", name: authorName },
          publisher: {
            "@type": "Organization",
            name: settings.brand_name,
            logo: { "@type": "ImageObject", url: `${getSiteUrl()}/images/logo-growtheduh.png` },
          },
          mainEntityOfPage: url,
          articleSection: article.categories.map((c) => c.name),
        }}
      />

      <div className="reading-progress" aria-hidden />
      <article>
        <header className="border-b border-line bg-white">
          <div className="container-page anim-rise max-w-3xl py-12 sm:py-16">
            <Link href="/artikel" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-dark">
              <ArrowLeft size={16} aria-hidden /> Kembali ke artikel
            </Link>
            {article.categories.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2">
                {article.categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/artikel?kategori=${c.slug}`}
                      className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-dark hover:bg-brand hover:text-white"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <h1 className="heading-display mt-5 text-3xl leading-tight sm:text-5xl">{article.title}</h1>
            {article.excerpt && <p className="mt-5 text-lg leading-relaxed text-muted">{article.excerpt}</p>}
            <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              <span>
                Oleh <span className="font-medium text-ink">{authorName}</span>
              </span>
              <time dateTime={article.published_at ?? undefined}>{formatDate(article.published_at)}</time>
              <span className="inline-flex items-center gap-1">
                <Clock size={14} aria-hidden /> {minutes} menit baca
              </span>
            </p>
          </div>
        </header>

        {article.featured_image_url && (
          <div className="container-page max-w-4xl pt-10">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-brand-soft">
              <SmartImage
                src={article.featured_image_url}
                alt={article.featured_image_alt || article.title}
                fill
                priority
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className="container-page max-w-3xl py-12">
          <Markdown content={article.content} />
          <div className="mt-12 space-y-6 border-t border-line pt-8">
            <ShareButtons url={url} title={article.title} />
            <EducationalDisclaimer />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-line bg-white py-16" aria-labelledby="artikel-terkait">
          <div className="container-page">
            <h2 id="artikel-terkait" className="heading-display text-2xl sm:text-3xl">
              Artikel terkait
            </h2>
            <div data-stagger="" className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
