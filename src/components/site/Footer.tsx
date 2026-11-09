import Link from "next/link";
import { cacheLife } from "next/cache";
import { Mail, MapPin, Clock } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { SmartImage } from "@/components/site/SmartImage";
import { NAV_LINKS } from "@/components/site/navigation";
import { SocialLinks } from "@/components/site/SocialLinks";
import { getServices, getSiteSettings } from "@/lib/data/public";
import { buildWhatsAppUrl, normalizeWhatsAppNumber } from "@/lib/whatsapp";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export async function Footer() {
  const [settings, services] = await Promise.all([getSiteSettings(), getServices()]);
  const waUrl = buildWhatsAppUrl(settings.whatsapp_number, settings.whatsapp_message);
  const waDisplay = normalizeWhatsAppNumber(settings.whatsapp_number);

  return (
    <footer className="mt-auto bg-brand-dark text-white/80">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link
            href="/"
            className="inline-flex rounded-2xl bg-white px-4 py-3"
            aria-label={`${settings.brand_name} — beranda`}
          >
            <SmartImage
              src={settings.logo_url || "/images/logo-growtheduh.png"}
              alt={`Logo ${settings.brand_name}`}
              width={168}
              height={96}
              className="h-16 w-auto"
            />
          </Link>
          {settings.footer_description && (
            <p className="mt-5 max-w-sm text-sm leading-relaxed">{settings.footer_description}</p>
          )}
          <SocialLinks settings={settings} tone="dark" className="mt-6" />
        </div>

        <nav aria-label="Navigasi footer" className="lg:col-span-2">
          <h2 className="text-sm font-semibold tracking-wide text-white">Jelajahi</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="text-sm font-semibold tracking-wide text-white">Layanan</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {services.slice(0, 6).map((s) => (
              <li key={s.id}>
                <Link href={`/layanan/${s.slug}`} className="transition-colors hover:text-white">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="text-sm font-semibold tracking-wide text-white">Kontak</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {waUrl && waDisplay && (
              <li>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 hover:text-white">
                  <WhatsAppIcon size={16} className="mt-0.5 shrink-0" />
                  <span>WhatsApp Admin: +{waDisplay}</span>
                </a>
              </li>
            )}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-start gap-2.5 break-all hover:text-white">
                  <Mail size={16} className="mt-0.5 shrink-0" aria-hidden />
                  {settings.email}
                </a>
              </li>
            )}
            {settings.address && (
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0" aria-hidden />
                <span className="whitespace-pre-line">{settings.address}</span>
              </li>
            )}
            {settings.business_hours && (
              <li className="flex items-start gap-2.5">
                <Clock size={16} className="mt-0.5 shrink-0" aria-hidden />
                <span className="whitespace-pre-line">{settings.business_hours}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page space-y-3 py-6 text-xs text-white/60">
          <p>
            Informasi di website ini bersifat edukatif dan tidak menggantikan konsultasi dengan tenaga profesional.
            Dalam kondisi darurat, hubungi 112 atau layanan kesehatan terdekat.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © <CurrentYear /> {settings.brand_name}. Hak cipta dilindungi.
            </p>
            <ul className="flex gap-5">
              <li>
                <Link href="/kebijakan-privasi" className="hover:text-white">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/syarat-layanan" className="hover:text-white">
                  Syarat Layanan
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
