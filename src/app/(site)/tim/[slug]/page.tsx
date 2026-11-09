import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Award, Briefcase, ExternalLink, GraduationCap, Sparkles, UserRound } from "lucide-react";
import { LinkedInIcon } from "@/components/icons/BrandIcons";
import { JsonLd } from "@/components/site/JsonLd";
import { SmartImage } from "@/components/site/SmartImage";
import { PageSkeleton, Placeholder } from "@/components/site/ui";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { getSiteSettings, getTeamMemberBySlug } from "@/lib/data/public";
import { getSiteUrl } from "@/lib/env";
import { lines } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export async function generateMetadata({ params }: PageProps<"/tim/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);
  if (!member) return { title: "Profil tidak ditemukan", robots: { index: false } };
  const description =
    member.short_bio || `Profil ${member.full_name}${member.professional_title ? `, ${member.professional_title}` : ""} di GROWTHEDUH.`;
  return {
    title: member.full_name,
    description,
    alternates: { canonical: `/tim/${member.slug}` },
    openGraph: {
      title: member.full_name,
      description,
      type: "profile",
      images: member.portrait_url ? [{ url: member.portrait_url }] : undefined,
    },
  };
}

export default function TeamMemberPage({ params }: PageProps<"/tim/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <TeamMemberProfile params={params} />
    </Suspense>
  );
}

async function TeamMemberProfile({ params }: Pick<PageProps<"/tim/[slug]">, "params">) {
  const { slug } = await params;
  const [member, settings] = await Promise.all([getTeamMemberBySlug(slug), getSiteSettings()]);
  if (!member) notFound();

  const waUrl = buildWhatsAppUrl(
    settings.whatsapp_number,
    `Halo GROWTHEDUH, saya ingin bertanya mengenai layanan bersama ${member.full_name}. Boleh saya mendapatkan informasi lebih lanjut?`,
  );

  const sections = [
    { title: "Pendidikan", icon: GraduationCap, items: lines(member.education) },
    { title: "Pengalaman", icon: Briefcase, items: lines(member.experience) },
    { title: "Bidang Keahlian", icon: Sparkles, items: lines(member.specializations) },
    { title: "Kualifikasi Profesional", icon: Award, items: lines(member.qualifications) },
  ].filter((s) => s.items.length > 0);

  const hasDetails = Boolean(member.biography || member.short_bio || sections.length);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: member.full_name,
          jobTitle: member.professional_title ?? undefined,
          url: `${getSiteUrl()}/tim/${member.slug}`,
          worksFor: { "@type": "Organization", name: settings.brand_name },
          sameAs: [member.linkedin_url, member.profile_url].filter(Boolean),
        }}
      />
      <section className="border-b border-line bg-white">
        <div className="container-page py-12 sm:py-16">
          <Link href="/tim" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-dark">
            <ArrowLeft size={16} aria-hidden /> Tim profesional
          </Link>
          <div className="mt-8 grid items-center gap-10 md:grid-cols-12">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-t-[999px] rounded-b-[2rem] bg-brand-soft md:col-span-4 md:max-w-none">
              {member.portrait_url ? (
                <SmartImage
                  src={member.portrait_url}
                  alt={`Foto ${member.full_name}`}
                  fill
                  priority
                  sizes="(min-width: 768px) 33vw, 80vw"
                  className="object-cover object-top"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-brand/40">
                  <UserRound size={80} aria-hidden />
                </div>
              )}
            </div>
            <div className="md:col-span-8">
              <p className="eyebrow">Profil Profesional</p>
              <h1 className="heading-display mt-3 text-4xl sm:text-5xl">{member.full_name}</h1>
              {member.professional_title && <p className="mt-3 text-lg font-medium text-brand">{member.professional_title}</p>}
              {member.short_bio && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{member.short_bio}</p>}
              <div className="mt-8 flex flex-wrap gap-3">
                <WhatsAppButton href={waUrl} label="Hubungi via WhatsApp" />
                {member.linkedin_url && (
                  <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="btn-outline">
                    <LinkedInIcon size={16} /> LinkedIn
                  </a>
                )}
                {member.profile_url && (
                  <a href={member.profile_url} target="_blank" rel="noopener noreferrer" className="btn-outline">
                    <ExternalLink size={16} aria-hidden /> Profil lainnya
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container-page max-w-4xl space-y-10">
          {member.biography && (
            <div>
              <h2 className="heading-display text-2xl">Biografi</h2>
              <p className="mt-4 text-[17px] leading-relaxed whitespace-pre-line text-ink/85">{member.biography}</p>
            </div>
          )}
          {sections.length > 0 && (
            <div data-stagger="" className="grid gap-5 sm:grid-cols-2">
              {sections.map(({ title, icon: Icon, items }) => (
                <div key={title} className="card p-6">
                  <h2 className="flex items-center gap-2 font-semibold text-ink">
                    <Icon size={18} className="text-brand" aria-hidden /> {title}
                  </h2>
                  <ul className="mt-4 space-y-2 text-[15px] text-ink/80">
                    {items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sand" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {!hasDetails &&
            (process.env.NODE_ENV !== "production" ? (
              <Placeholder>
                [Placeholder] Biografi, pendidikan, pengalaman, dan kualifikasi belum diisi. Lengkapi melalui Admin ›
                Profil / Tim. Data tidak dikarang secara otomatis.
              </Placeholder>
            ) : (
              <p className="text-muted">Informasi profil lengkap akan segera diperbarui.</p>
            ))}
        </div>
      </section>
    </>
  );
}
