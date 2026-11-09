import { Clock, Mail, MapPin } from "lucide-react";
import { InstagramIcon, LinkedInIcon, TikTokIcon, WhatsAppIcon } from "@/components/icons/BrandIcons";
import { socialItems } from "@/components/site/SocialLinks";
import { LeafAccent } from "@/components/site/ui";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import type { SiteSettings } from "@/lib/types";
import { buildWhatsAppUrl, normalizeWhatsAppNumber } from "@/lib/whatsapp";

const SOCIAL_ICON = { Instagram: InstagramIcon, TikTok: TikTokIcon, LinkedIn: LinkedInIcon } as const;

export function ContactDetails({ settings }: { settings: SiteSettings }) {
  const waUrl = buildWhatsAppUrl(settings.whatsapp_number, settings.whatsapp_message);
  const waNumber = normalizeWhatsAppNumber(settings.whatsapp_number);
  const socials = socialItems(settings);

  const rows: { icon: React.ReactNode; label: string; value: React.ReactNode }[] = [];
  if (waUrl && waNumber) {
    rows.push({
      icon: <WhatsAppIcon size={18} />,
      label: "WhatsApp Admin",
      value: (
        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
          +{waNumber}
        </a>
      ),
    });
  }
  if (settings.email) {
    rows.push({
      icon: <Mail size={18} aria-hidden />,
      label: "Email",
      value: (
        <a href={`mailto:${settings.email}`} className="break-all hover:text-brand">
          {settings.email}
        </a>
      ),
    });
  }
  for (const s of socials) {
    const Icon = SOCIAL_ICON[s.label as keyof typeof SOCIAL_ICON];
    rows.push({
      icon: <Icon size={18} />,
      label: s.label,
      value: (
        <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
          {s.handle}
        </a>
      ),
    });
  }
  rows.push({
    icon: <MapPin size={18} aria-hidden />,
    label: "Lokasi",
    value: settings.address ? (
      settings.maps_url ? (
        <a href={settings.maps_url} target="_blank" rel="noopener noreferrer" className="whitespace-pre-line hover:text-brand">
          {settings.address}
        </a>
      ) : (
        <span className="whitespace-pre-line">{settings.address}</span>
      )
    ) : (
      <span className="text-muted">Informasi lokasi dapat ditanyakan melalui WhatsApp.</span>
    ),
  });
  if (settings.business_hours) {
    rows.push({
      icon: <Clock size={18} aria-hidden />,
      label: "Jam Layanan",
      value: <span className="whitespace-pre-line">{settings.business_hours}</span>,
    });
  }

  return (
    <dl data-stagger="" className="grid gap-4 sm:grid-cols-2">
      {rows.map((row) => (
        <div
          key={row.label}
          className="group flex gap-3.5 rounded-2xl border border-line bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-soft"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand transition duration-300 group-hover:bg-brand group-hover:text-white">
            {row.icon}
          </div>
          <div className="min-w-0">
            <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{row.label}</dt>
            <dd className="mt-0.5 text-[15px] font-medium text-ink">{row.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

export function ContactCta({ settings }: { settings: SiteSettings }) {
  const waUrl = buildWhatsAppUrl(settings.whatsapp_number, settings.whatsapp_message);
  return (
    <div
      data-reveal=""
      className="relative overflow-hidden rounded-3xl bg-brand-dark px-6 py-12 text-white sm:px-12 sm:py-16"
    >
      <svg
        aria-hidden
        viewBox="0 0 600 200"
        className="anim-breathe pointer-events-none absolute -right-20 -bottom-10 w-[520px] text-white/[0.06]"
        fill="currentColor"
      >
        <path d="M0 150 C 150 60, 330 210, 600 90 L 600 200 L 0 200 Z" />
      </svg>
      <LeafAccent className="absolute top-8 right-[14%] hidden text-leaf/40 sm:block" size={40} rotate={-24} />
      <LeafAccent className="absolute right-[30%] bottom-10 hidden text-white/15 md:block" size={24} rotate={18} delay={2000} />
      <div className="relative max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.18em] text-sand uppercase">Mulai langkah pertama</p>
        <h2 className="mt-3 font-display text-3xl leading-tight font-medium sm:text-4xl">
          Siap bercerita dan bertumbuh bersama?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-white/75">
          Hubungi admin GROWTHEDUH untuk menanyakan layanan yang sesuai dengan kebutuhan Anda. Kami akan membantu
          menjelaskan langkah selanjutnya.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <WhatsAppButton href={waUrl} variant="light" size="lg" />
        </div>
      </div>
    </div>
  );
}
