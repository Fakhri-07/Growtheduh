import { SiteIcon } from "@/components/icons/SiteIcon";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons/BrandIcons";
import { socialItems } from "@/components/site/SocialLinks";
import { LeafAccent } from "@/components/site/ui";
import { WhatsAppMessageForm } from "@/components/site/WhatsAppMessageForm";
import type { SiteSettings } from "@/lib/types";
import { buildWhatsAppUrl, normalizeWhatsAppNumber } from "@/lib/whatsapp";

/** Three-part contact block: invitation panel · WhatsApp message form · contact details. */
export function ContactPanel({ settings, services }: { settings: SiteSettings; services: string[] }) {
  const waNumber = normalizeWhatsAppNumber(settings.whatsapp_number);
  const waUrl = buildWhatsAppUrl(settings.whatsapp_number, settings.whatsapp_message);
  const instagram = socialItems(settings).find((s) => s.label === "Instagram");

  const details = [
    waUrl && waNumber
      ? { icon: <WhatsAppIcon size={18} />, label: "WhatsApp", value: `+${waNumber}`, href: waUrl }
      : null,
    settings.email
      ? { icon: <SiteIcon name="contact" size={18} />, label: "Email", value: settings.email, href: `mailto:${settings.email}` }
      : null,
    instagram ? { icon: <InstagramIcon size={18} />, label: "Instagram", value: instagram.handle, href: instagram.href } : null,
    {
      icon: <SiteIcon name="location" size={18} />,
      label: "Lokasi",
      value: settings.address || "Online & offline — tanyakan via WhatsApp",
      href: settings.maps_url || null,
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href: string | null }[];

  return (
    <div data-reveal="" className="grid overflow-hidden rounded-3xl border border-line bg-white shadow-soft lg:grid-cols-12">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-dark p-8 text-white lg:col-span-4">
        <LeafAccent className="absolute top-6 right-6 text-leaf/40" size={36} rotate={-20} />
        <div aria-hidden className="anim-breathe absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-leaf/25 blur-3xl" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
          <SiteIcon name="send" size={24} />
        </div>
        <h2 id="kontak" className="relative mt-8 font-display text-3xl leading-tight">
          Mari Bertumbuh Bersama!
        </h2>
        <p className="relative mt-3 text-sm leading-relaxed text-white/75">
          Punya pertanyaan tentang layanan kami? Kirim pesan singkat, admin kami akan membantu Anda.
        </p>
      </div>

      <div className="p-6 sm:p-8 lg:col-span-5">
        <WhatsAppMessageForm whatsappNumber={settings.whatsapp_number} brandName={settings.brand_name} services={services} />
      </div>

      <ul className="space-y-5 border-t border-line p-6 sm:p-8 lg:col-span-3 lg:border-t-0 lg:border-l">
        {details.map((d) => (
          <li key={d.label} className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">{d.icon}</span>
            <span className="min-w-0">
              <span className="block text-xs font-medium text-muted">{d.label}</span>
              {d.href ? (
                <a
                  href={d.href}
                  {...(d.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="block text-sm font-medium break-words text-ink hover:text-brand"
                >
                  {d.value}
                </a>
              ) : (
                <span className="block text-sm font-medium break-words text-ink">{d.value}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
