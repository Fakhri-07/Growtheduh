import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { ContactCta } from "@/components/site/ContactSection";
import { ServiceDetails } from "@/components/site/ServiceDetails";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { SmartImage } from "@/components/site/SmartImage";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { EmptyState, PageHeader } from "@/components/site/ui";
import { getServices, getSiteSettings } from "@/lib/data/public";
import { buildWhatsAppUrl, serviceWhatsAppMessage } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Layanan",
  description:
    "Layanan GROWTHEDUH: konseling profesional, konseling pernikahan dan keluarga, pendampingan anak berkebutuhan khusus, asesmen psikologi, konseling online dan offline, serta layanan HRD.",
  alternates: { canonical: "/layanan" },
};

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(), getSiteSettings()]);

  return (
    <>
      <PageHeader
        eyebrow="Layanan"
        title="Layanan GROWTHEDUH"
        description="Pendampingan psikologis untuk anak, remaja, dewasa, pasangan, keluarga, hingga organisasi. Hubungi admin untuk mendapatkan informasi yang sesuai dengan kebutuhan Anda."
      >
        {services.length > 0 && (
          <nav aria-label="Daftar layanan">
            <ul className="flex flex-wrap gap-2">
              {services.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.slug}`}
                    className="inline-flex rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink/80 transition-colors hover:border-brand hover:text-brand-dark"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </PageHeader>

      <section className="py-16 sm:py-20">
        <div className="container-page space-y-6">
          {services.length === 0 && <EmptyState title="Informasi layanan segera hadir" />}
          {services.map((service, i) => {
            const waUrl = buildWhatsAppUrl(
              settings.whatsapp_number,
              service.whatsapp_message || serviceWhatsAppMessage(service.title),
            );
            return (
              <article
                key={service.id}
                id={service.slug}
                data-reveal=""
                className="card grid gap-8 p-6 transition duration-300 hover:border-brand/25 hover:shadow-lift sm:p-10 lg:grid-cols-12"
                aria-labelledby={`judul-${service.slug}`}
              >
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                      <ServiceIcon name={service.icon} />
                    </div>
                    <span className="font-display text-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h2 id={`judul-${service.slug}`} className="heading-display mt-5 text-2xl sm:text-3xl">
                    {service.title}
                  </h2>
                  <p className="mt-3 leading-relaxed text-muted">{service.summary}</p>
                  {service.image_url && (
                    <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-2xl bg-brand-soft">
                      <SmartImage
                        src={service.image_url}
                        alt={`Ilustrasi ${service.title}`}
                        fill
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col lg:col-span-7">
                  {service.description && (
                    <p className="leading-relaxed whitespace-pre-line text-ink/85">{service.description}</p>
                  )}
                  <div className="mt-6">
                    <ServiceDetails service={service} />
                  </div>
                  <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
                    <WhatsAppButton href={waUrl} label="Tanya layanan ini" />
                    <Link href={`/layanan/${service.slug}`} className="btn-ghost">
                      Halaman detail <ArrowRight size={16} aria-hidden />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}

          <p className="flex items-start gap-2 rounded-2xl bg-white px-5 py-4 text-sm text-muted">
            <Info size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden />
            Informasi biaya, durasi, dan jadwal layanan dapat ditanyakan langsung kepada admin melalui WhatsApp.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-page">
          <ContactCta settings={settings} />
        </div>
      </section>
    </>
  );
}
