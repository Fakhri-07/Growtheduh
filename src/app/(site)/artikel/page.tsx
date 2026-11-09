import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { Suspense } from "react";
import { BookOpen, Clock, Search } from "lucide-react";
import { ArticleCard, ArticleImageFallback } from "@/components/site/cards";
import { Pagination } from "@/components/site/Pagination";
import { SmartImage } from "@/components/site/SmartImage";
import { EmptyState, PageHeader } from "@/components/site/ui";
import { getArticles, getCategories, getFeaturedArticle } from "@/lib/data/public";
import type { Article } from "@/lib/types";
import { cn, formatDate, readingMinutes } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Artikel",
  description:
    "Artikel edukatif GROWTHEDUH seputar kesehatan mental, tumbuh kembang anak, parenting, pengembangan diri, hubungan dan keluarga, serta pendidikan dan karir.",
  alternates: { canonical: "/artikel" },
};

export default function ArticlesPage({ searchParams }: PageProps<"/artikel">) {
  return (
    <>
      <PageHeader
        eyebrow="Artikel"
        title="Bacaan untuk bertumbuh"
        description="Artikel edukatif yang disusun dan ditinjau oleh tim GROWTHEDUH. Konten bersifat edukatif dan tidak menggantikan konsultasi profesional."
      />
      <Suspense fallback={<ListingSkeleton />}>
        <ArticleListing searchParams={searchParams} />
      </Suspense>
    </>
  );
}

function param(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

async function ArticleListing({ searchParams }: Pick<PageProps<"/artikel">, "searchParams">) {
  const sp = await searchParams;
  const q = param(sp.q).slice(0, 80);
  const kategori = param(sp.kategori);
  const page = Number.parseInt(param(sp.halaman) || "1", 10) || 1;

  const [list, categories, featured] = await Promise.all([
    getArticles({ q, category: kategori, page }),
    getCategories(),
    getFeaturedArticle(),
  ]);
  const activeCategory = categories.find((c) => c.slug === kategori);
  const isFiltered = Boolean(q || kategori);
  const showFeatured = featured && !isFiltered && page === 1;
  const articles = showFeatured ? list.articles.filter((a) => a.id !== featured.id) : list.articles;

  const hrefFor = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (kategori) params.set("kategori", kategori);
    if (p > 1) params.set("halaman", String(p));
    const s = params.toString();
    return s ? `/artikel?${s}` : "/artikel";
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="container-page">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Kategori artikel" className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
            <ul className="flex w-max gap-2 lg:w-auto lg:flex-wrap">
              <li>
                <CategoryChip href={q ? `/artikel?q=${encodeURIComponent(q)}` : "/artikel"} active={!kategori}>
                  Semua
                </CategoryChip>
              </li>
              {categories.map((c) => {
                const params = new URLSearchParams({ kategori: c.slug });
                if (q) params.set("q", q);
                return (
                  <li key={c.id}>
                    <CategoryChip href={`/artikel?${params}`} active={kategori === c.slug}>
                      {c.name}
                    </CategoryChip>
                  </li>
                );
              })}
            </ul>
          </nav>
          <Form action="/artikel" role="search" className="relative w-full lg:w-80">
            {kategori && <input type="hidden" name="kategori" value={kategori} />}
            <label htmlFor="cari-artikel" className="sr-only">
              Cari artikel
            </label>
            <Search size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" aria-hidden />
            <input
              id="cari-artikel"
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Cari artikel…"
              maxLength={80}
              className="input rounded-full pl-10"
            />
          </Form>
        </div>

        {isFiltered && (
          <p className="mt-8 text-sm text-muted" role="status">
            {list.total} artikel ditemukan
            {q && (
              <>
                {" "}
                untuk “<span className="font-medium text-ink">{q}</span>”
              </>
            )}
            {activeCategory && (
              <>
                {" "}
                dalam kategori <span className="font-medium text-ink">{activeCategory.name}</span>
              </>
            )}
            .{" "}
            <Link href="/artikel" className="font-medium text-brand underline-offset-4 hover:underline">
              Reset filter
            </Link>
          </p>
        )}

        {showFeatured && <FeaturedArticle article={featured} />}

        {articles.length > 0 ? (
          <div data-stagger="" className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a, i) => (
              <ArticleCard key={a.id} article={a} priority={i < 3 && !showFeatured} />
            ))}
          </div>
        ) : (
          !showFeatured && (
            <EmptyState
              className="mt-10"
              icon={<BookOpen size={22} aria-hidden />}
              title={isFiltered ? "Artikel tidak ditemukan" : "Artikel edukatif segera hadir"}
              description={
                isFiltered
                  ? "Coba kata kunci lain atau pilih kategori yang berbeda."
                  : "Tim GROWTHEDUH sedang menyiapkan artikel yang bermanfaat untuk Anda."
              }
            />
          )
        )}

        <Pagination page={list.page} pageCount={list.pageCount} hrefFor={hrefFor} />
      </div>
    </section>
  );
}

function CategoryChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
        active ? "bg-brand text-white" : "border border-line bg-white text-ink/75 hover:border-brand hover:text-brand-dark",
      )}
    >
      {children}
    </Link>
  );
}

function FeaturedArticle({ article }: { article: Article }) {
  return (
    <article
      data-reveal=""
      className="group relative mt-10 grid overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition duration-300 hover:shadow-lift md:grid-cols-2"
    >
      <div className="relative aspect-[16/10] bg-brand-soft md:aspect-auto md:min-h-80">
        {article.featured_image_url ? (
          <SmartImage
            src={article.featured_image_url}
            alt={article.featured_image_alt || article.title}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <ArticleImageFallback />
        )}
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-10">
        <p className="eyebrow">Artikel Pilihan</p>
        <h2 className="heading-display mt-4 text-2xl leading-snug sm:text-3xl">
          <Link href={`/artikel/${article.slug}`} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h2>
        {article.excerpt && <p className="mt-4 leading-relaxed text-muted">{article.excerpt}</p>}
        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          {article.categories[0] && <span className="font-medium text-brand">{article.categories[0].name}</span>}
          <time dateTime={article.published_at ?? undefined}>{formatDate(article.published_at)}</time>
          <span className="inline-flex items-center gap-1">
            <Clock size={14} aria-hidden /> {readingMinutes(article.content)} menit baca
          </span>
        </p>
      </div>
    </article>
  );
}

function ListingSkeleton() {
  return (
    <div className="container-page animate-pulse py-16" aria-busy="true" aria-label="Memuat artikel">
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 w-28 rounded-full bg-line" />
        ))}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-80 rounded-2xl bg-line/60" />
        ))}
      </div>
    </div>
  );
}
