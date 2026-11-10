import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleQuestionMark } from "lucide-react";
import { ContactDetails } from "@/components/site/ContactSection";
import { ContactPanel } from "@/components/site/ContactPanel";
import { FaqList } from "@/components/site/FaqList";
import { EmergencyNotice } from "@/components/site/Notices";
import { PageHeader } from "@/components/site/ui";
import { getFaqs, getSiteSettings } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi GROWTHEDUH melalui WhatsApp, email, Instagram, TikTok, atau LinkedIn untuk informasi layanan psikologi dan konsultasi.",
  alternates: { canonical: "/kontak" },
};

export default async function ContactPage() {
  const [settings, faqs] = await Promise.all([getSiteSettings(), getFaqs()]);
  return (
    <>
      <PageHeader
        eyebrow="Kontak"
        title="Hubungi GROWTHEDUH"
        description="Cara tercepat untuk bertanya mengenai layanan adalah melalui WhatsApp admin. Kami akan membantu Anda menemukan layanan yang sesuai."
      />
      <section className="py-12 sm:py-16">
        <div className="container-page space-y-10">
          <ContactPanel settings={settings} />
          <ContactDetails settings={settings} />
          <EmergencyNotice text={settings.emergency_info} />
        </div>
      </section>

      {faqs.length > 0 && (
        <section id="faq" className="border-t border-line bg-white py-16 sm:py-20" aria-labelledby="judul-faq">
          <div className="container-page grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow">FAQ</p>
              <h2 id="judul-faq" className="heading-display mt-3 text-3xl">
                Pertanyaan umum
              </h2>
              <p className="mt-3 flex items-start gap-2 text-muted">
                <CircleQuestionMark size={18} className="mt-1 shrink-0 text-brand" aria-hidden />
                Jawaban singkat atas pertanyaan yang sering kami terima.
              </p>
              <Link href="/layanan" className="btn-ghost mt-6 -ml-3">
                Lihat layanan <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
            <div className="lg:col-span-8">
              <FaqList faqs={faqs} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
