import { Suspense } from "react";
import { Menu } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { MobileNav } from "@/components/site/NavClient";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { getSiteSettings } from "@/lib/data/public";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/** Mobile/tablet header (below lg). Desktop uses <Sidebar /> + <TopBar />. */
export async function Navbar() {
  const settings = await getSiteSettings();
  const waUrl = buildWhatsAppUrl(settings.whatsapp_number, settings.whatsapp_message);

  return (
    <header className="site-header sticky top-0 z-40 border-b border-line/70 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 lg:hidden">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Logo logoUrl={settings.logo_url} brandName={settings.brand_name} height={60} priority />
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <WhatsAppButton href={waUrl} size="sm" />
          </div>
          <Suspense
            fallback={
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white">
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
