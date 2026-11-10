import Link from "next/link";
import { ArrowRight, BookOpen, MessageSquareQuote, PenLine } from "lucide-react";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { ArticleCard, ServiceCard, TeamCard, TestimonialCard } from "@/components/site/cards";
import { APPROACH } from "@/lib/content/approach";
import { Carousel } from "@/components/site/Carousel";
import { ContactPanel } from "@/components/site/ContactPanel";
import { FaqList } from "@/components/site/FaqList";
import { HighlightsBand, type Highlight } from "@/components/site/HighlightsBand";
import { JsonLd } from "@/components/site/JsonLd";
import { EmergencyNotice } from "@/components/site/Notices";
import { ServiceMarquee } from "@/components/site/ServiceMarquee";
import { SmartImage } from "@/components/site/SmartImage";
import { StarRating } from "@/components/site/StarRating";
import { EmptyState, LeafAccent } from "@/components/site/ui";
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

/** Who the services are for (from the GROWTHEDUH booklet) — shown instead of client logos. */
const AUDIENCES = ["Anak & ABK", "Remaja", "Dewasa", "Pasangan & Keluarga", "Sekolah & Organisasi"];

/** Splits a name like "Tri Wisda, S.Psi., M.Psi." into name and credentials. */
function splitName(fullName: string) {
  const [name, ...rest] = fullName.split(",");
  return { name: name.trim(), credentials: rest.join(",").trim() };
}

function css(vars: Record<string, string | number>) {
  return vars as React.CSSProperties;
}

export default async function HomePage() {
  const [settings, profile, services, articles, testimonials, stats, faqs, team] = await Promise.all([
    getSiteSettings(),
    getFeaturedProfile(),
    getServices(),
    getLatestArticles(4),
    getLatestTestimonials(6),
    getTestimonialStats(),
    getFaqs(),
    getTeamMembers(),
  ]);
  const siteUrl = getSiteUrl();
  const person = profile ? splitName(profile.full_name) : null;
  const [firstName, ...lastNames] = (person?.name ?? settings.brand_name).split(" ");

  const highlights: Highlight[] = [
    { icon: "services", value: `${services.length}`, label: "Layanan Psikologi" },
    { icon: "format", value: "Online & Offline", label: "Format Sesi Fleksibel" },
    { icon: "ages", value: "Anak – Dewasa", label: "Pendampingan Lintas Usia" },
    stats.count > 0
      ? { icon: "rating", value: `${stats.average.toFixed(1)} / 5`, label: `Dari ${stats.count} ulasan klien` }
      : { icon: "privacy", value: "Konfidensial", label: "Privasi Klien Terjaga" },
  ];

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

      {/* ================================================================ HERO */}
      <section className="relative overflow-hidden bg-white">
        <div aria-hidden className="anim-breathe pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-brand-soft/70 blur-3xl" />
        <LeafAccent className="absolute top-14 left-[44%] hidden text-leaf/60 lg:block" size={28} rotate={-20} />
        <LeafAccent className="absolute bottom-16 left-[4%] hidden text-brand/15 md:block" size={44} rotate={30} delay={1500} duration={9000} />

        <div className="container-page relative grid items-center gap-14 py-14 sm:py-16 lg:grid-cols-12 lg:gap-6 lg:py-20">
          <div className="lg:col-span-7">
            <p className="anim-rise text-xs font-semibold tracking-[0.22em] text-brand uppercase">
              Halo, selamat datang di {settings.brand_name}
            </p>

            {person && (
              <p className="mt-4 font-display text-5xl leading-[1.05] font-medium tracking-tight text-ink sm:text-6xl xl:text-7xl">
                {[firstName, ...lastNames].map((word, i) => (
                  <span key={`${word}-${i}`}>
                    <span
                      className={`word-rise ${i > 0 ? "bg-gradient-to-r from-brand to-leaf bg-clip-text text-transparent" : ""}`}
                      style={css({ "--i": i })}
                    >
                      {word}
                    </span>{" "}
                  </span>
                ))}
                {person.credentials && (
                  <span className="anim-rise mt-2 block font-sans text-base font-medium tracking-normal text-muted sm:text-lg" style={css({ "--delay": "350ms" })}>
                    {person.credentials}
                  </span>
                )}
              </p>
            )}

            <h1
              className="anim-rise mt-6 max-w-xl font-display text-2xl leading-snug text-ink/90 sm:text-3xl"
              style={css({ "--delay": "500ms" })}
            >
              {settings.hero_headline}
            </h1>
            {settings.hero_description && (
              <p className="anim-rise mt-5 max-w-xl leading-relaxed text-muted" style={css({ "--delay": "650ms" })}>
                {settings.hero_description}
              </p>
            )}

            <div className="anim-rise mt-8 flex flex-wrap items-center gap-4" style={css({ "--delay": "800ms" })}>
              <Link href="/layanan" className="btn-primary group bg-gradient-to-r from-brand to-brand-dark px-6 py-3.5 text-base shadow-lift">
                Kenali Layanan Kami
                <ArrowRight size={18} aria-hidden className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/kontak" className="group inline-flex items-center gap-3 text-sm font-semibold text-ink">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white text-brand shadow-soft transition group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                  <SiteIcon name="contact" size={18} />
                </span>
                Hubungi Kami
              </Link>
            </div>

            <div className="anim-rise mt-10" style={css({ "--delay": "950ms" })}>
              <p className="text-xs font-medium text-muted">Pendampingan untuk</p>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {AUDIENCES.map((a) => (
                  <li key={a} className="flex items-center gap-1.5 text-sm font-semibold text-ink/55">
                    <SiteIcon name="check" size={16} className="text-brand/70" /> {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Portrait with glow, orbit and floating cards */}
          <div className="relative mx-auto w-full max-w-[22rem] lg:col-span-5 lg:max-w-none">
            <div aria-hidden className="anim-fade absolute top-1/2 left-1/2 aspect-square w-[115%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--brand-soft)_0%,rgb(234_244_236/0.5)_45%,transparent_70%)]" />
            <svg aria-hidden viewBox="0 0 200 200" className="orbit pointer-events-none absolute top-1/2 left-1/2 w-[108%] -translate-x-1/2 -translate-y-1/2 text-brand/25">
              <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 5" />
              <circle cx="100" cy="4" r="2.6" className="fill-leaf" />
              <circle cx="196" cy="100" r="2" className="fill-bud" />
            </svg>

            <div className="anim-arch relative mx-auto aspect-[4/5] w-[86%] overflow-hidden rounded-t-[999px] rounded-b-[2.5rem] border-[6px] border-white bg-brand-soft shadow-lift">
              {profile?.portrait_url && (
                <SmartImage
                  src={profile.portrait_url}
                  alt={`Foto ${profile.full_name}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 34vw, 80vw"
                  className="object-cover object-top"
                />
              )}
            </div>

            <div className="absolute -bottom-4 -left-2 sm:left-0">
              <div className="anim-rise" style={css({ "--delay": "1300ms" })}>
                <div className="anim-float rounded-2xl border border-line bg-white/95 px-4 py-3 shadow-lift backdrop-blur" style={css({ "--dur": "8s" })}>
                  <p className="font-display text-sm font-medium text-ink">{profile?.full_name ?? settings.brand_name}</p>
                  <p className="text-xs text-brand">{profile?.professional_title || settings.brand_name}</p>
                </div>
              </div>
            </div>
            <div className="absolute top-[18%] -right-1 sm:right-0">
              <div className="anim-rise" style={css({ "--delay": "1450ms" })}>
                <div className="anim-float rounded-2xl bg-gradient-to-br from-brand to-brand-dark px-5 py-4 text-center text-white shadow-lift" style={css({ "--dur": "9s", "--delay": "600ms" })}>
                  <p className="font-display text-3xl leading-none">{services.length}</p>
                  <p className="mt-1 text-[11px] leading-tight text-white/80">
                    Layanan
                    <br />
                    Psikologi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {services.length > 0 && <ServiceMarquee items={services.map((s) => s.title)} />}

      {/* ============================================================ SERVICES */}
      <section className="py-16 sm:py-24" aria-labelledby="layanan">
        <div className="container-page">
          <SectionTitle eyebrow="Apa yang kami lakukan" id="layanan" title="Layanan Kami" href="/layanan" linkLabel="Semua layanan" />
          {services.length ? (
            <div data-stagger="" className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          ) : (
            <EmptyState className="mt-10" title="Informasi layanan segera hadir" />
          )}
        </div>
      </section>

      {/* ===================================================== ABOUT / WHY US */}
      <section className="pb-16 sm:pb-24" aria-labelledby="tentang">
        <div className="container-page grid gap-6 lg:grid-cols-12">
          <div data-reveal="" className="card relative overflow-hidden p-8 lg:col-span-5">
            <LeafAccent className="absolute -right-3 -bottom-4 text-brand-soft" size={110} rotate={-30} duration={11000} />
            <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">Tentang {settings.brand_name}</p>
            <h2 id="tentang" className="heading-display mt-2 text-3xl">
              Ruang yang hangat untuk bertumbuh.
            </h2>
            {settings.about_intro && <p className="relative mt-4 leading-relaxed text-muted">{settings.about_intro}</p>}
            {settings.vision && (
              <blockquote className="relative mt-6 border-l-2 border-sand pl-4 font-display text-lg leading-snug text-ink">
                “{settings.vision}”
              </blockquote>
            )}
            <Link href="/tentang-kami" className="btn-outline relative mt-7">
              Selengkapnya <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <div className="lg:col-span-7">
            <p data-reveal="" className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">
              Mengapa {settings.brand_name}
            </p>
            <ul data-stagger="" className="mt-4 grid gap-4 sm:grid-cols-2">
              {APPROACH.map(({ icon: Icon, title, text }, i) => (
                <li
                  key={title}
                  className={`card group flex gap-4 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lift ${i === APPROACH.length - 1 && APPROACH.length % 2 === 1 ? "sm:col-span-2" : ""}`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-leaf to-brand text-white transition duration-300 group-hover:scale-110">
                    <Icon size={20} aria-hidden strokeWidth={1.75} />
                  </span>
                  <span>
                    <span className="block font-semibold text-ink">{title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================================================================ TEAM */}
      {team.length > 1 && (
        <section className="pb-16 sm:pb-24" aria-labelledby="tim">
          <div className="container-page">
            <SectionTitle eyebrow="Tim profesional" id="tim" title="Kenali Tim Kami" href="/tim" linkLabel="Lihat semua" />
            <div data-stagger="" className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {team.slice(0, 3).map((m) => (
                <TeamCard key={m.id} member={m} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ ARTICLES */}
      <section className="pb-16 sm:pb-24" aria-labelledby="artikel">
        <div className="container-page">
          <SectionTitle eyebrow="Bacaan untuk bertumbuh" id="artikel" title="Artikel Terbaru" href="/artikel" linkLabel="Semua artikel" />
          {articles.length ? (
            <div data-stagger="" className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          ) : (
            <EmptyState
              className="mt-10"
              icon={<BookOpen size={22} aria-hidden />}
              title="Artikel edukatif segera hadir"
              description="Tim GROWTHEDUH sedang menyiapkan artikel yang bermanfaat untuk Anda."
            />
          )}
        </div>
      </section>

      {/* ========================================================== HIGHLIGHTS */}
      <section className="pb-16 sm:pb-24">
        <div className="container-page">
          <HighlightsBand items={highlights} />
        </div>
      </section>

      {/* ======================================================== TESTIMONIALS */}
      <section className="pb-16 sm:pb-24" aria-labelledby="ulasan">
        <div className="container-page">
          <div data-reveal="" className="text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">Ulasan</p>
            <h2 id="ulasan" className="heading-display mt-2 text-3xl sm:text-4xl">
              Apa Kata Mereka
            </h2>
            {stats.count > 0 && (
              <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted">
                <StarRating value={stats.average} /> {stats.average.toFixed(1)} dari {stats.count} ulasan
              </p>
            )}
          </div>
          <div className="mt-10">
            {testimonials.length ? (
              <Carousel label="Ulasan klien">
                {testimonials.map((t) => (
                  <TestimonialCard key={t.id} testimonial={t} />
                ))}
              </Carousel>
            ) : (
              <EmptyState
                icon={<MessageSquareQuote size={22} aria-hidden />}
                title="Belum ada ulasan yang dipublikasikan"
                description="Ulasan ditampilkan setelah ditinjau oleh tim GROWTHEDUH."
              />
            )}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
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

      {/* ================================================================= FAQ */}
      {faqs.length > 0 && (
        <section className="pb-16 sm:pb-24" aria-labelledby="faq">
          <div className="container-page grid gap-10 lg:grid-cols-12">
            <div data-reveal="" className="lg:col-span-4">
              <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">FAQ</p>
              <h2 id="faq" className="heading-display mt-2 text-3xl">
                Pertanyaan yang sering diajukan
              </h2>
              <p className="mt-3 text-muted">Belum menemukan jawaban? Kirim pesan kepada kami di bawah ini.</p>
            </div>
            <div className="lg:col-span-8">
              <FaqList faqs={faqs} />
            </div>
          </div>
        </section>
      )}

      {/* ============================================================= CONTACT */}
      <section className="pb-16 sm:pb-24" aria-labelledby="kontak">
        <div className="container-page space-y-8">
          <ContactPanel settings={settings} services={services.map((s) => s.title)} />
          <EmergencyNotice text={settings.emergency_info} />
        </div>
      </section>
    </>
  );
}

function SectionTitle({
  eyebrow,
  title,
  id,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  id: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div data-reveal="" className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">{eyebrow}</p>
        <h2 id={id} className="heading-display mt-2 text-3xl sm:text-4xl">
          {title}
        </h2>
      </div>
      <Link
        href={href}
        className="group inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink shadow-soft transition hover:border-brand hover:text-brand"
      >
        {linkLabel} <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
