"use client";

import { startTransition, useActionState, useState } from "react";
import { CircleCheck, LoaderCircle, ShieldAlert, Star } from "lucide-react";
import { submitTestimonial } from "@/app/(site)/ulasan/actions";
import { cn } from "@/lib/utils";

const LABELS = ["", "Kurang", "Cukup", "Baik", "Sangat baik", "Luar biasa"];

export function ReviewForm({ serviceOptions }: { serviceOptions: string[] }) {
  const [state, action, pending] = useActionState(submitTestimonial, null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [length, setLength] = useState(0);

  if (state?.ok) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-brand/20 bg-brand-soft px-6 py-12 text-center" role="status">
        <CircleCheck size={40} className="text-brand" aria-hidden />
        <p className="mt-4 font-display text-xl text-ink">Ulasan terkirim</p>
        <p className="mt-2 max-w-md text-sm text-ink/75">{state.message}</p>
      </div>
    );
  }

  const shown = hover || rating;

  return (
    <form
      // onSubmit (not `action`) so React does not reset the fields when the
      // server returns a validation error.
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => action(formData));
      }}
      className="space-y-6"
      noValidate
    >
      <div className="flex gap-3 rounded-xl border border-[#f3d9b1] bg-[#fff8ec] p-4 text-sm leading-relaxed text-ink/80">
        <ShieldAlert size={18} className="mt-0.5 shrink-0 text-bud" aria-hidden />
        <p>
          Demi privasi Anda, mohon <strong>tidak menuliskan</strong> nama lengkap, nomor telepon, diagnosis, atau detail
          kondisi pribadi. Gunakan nama samaran bila perlu. Ulasan akan ditinjau sebelum dipublikasikan.
        </p>
      </div>

      <div>
        <label htmlFor="display_name" className="label">
          Nama tampilan atau nama samaran <span className="text-danger">*</span>
        </label>
        <input
          id="display_name"
          name="display_name"
          required
          minLength={2}
          maxLength={60}
          autoComplete="nickname"
          placeholder="contoh: Ibu R."
          className="input"
        />
      </div>

      <fieldset>
        <legend className="label">
          Rating <span className="text-danger">*</span>
        </legend>
        <div className="flex items-center gap-3">
          <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className="cursor-pointer" onMouseEnter={() => setHover(n)}>
                <input
                  type="radio"
                  name="rating"
                  value={n}
                  required
                  checked={rating === n}
                  onChange={() => setRating(n)}
                  className="peer sr-only"
                />
                <span className="sr-only">{`${n} bintang`}</span>
                <Star
                  size={30}
                  aria-hidden
                  strokeWidth={1.5}
                  className={cn(
                    "rounded transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand",
                    n <= shown ? "fill-bud text-bud" : "fill-transparent text-line",
                  )}
                />
              </label>
            ))}
          </div>
          <span className="text-sm text-muted" aria-live="polite">
            {shown ? LABELS[shown] : "Pilih rating"}
          </span>
        </div>
      </fieldset>

      <div>
        <label htmlFor="content" className="label">
          Ulasan <span className="text-danger">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          required
          minLength={10}
          maxLength={1500}
          rows={5}
          onChange={(e) => setLength(e.target.value.length)}
          placeholder="Ceritakan pengalaman Anda secara umum…"
          className="input resize-y"
        />
        <p className="hint text-right">{length}/1500</p>
      </div>

      <div>
        <label htmlFor="service_category" className="label">
          Layanan yang digunakan <span className="font-normal text-muted">(opsional)</span>
        </label>
        <select id="service_category" name="service_category" className="input" defaultValue="">
          <option value="">Tidak ingin menyebutkan</option>
          {serviceOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Honeypot (hidden from people and assistive tech) */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="space-y-3">
        <label className="flex items-start gap-3 text-sm text-ink/80">
          <input type="checkbox" name="claims_client" className="mt-0.5 h-4 w-4 rounded accent-brand" />
          <span>
            Saya pernah menggunakan layanan GROWTHEDUH.{" "}
            <span className="text-muted">
              (Label “klien terverifikasi” hanya diberikan oleh admin setelah verifikasi.)
            </span>
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm text-ink/80">
          <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 rounded accent-brand" />
          <span>
            Saya menyetujui ulasan ini ditampilkan secara publik di website GROWTHEDUH setelah ditinjau, sesuai{" "}
            <a href="/kebijakan-privasi" className="font-medium text-brand underline underline-offset-2">
              Kebijakan Privasi
            </a>
            . <span className="text-danger">*</span>
          </span>
        </label>
      </div>

      {state && !state.ok && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-danger">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full py-3 sm:w-auto">
        {pending && <LoaderCircle size={16} className="animate-spin" aria-hidden />}
        {pending ? "Mengirim…" : "Kirim Ulasan"}
      </button>
    </form>
  );
}
