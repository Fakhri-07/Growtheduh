import { Suspense } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { MobileNav, NavLinks } from "@/components/site/NavClient";
import { NAV_LINKS } from "@/components/site/navigation";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { getSiteSettings } from "@/lib/data/public";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/** Static fallback while the active-link state (pathname) resolves. */
function NavLinksFallback() {
  return (
    <ul className="flex items-center gap-1">
      {NAV_LINKS.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="rounded-full px-3 py-2 text-sm font-medium text-ink/75">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export async function Navbar() {
  const settings = await getSiteSettings();
  const waUrl = buildWhatsAppUrl(settings.whatsapp_number, settings.whatsapp_message);

  return (
    <header className="site-header sticky top-0 z-40 border-b border-line/70 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Lewati ke konten
      </a>
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Logo logoUrl={settings.logo_url} brandName={settings.brand_name} height={60} priority />
        <nav aria-label="Navigasi utama" className="hidden lg:block">
          <Suspense fallback={<NavLinksFallback />}>
            <NavLinks />
          </Suspense>
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <WhatsAppButton href={waUrl} size="sm" />
          </div>
          <Suspense
            fallback={
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white lg:hidden">
                <Menu size={20} aria-hidden />
              </span>
            }
          >
            <MobileNav waUrl={waUrl} />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
