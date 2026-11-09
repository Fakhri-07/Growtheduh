import type { Metadata } from "next";
import { Users } from "lucide-react";
import { TeamCard } from "@/components/site/cards";
import { ContactCta } from "@/components/site/ContactSection";
import { EmptyState, PageHeader } from "@/components/site/ui";
import { getSiteSettings, getTeamMembers } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Tim Profesional",
  description: "Kenali tim profesional GROWTHEDUH yang mendampingi Anda untuk bertumbuh dan memahami diri.",
  alternates: { canonical: "/tim" },
};

export default async function TeamPage() {
  const [team, settings] = await Promise.all([getTeamMembers(), getSiteSettings()]);
  return (
    <>
      <PageHeader
        eyebrow="Tim Profesional"
        title="Tim di balik GROWTHEDUH"
        description="Profil tim yang mendampingi Anda dengan pendekatan profesional, hangat, dan empatik."
      />
      <section className="py-16 sm:py-20">
        <div className="container-page">
          {team.length ? (
            <div data-stagger="" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m) => (
                <TeamCard key={m.id} member={m} />
              ))}
            </div>
          ) : (
            <EmptyState icon={<Users size={22} aria-hidden />} title="Profil tim segera hadir" />
          )}
        </div>
      </section>
      <section className="pb-20">
        <div className="container-page">
          <ContactCta settings={settings} />
        </div>
      </section>
    </>
  );
}
