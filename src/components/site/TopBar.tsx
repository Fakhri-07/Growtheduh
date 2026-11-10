import { Mail } from "lucide-react";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { getSiteSettings } from "@/lib/data/public";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/** Desktop top bar inside the main panel (mobile uses <Navbar />). */
export async function TopBar() {
  const settings = await getSiteSettings();
  const waUrl = buildWhatsAppUrl(settings.whatsapp_number, settings.whatsapp_message);
  return (
    <div className="site-header sticky top-0 z-30 hidden items-center justify-between gap-6 border-b border-line/70 bg-white/85 px-8 py-4 backdrop-blur lg:flex">
      <p className="truncate text-sm text-muted">
        <span className="font-semibold text-brand-dark">{settings.brand_name}</span>
        {settings.tagline && <span className="hidden xl:inline"> · {settings.tagline}</span>}
      </p>
      <div className="flex shrink-0 items-center gap-3">
        {settings.email && (
          <a
            href={`mailto:${settings.email}`}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm text-ink/70 transition hover:bg-canvas hover:text-ink xl:inline-flex"
          >
            <Mail size={16} aria-hidden /> {settings.email}
          </a>
        )}
        <WhatsAppButton href={waUrl} size="sm" label="Konsultasi via WhatsApp" className="shadow-soft" />
      </div>
    </div>
  );
}
