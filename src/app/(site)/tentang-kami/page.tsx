import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TeamCard } from "@/components/site/cards";
import { ContactCta } from "@/components/site/ContactSection";
import { SmartImage } from "@/components/site/SmartImage";
import { PageHeader, Placeholder, SectionHeading } from "@/components/site/ui";
import { APPROACH } from "@/lib/content/approach";
import { getFeaturedProfile, getSiteSettings, getTeamMembers } from "@/lib/data/public";
import { lines } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Mengenal GROWTHEDUH: platform pengembangan diri dan layanan psikologis yang membantu individu bertumbuh, memahami diri, dan menemukan solusi bersama.",
  alternates: { canonical: "/tentang-kami" },
};

const isDev = process.env.NODE_ENV !== "production";

export default async function AboutPage() {
  const [settings, profile, team] = await Promise.all([getSiteSettings(), getFeaturedProfile(), getTeamMembers()]);
  const mission = lines(settings.mission);
  const values = lines(settings.values_text);

  return (
    <>
      <PageHeader eyebrow="Tentang Kami" title={`Mengenal ${settings.brand_name}`} description={settings.tagline} />

      <section className="py-16 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading eyebrow="Siapa kami" title="Platform untuk bertumbuh dan memahami diri" />
            {settings.about_intro && (
              <p className="mt-6 text-lg leading-relaxed text-ink/80">{settings.about_intro}</p>
            )}
            {settings.brand_story ? (
              <div className="mt-10">
                <h2 className="font-display text-2xl font-medium text-ink">Cerita Kami</h2>
                <p className="mt-4 leading-relaxed whitespace-pre-line text-ink/80">{settings.brand_story}</p>
              </div>
            ) : (
              isDev && (
                <div className="mt-10">
                  <Placeholder>[Placeholder] Cerita brand belum diisi — lengkapi di Admin › Pengaturan.</Placeholder>
                </div>
              )
            )}
          </div>

          <div data-stagger="" className="space-y-5 lg:col-span-5">
            {settings.vision && (
              <div className="rounded-3xl bg-brand-dark p-8 text-white">
                <p className="text-xs font-semibold tracking-[0.18em] text-sand uppercase">Visi</p>
                <p className="mt-3 font-display text-2xl leading-snug">{settings.vision}</p>
              </div>
            )}
            <div className="rounded-3xl border border-line bg-white p-8">
              <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">Misi</p>
              {mission.length ? (
                <ol className="mt-4 space-y-3">
                  {mission.map((m, i) => (
                    <li key={m} className="flex gap-3 text-ink/85">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand-dark">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{m}</span>
                    </li>
                  ))}
                </ol>
              ) : isDev ? (
                <div className="mt-4">
                  <Placeholder>[Placeholder] Misi belum diisi — lengkapi di Admin › Pengaturan.</Placeholder>
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted">Informasi misi akan segera diperbarui.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {profile && (
        <section className="border-y border-line bg-white py-16 sm:py-24" aria-labelledby="profil">
          <div className="container-page grid items-center gap-12 md:grid-cols-12">
            <div
              data-reveal=""
              className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-t-[999px] rounded-b-[2rem] bg-brand-soft md:col-span-5"
            >
              {profile.portrait_url && (
                <SmartImage
                  src={profile.portrait_url}
                  alt={`Foto ${profile.full_name}`}
                  fill
                  sizes="(min-width: 768px) 40vw, 90vw"
                  className="object-cover object-top"
                />
              )}
            </div>
            <div data-reveal="" className="md:col-span-7" style={{ "--delay": "150ms" } as React.CSSProperties}>
              <p className="eyebrow">Profil Profesional</p>
              <h2 id="profil" className="heading-display mt-3 text-3xl sm:text-4xl">
                {profile.full_name}
              </h2>
              {profile.professional_title && <p className="mt-2 font-medium text-brand">{profile.professional_title}</p>}
              {profile.short_bio || profile.biography ? (
                <p className="mt-5 leading-relaxed whitespace-pre-line text-ink/80">
                  {profile.short_bio || profile.biography}
                </p>
              ) : (
                isDev && (
                  <div className="mt-5">
                    <Placeholder>[Placeholder] Biografi belum diisi — lengkapi di Admin › Profil.</Placeholder>
                  </div>
                )
              )}
              <Link href={`/tim/${profile.slug}`} className="btn-outline mt-8">
                Lihat profil lengkap <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 sm:py-24" aria-labelledby="nilai">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="Nilai & Pendekatan"
            title={<span id="nilai">Cara kami mendampingi</span>}
          />
          {values.length > 0 && (
            <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
              {values.map((v) => (
                <li key={v} className="rounded-full bg-brand-soft px-4 py-2 text-sm font-medium text-brand-dark">
                  {v}
                </li>
              ))}
            </ul>
          )}
          <ul data-stagger="" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {APPROACH.map(({ icon: Icon, title, text }) => (
              <li key={title} className="card p-6 transition duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <Icon size={22} aria-hidden strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {team.length > 1 && (
        <section className="border-t border-line bg-white py-16 sm:py-24" aria-labelledby="anggota-tim">
          <div className="container-page">
            <SectionHeading eyebrow="Tim" title={<span id="anggota-tim">Anggota tim</span>} />
            <div data-stagger="" className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m) => (
                <TeamCard key={m.id} member={m} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 sm:py-24">
        <div className="container-page">
          <ContactCta settings={settings} />
        </div>
      </section>
    </>
  );
}
