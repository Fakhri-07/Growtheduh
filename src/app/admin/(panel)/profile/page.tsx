import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";
import { adminFeaturedProfile } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Profil Utama" };

// Session-gated admin page: rendered at request time (see admin/layout.tsx).
export const instant = false;

export default async function ProfilePage() {
  const profile = await adminFeaturedProfile();
  return (
    <>
      <AdminHeader
        title="Profil Utama"
        description="Profil profesional yang tampil di hero beranda dan halaman Tentang Kami."
      />
      <TeamMemberForm member={profile} mode="profile" />
    </>
  );
}
