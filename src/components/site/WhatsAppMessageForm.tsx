"use client";

import { useState } from "react";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Contact form that composes a WhatsApp message and opens it. Nothing is sent
 * to or stored by the website — the visitor reviews and sends it in WhatsApp.
 */
export function WhatsAppMessageForm({
  whatsappNumber,
  brandName,
  services,
}: {
  whatsappNumber: string | null;
  brandName: string;
  services: string[];
}) {
  const [error, setError] = useState<string | null>(null);
  const enabled = buildWhatsAppUrl(whatsappNumber) !== null;

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const name = String(data.get("nama") ?? "").trim();
        const service = String(data.get("layanan") ?? "").trim();
        const message = String(data.get("pesan") ?? "").trim();
        if (!name || !message) {
          setError("Mohon isi nama dan pesan Anda.");
          return;
        }
        setError(null);
        const text = [
          `Halo ${brandName}, saya ${name}.`,
          service ? `Saya ingin bertanya mengenai layanan ${service}.` : "",
          message,
        ]
          .filter(Boolean)
          .join("\n");
        const url = buildWhatsAppUrl(whatsappNumber, text);
        if (url) window.open(url, "_blank", "noopener,noreferrer");
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-nama" className="sr-only">
            Nama Anda
          </label>
          <input id="cf-nama" name="nama" maxLength={60} placeholder="Nama Anda" autoComplete="name" className="input" />
        </div>
        <div>
          <label htmlFor="cf-layanan" className="sr-only">
            Layanan
          </label>
          <select id="cf-layanan" name="layanan" defaultValue="" className="input text-ink/80">
            <option value="">Layanan (opsional)</option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="cf-pesan" className="sr-only">
          Pesan
        </label>
        <textarea
          id="cf-pesan"
          name="pesan"
          rows={4}
          maxLength={800}
          placeholder="Tulis pertanyaan Anda secara singkat…"
          className="input resize-none"
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted">Pesan dibuka di WhatsApp dan tidak disimpan di website.</p>
        <button type="submit" disabled={!enabled} className="btn-primary group">
          Kirim via WhatsApp
          <SiteIcon name="send" size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </form>
  );
}
