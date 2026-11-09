import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { getSiteSettings } from "@/lib/data/public";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export async function FloatingWhatsApp() {
  const settings = await getSiteSettings();
  const href = buildWhatsAppUrl(settings.whatsapp_number, settings.whatsapp_message);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Konsultasi via WhatsApp (membuka WhatsApp di tab baru)"
      className="wa-pulse anim-rise group fixed right-4 bottom-4 isolate z-30 inline-flex items-center gap-2 rounded-full bg-[#1f8f4e] p-3.5 text-white shadow-lift transition duration-200 hover:-translate-y-0.5 hover:bg-[#187a42] sm:right-6 sm:bottom-6 sm:px-5"
      style={{ "--delay": "1200ms" } as React.CSSProperties}
    >
      <WhatsAppIcon size={24} />
      <span className="hidden text-sm font-semibold sm:inline">Chat Admin</span>
    </a>
  );
}
