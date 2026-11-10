import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { Footer } from "@/components/site/Footer";
import { MotionObserver } from "@/components/site/MotionObserver";
import { Navbar } from "@/components/site/Navbar";
import { Sidebar } from "@/components/site/Sidebar";
import { TopBar } from "@/components/site/TopBar";

/**
 * Desktop: floating sidebar + rounded main panel (dashboard-style layout).
 * Mobile/tablet: sticky top navbar with a slide-down menu.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh lg:flex lg:items-start lg:gap-4 lg:p-4">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Lewati ke konten
      </a>
      <Sidebar />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col bg-canvas lg:min-h-[calc(100dvh-2rem)] lg:overflow-clip lg:rounded-[2rem] lg:border lg:border-line lg:shadow-soft">
        <Navbar />
        <TopBar />
        <main id="konten" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
      <FloatingWhatsApp />
      <MotionObserver />
    </div>
  );
}
