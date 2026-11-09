import Link from "next/link";
import { ArrowRight, BookOpen, MessageSquareQuote, PenLine, Sprout } from "lucide-react";
import { APPROACH } from "@/lib/content/approach";
import { ArticleCard, ServiceCard, TeamCard, TestimonialCard } from "@/components/site/cards";
import { ContactCta, ContactDetails } from "@/components/site/ContactSection";
import { FaqList } from "@/components/site/FaqList";
import { JsonLd } from "@/components/site/JsonLd";
import { EmergencyNotice } from "@/components/site/Notices";
import { SmartImage } from "@/components/site/SmartImage";
import { StarRating } from "@/components/site/StarRating";
import { ServiceMarquee } from "@/components/site/ServiceMarquee";
import { EmptyState, LeafAccent, SectionHeading } from "@/components/site/ui";
import {
  getFaqs,
  getFeaturedProfile,
  getLatestArticles,
  getLatestTestimonials,
  getServices,
  getSiteSettings,
  getTeamMembers,
  getTestimonialStats,
} from "@/lib/data/public";
import { getSiteUrl } from "@/lib/env";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default async function HomePage() {
  const [settings, profile, services, team, articles, testimonials, stats, faqs] = await Promise.all([
    getSiteSettings(),
    getFeaturedProfile(),
    getServices(),
    getTeamMembers(),
    getLatestArticles(3),
    getLatestTestimonials(3),
    getTestimonialStats(),
    getFaqs(),
  ]);
  const waUrl = buildWhatsAppUrl(settings.whatsapp_number, settings.whatsapp_message);
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: settings.brand_name,
          description: settings.hero_description,
          url: siteUrl,
          logo: `${siteUrl}/images/logo-growtheduh.png`,
          email: settings.email ?? undefined,
          address: settings.address ?? undefined,
          areaServed: "ID",
          sameAs: [settings.instagram_url, settings.tiktok_url, settings.linkedin_url].filter(Boolean),
          ...(stats.count > 0
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: stats.average,
                  reviewCount: stats.count,
                  bestRating: 5,
                  worstRating: 1,
                },
              }
            : {}),
        }}
      />

      {/* ------------------------------------------------------------ Hero */}
      <section className="relative overflow-hidden bg-white">
        <div
          aria-hidden
          className="anim-fade pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] rounded-bl-[120px] bg-brand-soft lg:block"
        />
        <div
          aria-hidden
          className="anim-breathe pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-brand-soft/60 blur-3xl"
        />
        <LeafAccent className="absolute top-16 left-[46%] hidden text-leaf/60 lg:block" size={30} rotate={-20} />
        <LeafAccent className="absolute bottom-20 left-[6%] hidden text-brand/20 md:block" size={44} rotate={30} delay={1500} duration={9000} />
        <LeafAccent className="absolute top-24 right-[4%] hidden text-bud/50 lg:block" size={22} rotate={10} delay={800} />

        <div className="container-page relative grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:gap-8 lg:py-24">
          <div className="lg:col-span-7 lg:pr-8">
            <p className="eyebrow anim-rise">Layanan Psikologi &amp; Pengembangan Diri</p>
            <h1 className="heading-display mt-5 text-4xl leading-[1.1] sm:text-5xl lg:text-[3.6rem]">
              {(settings.hero_headline ?? "").split(/\s+/).map((word, i, all) => (
                <span key={`${word}-${i}`}>
                  <span className="word-rise" style={{ "--i": i } as React.CSSProperties}>
                    {word}
                  </span>
                  {i < all.length - 1 ? " " : ""}
                </span>
              ))}
            </h1>
            {settings.hero_description && (
              <p
                className="anim-rise mt-6 max-w-xl text-lg leading-relaxed text-muted"
                style={{ "--delay": "750ms" } as React.CSSProperties}
              >
                {settings.hero_description}
              </p>
            )}
            <div className="anim-rise mt-9 flex flex-wrap gap-3" style={{ "--delay": "900ms" } as React.CSSProperties}>
              <Link href="/layanan" className="btn-primary group px-6 py-3.5 text-base shadow-lift">
                Kenali Layanan Kami{" "}
                <ArrowRight size={18} aria-hidden className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/kontak" className="btn-outline px-6 py-3.5 text-base">
                Hubungi Kami
              </Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink/70">
              {["Online & offline", "Pendekatan empatik", "Kerahasiaan terjaga"].map((t, i) => (
                <li
                  key={t}
                  className="anim-rise flex items-center gap-2"
                  style={{ "--delay": `${1050 + i * 100}ms` } as React.CSSProperties}
                >
                  <Sprout size={16} className="text-brand" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
            <div className="anim-arch relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2rem] border-8 border-white bg-brand-soft shadow-lift">
              {profile?.portrait_url ? (
                <SmartImage
                  src={profile.portrait_url}
                  alt={`Foto ${profile.full_name}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover object-top"
                />
              ) : null}
            </div>
            {profile && (
              <div className="absolute -bottom-6 left-1/2 z-10 w-[85%] -translate-x-1/2">
                <div
                  className="anim-rise rounded-2xl border border-line bg-white/95 px-5 py-4 text-center shadow-soft backdrop-blur"
                  style={{ "--delay": "1300ms" } as React.CSSProperties}
                >
                  <p className="font-display text-lg font-medium text-ink">{profile.full_name}</p>
                  <p className="text-sm text-brand">{profile.professional_title || settings.brand_name}</p>
                </div>
              </div>
            )}
            <svg
              aria-hidden
              viewBox="0 0 400 120"
              className="anim-draw pointer-events-none absolute -bottom-16 -left-10 w-[115%] text-sand/70"
              fill="none"
            >
              <path
                d="M10 70 C 120 120, 260 120, 390 40"
                pathLength={1}
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- Service ribbon */}
      {services.length > 0 && <ServiceMarquee items={services.map((s) => s.title)} />}

      {/* ----------------------------------------------------------- About */}
      <section className="py-20 sm:py-28" aria-labelledby="tentang">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <div data-reveal="">
            <p className="eyebrow">Tentang GROWTHEDUH</p>
            <h2 id="tentang" className="heading-display mt-3 text-3xl leading-tight sm:text-4xl">
              Ruang yang hangat untuk bertumbuh dan memahami diri.
            </h2>
            {settings.about_intro && (
              <p className="mt-5 text-lg leading-relaxed text-muted">{settings.about_intro}</p>
            )}
            <Link href="/tentang-kami" className="btn-outline mt-8">
              Selengkapnya tentang kami <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <div className="space-y-5" data-stagger="">
            {settings.vision && (
              <figure className="relative overflow-hidden rounded-3xl bg-sand-soft p-8">
                <LeafAccent className="absolute -right-2 -bottom-3 text-sand" size={72} rotate={-30} duration={10000} />
                <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">Visi</p>
                <blockquote className="relative mt-3 font-display text-2xl leading-snug text-ink">
                  “{settings.vision}”
                </blockquote>
              </figure>
            )}
            {profile && (
              <Link
                href={`/tim/${profile.slug}`}
                className="card group flex items-center gap-4 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-brand-soft">
                  {profile.portrait_url && (
                    <SmartImage
                      src={profile.portrait_url}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover object-top"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg font-medium text-ink">{profile.full_name}</p>
                  <p className="text-sm text-muted">
                    {profile.short_bio || profile.professional_title || "Profil profesional GROWTHEDUH"}
                  </p>
                </div>
                <ArrowRight size={18} className="shrink-0 text-brand transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Services */}
      <section className="border-y border-line bg-white py-20 sm:py-28" aria-labelledby="layanan">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Layanan"
              title={<span id="layanan">Layanan yang kami sediakan</span>}
              description="Pilih layanan yang sesuai dengan kebutuhan Anda. Admin kami siap membantu menjelaskan detail setiap layanan."
            />
            <Link href="/layanan" className="btn-ghost shrink-0">
              Semua layanan <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          {services.length ? (
            <div data-stagger="" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          ) : (
            <EmptyState className="mt-12" title="Informasi layanan segera hadir" />
          )}
        </div>
      </section>

      {/* ------------------------------------------------------ Why choose */}
      <section className="py-20 sm:py-28" aria-labelledby="mengapa">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="Mengapa GROWTHEDUH"
            title={<span id="mengapa">Bertumbuh dengan pendampingan yang tepat</span>}
          />
          <ul data-stagger="" className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {APPROACH.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="card group p-6 transition duration-300 hover:-translate-y-1.5 hover:border-brand/25 hover:shadow-lift"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand transition duration-300 group-hover:scale-110 group-hover:bg-brand group-hover:text-white">
                  <Icon size={22} aria-hidden strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------ Team */}
      {team.length > 0 && (
        <section className="border-y border-line bg-white py-20 sm:py-28" aria-labelledby="tim">
          <div className="container-page">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading eyebrow="Tim Profesional" title={<span id="tim">Kenali tim kami</span>} />
              <Link href="/tim" className="btn-ghost shrink-0">
                Lihat semua <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
            <div data-stagger="" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.slice(0, 3).map((m) => (
                <TeamCard key={m.id} member={m} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------ Blog */}
      <section className="py-20 sm:py-28" aria-labelledby="artikel">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Artikel"
              title={<span id="artikel">Bacaan untuk bertumbuh</span>}
              description="Artikel edukatif seputar kesehatan mental, tumbuh kembang anak, keluarga, dan pengembangan diri."
            />
            <Link href="/artikel" className="btn-ghost shrink-0">
              Semua artikel <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          {articles.length ? (
            <div data-stagger="" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          ) : (
            <EmptyState
              className="mt-12"
              icon={<BookOpen size={22} aria-hidden />}
              title="Artikel edukatif segera hadir"
              description="Tim GROWTHEDUH sedang menyiapkan artikel yang bermanfaat untuk Anda."
            />
          )}
        </div>
      </section>

      {/* ---------------------------------------------------- Testimonials */}
      <section className="border-y border-line bg-white py-20 sm:py-28" aria-labelledby="ulasan">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Ulasan" title={<span id="ulasan">Cerita dari mereka</span>} />
            {stats.count > 0 && (
              <div className="flex items-center gap-3">
                <span className="font-display text-4xl text-ink">{stats.average.toFixed(1)}</span>
                <div>
                  <StarRating value={stats.average} />
                  <p className="text-xs text-muted">dari {stats.count} ulasan</p>
                </div>
              </div>
            )}
          </div>
          {testimonials.length ? (
            <div data-stagger="" className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          ) : (
            <EmptyState
              className="mt-12"
              icon={<MessageSquareQuote size={22} aria-hidden />}
              title="Belum ada ulasan yang dipublikasikan"
              description="Ulasan ditampilkan setelah ditinjau oleh tim GROWTHEDUH."
            />
          )}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/ulasan#tulis-ulasan" className="btn-primary">
              <PenLine size={16} aria-hidden /> Tulis Ulasan
            </Link>
            {testimonials.length > 0 && (
              <Link href="/ulasan" className="btn-outline">
                Lihat semua ulasan
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- FAQ */}
      {faqs.length > 0 && (
        <section className="py-20 sm:py-28" aria-labelledby="faq">
          <div className="container-page grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading
                eyebrow="FAQ"
                title={<span id="faq">Pertanyaan yang sering diajukan</span>}
                description="Belum menemukan jawaban? Hubungi admin kami melalui WhatsApp."
              />
            </div>
            <div className="lg:col-span-8">
              <FaqList faqs={faqs} />
            </div>
          </div>
        </section>
      )}

      {/* --------------------------------------------------------- Contact */}
      <section className="pb-20 sm:pb-28" aria-labelledby="kontak">
        <div className="container-page space-y-10">
          <ContactCta settings={settings} />
          <div>
            <h2 id="kontak" className="sr-only">
              Kontak
            </h2>
            <ContactDetails settings={settings} />
          </div>
          <EmergencyNotice text={settings.emergency_info} />
          {!waUrl && process.env.NODE_ENV !== "production" && (
            <p className="text-center text-xs text-danger">
              [Dev] Nomor WhatsApp belum dikonfigurasi atau tidak valid.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
