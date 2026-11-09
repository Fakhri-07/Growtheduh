import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { Footer } from "@/components/site/Footer";
import { MotionObserver } from "@/components/site/MotionObserver";
import { Navbar } from "@/components/site/Navbar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main id="konten" className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
      <MotionObserver />
    </div>
  );
}
