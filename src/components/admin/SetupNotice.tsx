import Link from "next/link";
import { Database } from "lucide-react";

/** Shown in the admin area while Supabase environment variables are missing. */
export function SetupNotice() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20">
      <div className="card p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
          <Database size={22} aria-hidden />
        </div>
        <h1 className="heading-display mt-5 text-2xl">Supabase belum dikonfigurasi</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Dasbor admin membutuhkan Supabase (database dan autentikasi). Website publik tetap berjalan menggunakan konten
          awal yang telah disetujui.
        </p>
        <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-ink/80">
          <li>
            Salin <code className="rounded bg-canvas px-1">.env.example</code> menjadi{" "}
            <code className="rounded bg-canvas px-1">.env.local</code>.
          </li>
          <li>
            Isi <code className="rounded bg-canvas px-1">NEXT_PUBLIC_SUPABASE_URL</code> dan{" "}
            <code className="rounded bg-canvas px-1">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>.
          </li>
          <li>Jalankan migrasi SQL dan buat akun admin (lihat README).</li>
          <li>Mulai ulang server pengembangan.</li>
        </ol>
        <Link href="/" className="btn-outline mt-7">
          Kembali ke website
        </Link>
      </div>
    </div>
  );
}
