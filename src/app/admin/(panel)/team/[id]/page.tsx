import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Trash } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ActionButton } from "@/components/admin/ConfirmButton";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";
import { deleteTeamMember } from "@/lib/admin/actions";
import { adminTeamMember } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Ubah Anggota Tim" };

// Session-gated admin page: rendered at request time (see admin/layout.tsx).
export const instant = false;

export default async function EditTeamMemberPage({ params }: PageProps<"/admin/team/[id]">) {
  const { id } = await params;
  const member = await adminTeamMember(id);
  if (!member) notFound();

  return (
    <>
      <AdminHeader
        title={member.full_name}
        back={{ href: "/admin/team", label: "Kembali ke tim" }}
        actions={
          <>
            <Link href={`/tim/${member.slug}`} target="_blank" className="btn-outline">
              <ExternalLink size={16} aria-hidden /> Lihat
            </Link>
            <ActionButton
              action={deleteTeamMember.bind(null, member.id)}
              confirm={`Hapus profil ${member.full_name}? Tindakan ini tidak dapat dibatalkan.`}
              className="btn-danger"
            >
              <Trash size={16} aria-hidden /> Hapus
            </ActionButton>
          </>
        }
      />
      <TeamMemberForm member={member} />
    </>
  );
}
