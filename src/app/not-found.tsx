import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SmartImage } from "@/components/site/SmartImage";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-4 text-center">
      <SmartImage src="/images/leaf-mark.png" alt="" width={72} height={72} />
      <p className="mt-6 text-sm font-semibold tracking-[0.18em] text-brand uppercase">404</p>
      <h1 className="heading-display mt-3 text-3xl sm:text-4xl">Halaman tidak ditemukan</h1>
      <p className="mt-3 max-w-md text-muted">
        Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          <ArrowLeft size={16} aria-hidden /> Kembali ke beranda
        </Link>
        <Link href="/artikel" className="btn-outline">
          Baca artikel
        </Link>
      </div>
    </div>
  );
}
