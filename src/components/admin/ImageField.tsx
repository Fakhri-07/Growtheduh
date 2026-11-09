"use client";

import { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  /** Field prefix: submits `${name}_file`, `${name}_current`, `${name}_remove`. */
  name: string;
  label: string;
  currentUrl?: string | null;
  hint?: string;
  aspect?: "square" | "portrait" | "wide";
  className?: string;
};

const aspects = { square: "aspect-square", portrait: "aspect-[4/5]", wide: "aspect-[16/9]" };

export function ImageField({ name, label, currentUrl, hint, aspect = "wide", className }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [remove, setRemove] = useState(false);
  const id = `img-${name}`;

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const shown = preview ?? (remove ? null : currentUrl);

  return (
    <div className={className}>
      <span className="label">{label}</span>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className={cn(
            "relative w-full max-w-[220px] shrink-0 overflow-hidden rounded-xl border border-line bg-canvas",
            aspects[aspect],
          )}
        >
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element -- local blob/remote preview in admin only
            <img src={shown} alt="Pratinjau gambar" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">
              <ImagePlus size={28} aria-hidden />
            </div>
          )}
        </div>
        <div className="space-y-3 text-sm">
          <input type="hidden" name={`${name}_current`} value={currentUrl ?? ""} />
          <label htmlFor={id} className="btn-outline cursor-pointer">
            <ImagePlus size={16} aria-hidden /> {currentUrl ? "Ganti gambar" : "Unggah gambar"}
          </label>
          <input
            id={id}
            type="file"
            name={`${name}_file`}
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setPreview(file ? URL.createObjectURL(file) : null);
              if (file) setRemove(false);
            }}
          />
          <p className="hint">{hint ?? "JPG, PNG, WebP, atau AVIF. Maksimal 4 MB."}</p>
          {currentUrl && (
            <label className="flex items-center gap-2 text-sm text-ink/80">
              <input
                type="checkbox"
                name={`${name}_remove`}
                checked={remove}
                onChange={(e) => setRemove(e.target.checked)}
                className="h-4 w-4 accent-brand"
              />
              Hapus gambar saat ini
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
