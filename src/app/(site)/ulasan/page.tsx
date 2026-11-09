import type { Metadata } from "next";
import { Suspense } from "react";
import { MessageSquareQuote } from "lucide-react";
import { TestimonialCard } from "@/components/site/cards";
import { Pagination } from "@/components/site/Pagination";
import { ReviewForm } from "@/components/site/ReviewForm";
import { StarRating } from "@/components/site/StarRating";
import { EmptyState, PageHeader } from "@/components/site/ui";
import { getApprovedTestimonials, getServices, getTestimonialStats } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Ulasan",
  description: "Ulasan dari klien GROWTHEDUH. Setiap ulasan ditinjau sebelum dipublikasikan.",
  alternates: { canonical: "/ulasan" },
};

export default async function ReviewsPage({ searchParams }: PageProps<"/ulasan">) {
  const [stats, services] = await Promise.all([getTestimonialStats(), getServices()]);

  return (
    <>
      <PageHeader
        eyebrow="Ulasan"
        title="Cerita dan pengalaman klien"
        description="Ulasan ditampilkan setelah ditinjau oleh tim GROWTHEDUH. Kami tidak menampilkan informasi pribadi klien."
      />

      <section className="py-12 sm:py-16">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="card p-7 lg:sticky lg:top-24">
              <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">Rating keseluruhan</h2>
              {stats.count > 0 ? (
                <>
                  <div className="mt-3 flex items-end gap-3">
                    <span className="font-display text-5xl text-ink">{stats.average.toFixed(1)}</span>
                    <span className="mb-1.5 text-sm text-muted">/ 5</span>
                  </div>
                  <StarRating value={stats.average} size={20} className="mt-2" />
                  <p className="mt-1 text-sm text-muted">Berdasarkan {stats.count} ulasan</p>
                  <ul className="mt-6 space-y-2">
                    {([5, 4, 3, 2, 1] as const).map((n) => {
                      const c = stats.distribution[n];
                      const pct = stats.count ? Math.round((c / stats.count) * 100) : 0;
                      return (
                        <li key={n} className="flex items-center gap-3 text-sm">
                          <span className="w-3 text-ink/70">{n}</span>
                          <div
                            className="h-2 flex-1 overflow-hidden rounded-full bg-canvas"
                            role="img"
                            aria-label={`${n} bintang: ${c} ulasan`}
                          >
                            <div className="h-full rounded-full bg-bud" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-8 text-right text-muted">{c}</span>
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted">Belum ada ulasan yang dipublikasikan.</p>
              )}
              <a href="#tulis-ulasan" className="btn-primary mt-7 w-full">
                Tulis Ulasan
              </a>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-line/50" aria-busy="true" />}>
              <ReviewList searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </section>

      <section id="tulis-ulasan" className="border-t border-line bg-white py-16 sm:py-20" aria-labelledby="judul-form-ulasan">
        <div data-reveal="" className="container-page max-w-2xl">
          <p className="eyebrow">Bagikan pengalaman</p>
          <h2 id="judul-form-ulasan" className="heading-display mt-3 text-3xl">
            Tulis ulasan
          </h2>
          <p className="mt-3 text-muted">
            Ulasan Anda membantu orang lain mengenal GROWTHEDUH. Semua ulasan akan ditinjau terlebih dahulu sebelum
            ditampilkan.
          </p>
          <div className="mt-8">
            <ReviewForm serviceOptions={services.map((s) => s.title)} />
          </div>
        </div>
      </section>
    </>
  );
}

async function ReviewList({ searchParams }: Pick<PageProps<"/ulasan">, "searchParams">) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.halaman) ? sp.halaman[0] : sp.halaman;
  const page = Number.parseInt(raw ?? "1", 10) || 1;
  const { items, pageCount, page: current } = await getApprovedTestimonials(page);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquareQuote size={22} aria-hidden />}
        title="Belum ada ulasan"
        description="Jadilah yang pertama membagikan pengalaman Anda bersama GROWTHEDUH."
      />
    );
  }

  return (
    <>
      <div data-stagger="" className="grid gap-5 sm:grid-cols-2">
        {items.map((t) => (
          <TestimonialCard key={t.id} testimonial={t} />
        ))}
      </div>
      <Pagination
        page={current}
        pageCount={pageCount}
        hrefFor={(p) => (p > 1 ? `/ulasan?halaman=${p}` : "/ulasan")}
      />
    </>
  );
}
