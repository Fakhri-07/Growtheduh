import { Suspense } from "react";
import { AdminMobileBar, AdminSidebar } from "@/components/admin/AdminNav";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { createSessionClient } from "@/lib/supabase/server";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<ShellSkeleton />}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}

/** Server-side authorization boundary for every /admin page (besides login). */
async function AdminGate({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) return <SetupNotice />;
  const admin = await requireAdmin();

  const supabase = await createSessionClient();
  const { count } = await supabase
    .from("testimonials")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  return (
    <div className="lg:flex">
      <AdminSidebar email={admin.email} pendingCount={count ?? 0} />
      <AdminMobileBar email={admin.email} pendingCount={count ?? 0} />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}

function ShellSkeleton() {
  return (
    <div className="flex min-h-dvh animate-pulse" aria-busy="true" aria-label="Memuat dasbor">
      <div className="hidden w-64 border-r border-line bg-white lg:block" />
      <div className="flex-1 p-8">
        <div className="h-8 w-48 rounded bg-line" />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="h-28 rounded-2xl bg-line/60" />
          <div className="h-28 rounded-2xl bg-line/60" />
          <div className="h-28 rounded-2xl bg-line/60" />
        </div>
      </div>
    </div>
  );
}
