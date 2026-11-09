import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { SmartImage } from "@/components/site/SmartImage";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Masuk" };

// Session-gated admin page: rendered at request time (see admin/layout.tsx).
export const instant = false;

export default function AdminLoginPage() {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <SmartImage src="/images/logo-growtheduh.png" alt="Logo GROWTHEDUH" width={168} height={96} priority />
        </div>
        <div className="card mt-6 p-7">
          <h1 className="heading-display text-2xl">Masuk Admin</h1>
          <p className="mt-1 text-sm text-muted">Khusus akun admin GROWTHEDUH yang berwenang.</p>
          <LoginForm />
        </div>
        <Link href="/" className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand">
          <ArrowLeft size={14} aria-hidden /> Kembali ke website
        </Link>
      </div>
    </div>
  );
}
