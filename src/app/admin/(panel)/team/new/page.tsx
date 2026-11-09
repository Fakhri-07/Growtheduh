import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";

export const metadata: Metadata = { title: "Anggota Tim Baru" };

// Session-gated admin page: rendered at request time (see admin/layout.tsx).
export const instant = false;

export default function NewTeamMemberPage() {
  return (
    <>
      <AdminHeader title="Tambah Anggota Tim" back={{ href: "/admin/team", label: "Kembali ke tim" }} />
      <TeamMemberForm />
    </>
  );
}
