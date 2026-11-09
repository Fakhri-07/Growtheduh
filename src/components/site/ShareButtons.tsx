"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { LinkedInIcon, WhatsAppIcon } from "@/components/icons/BrandIcons";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title} — ${url}`);

  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodedText}`, Icon: WhatsAppIcon },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      Icon: (p: { size?: number }) => (
        <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07Z" />
        </svg>
      ),
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(title)}`,
      Icon: (p: { size?: number }) => (
        <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      Icon: LinkedInIcon,
    },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Salin tautan artikel:", url);
    }
  }

  const btn =
    "inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-brand-dark transition-colors hover:border-brand hover:bg-brand-soft";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-medium text-muted">Bagikan:</span>
      {links.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Bagikan ke ${label} (tab baru)`}
          className={btn}
        >
          <Icon size={16} />
        </a>
      ))}
      <button type="button" onClick={copy} className={btn} aria-label="Salin tautan artikel">
        {copied ? <Check size={16} aria-hidden /> : <Link2 size={16} aria-hidden />}
      </button>
      <span role="status" aria-live="polite" className="text-xs text-brand">
        {copied ? "Tautan disalin" : ""}
      </span>
    </div>
  );
}
