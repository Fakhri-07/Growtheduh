import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Trash } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ActionButton } from "@/components/admin/ConfirmButton";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { deleteService } from "@/lib/admin/actions";
import { adminService } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Ubah Layanan" };

// Session-gated admin page: rendered at request time (see admin/layout.tsx).
export const instant = false;

export default async function EditServicePage({ params }: PageProps<"/admin/services/[id]">) {
  const { id } = await params;
  const service = await adminService(id);
  if (!service) notFound();

  return (
    <>
      <AdminHeader
        title={service.title}
        back={{ href: "/admin/services", label: "Kembali ke layanan" }}
        actions={
          <>
            <Link href={`/layanan/${service.slug}`} target="_blank" className="btn-outline">
              <ExternalLink size={16} aria-hidden /> Lihat
            </Link>
            <ActionButton
              action={deleteService.bind(null, service.id)}
              confirm={`Hapus layanan "${service.title}"? Tindakan ini tidak dapat dibatalkan.`}
              className="btn-danger"
            >
              <Trash size={16} aria-hidden /> Hapus
            </ActionButton>
          </>
        }
      />
      <ServiceForm service={service} />
    </>
  );
}
