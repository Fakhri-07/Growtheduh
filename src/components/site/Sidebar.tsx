import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { Logo } from "@/components/site/Logo";
import { SidebarNav, SidebarNavList } from "@/components/site/SidebarNav";
import { SocialLinks } from "@/components/site/SocialLinks";
import { getSiteSettings } from "@/lib/data/public";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/** Desktop (lg+) sidebar: brand, icon navigation, consultation card, socials. */
export async function Sidebar() {
  const settings = await getSiteSettings();
  const waUrl = buildWhatsAppUrl(settings.whatsapp_number, settings.whatsapp_message);

  return (
    <aside className="sticky top-4 hidden h-[calc(100dvh-2rem)] w-72 shrink-0 flex-col overflow-hidden rounded-[2rem] border border-line bg-white shadow-soft lg:flex">
      <ContourPattern />
      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 pt-7 pb-6 [scrollbar-width:thin] [@media(max-height:820px)]:pt-5 [@media(max-height:820px)]:pb-4">
        <div className="shrink-0 px-2">
          <Logo logoUrl={settings.logo_url} brandName={settings.brand_name} height={64} priority className="[@media(max-height:820px)]:[&_img]:!h-12" />
          <p className="mt-2 text-xs font-medium tracking-wide text-muted [@media(max-height:820px)]:hidden">Psikologi &amp; Pengembangan Diri</p>
        </div>

        <nav aria-label="Navigasi utama" className="mt-8 shrink-0 [@media(max-height:820px)]:mt-5">
          <Suspense fallback={<SidebarNavList pathname={null} />}>
            <SidebarNav />
          </Suspense>
        </nav>

        <div className="relative mt-8 shrink-0 overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-brand to-brand-dark p-5 text-white shadow-lift [@media(max-height:820px)]:mt-5 [@media(max-height:820px)]:p-4">
          <div aria-hidden className="anim-breathe absolute -top-10 -right-10 h-28 w-28 rounded-full bg-leaf/30 blur-2xl" />
          <p className="relative font-display text-lg leading-snug">Siap untuk bertumbuh?</p>
          <p className="relative mt-1.5 text-sm leading-relaxed text-white/75 [@media(max-height:700px)]:hidden">
            Ceritakan kebutuhan Anda, admin kami siap membantu.
          </p>
          {waUrl ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mt-4 flex items-center justify-between rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-dark transition hover:bg-brand-soft"
            >
              <span className="flex items-center gap-2">
                <WhatsAppIcon size={16} /> Konsultasi
              </span>
              <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-1" />
            </a>
          ) : (
            <p className="relative mt-4 text-xs text-white/70">Nomor WhatsApp belum dikonfigurasi.</p>
          )}
        </div>

        <div className="mt-auto shrink-0 pt-8 [@media(max-height:820px)]:pt-5">
          <p className="px-2 text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">Ikuti Kami</p>
          <SocialLinks settings={settings} className="mt-3 px-1" />
        </div>
      </div>
    </aside>
  );
}

/** Subtle topographic contour lines (decorative), echoing growth rings. */
function ContourPattern() {
  const rings = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 300"
      className="anim-breathe pointer-events-none absolute -right-24 -bottom-24 h-[360px] w-[360px] text-brand/[0.09]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      {rings.map((i) => (
        <path
          key={i}
          d={`M ${150 - 20 - i * 16} 150
              C ${150 - 20 - i * 16} ${95 - i * 12}, ${205 + i * 10} ${80 - i * 16}, ${212 + i * 14} ${140 - i * 4}
              S ${180 + i * 6} ${225 + i * 14}, ${140 - i * 4} ${212 + i * 12}
              S ${150 - 20 - i * 16} ${190 + i * 4}, ${150 - 20 - i * 16} 150 Z`}
        />
      ))}
    </svg>
  );
}
