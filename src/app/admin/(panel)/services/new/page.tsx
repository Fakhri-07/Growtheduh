import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ServiceForm } from "@/components/admin/ServiceForm";

export const metadata: Metadata = { title: "Layanan Baru" };

// Session-gated admin page: rendered at request time (see admin/layout.tsx).
export const instant = false;

export default function NewServicePage() {
  return (
    <>
      <AdminHeader title="Tambah Layanan" back={{ href: "/admin/services", label: "Kembali ke layanan" }} />
      <ServiceForm />
    </>
  );
}
