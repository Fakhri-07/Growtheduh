import { Info, LifeBuoy } from "lucide-react";

export function EmergencyNotice({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <aside
      data-reveal=""
      aria-labelledby="info-darurat"
      className="flex gap-4 rounded-2xl border border-[#f3d9b1] bg-[#fff8ec] p-5 sm:p-6"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-bud">
        <LifeBuoy size={20} aria-hidden />
      </div>
      <div>
        <h2 id="info-darurat" className="text-sm font-semibold text-ink">
          Informasi Darurat
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-ink/75">{text}</p>
      </div>
    </aside>
  );
}

export function EducationalDisclaimer() {
  return (
    <aside className="flex gap-3 rounded-2xl border border-line bg-canvas p-5 text-sm leading-relaxed text-muted">
      <Info size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden />
      <p>
        Konten ini bersifat edukatif dan tidak menggantikan konsultasi, diagnosis, maupun penanganan oleh tenaga
        profesional. Jika Anda membutuhkan bantuan, silakan berkonsultasi secara langsung.
      </p>
    </aside>
  );
}
