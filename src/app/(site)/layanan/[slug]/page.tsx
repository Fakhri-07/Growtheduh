import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { ServiceCard } from "@/components/site/cards";
import { JsonLd } from "@/components/site/JsonLd";
import { EmergencyNotice } from "@/components/site/Notices";
import { ServiceDetails } from "@/components/site/ServiceDetails";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { SmartImage } from "@/components/site/SmartImage";
import { PageSkeleton } from "@/components/site/ui";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { getServiceBySlug, getServices, getSiteSettings } from "@/lib/data/public";
import { getSiteUrl } from "@/lib/env";
import { buildWhatsAppUrl, serviceWhatsAppMessage } from "@/lib/whatsapp";

export async function generateMetadata({ params }: PageProps<"/layanan/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Layanan tidak ditemukan", robots: { index: false } };
  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `/layanan/${service.slug}` },
    openGraph: { title: service.title, description: service.summary, type: "website" },
  };
}

export default function ServiceDetailPage({ params }: PageProps<"/layanan/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ServiceDetail params={params} />
    </Suspense>
  );
}

async function ServiceDetail({ params }: Pick<PageProps<"/layanan/[slug]">, "params">) {
  const { slug } = await params;
  const [service, services, settings] = await Promise.all([getServiceBySlug(slug), getServices(), getSiteSettings()]);
  if (!service) notFound();

  const waUrl = buildWhatsAppUrl(
    settings.whatsapp_number,
    service.whatsapp_message || serviceWhatsAppMessage(service.title),
  );
  const others = services.filter((s) => s.id !== service.id).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.summary,
          url: `${getSiteUrl()}/layanan/${service.slug}`,
          provider: { "@type": "Organization", name: settings.brand_name, url: getSiteUrl() },
          areaServed: "ID",
        }}
      />
      <section className="border-b border-line bg-white">
        <div className="container-page py-12 sm:py-16">
          <Link href="/layanan" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-dark">
            <ArrowLeft size={16} aria-hidden /> Semua layanan
          </Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <ServiceIcon name={service.icon} size={26} />
              </div>
              <h1 className="heading-display mt-6 text-4xl leading-tight sm:text-5xl">{service.title}</h1>
              <p className="mt-5 text-lg leading-relaxed text-muted">{service.summary}</p>
              <div className="mt-8">
                <WhatsAppButton href={waUrl} label="Tanya layanan ini via WhatsApp" size="lg" />
              </div>
            </div>
            {service.image_url && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-soft lg:col-span-5">
                <SmartImage
                  src={service.image_url}
                  alt={`Ilustrasi ${service.title}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <div data-reveal="" className="space-y-8 lg:col-span-8">
            {service.description && (
              <p className="text-lg leading-relaxed whitespace-pre-line text-ink/85">{service.description}</p>
            )}
            <ServiceDetails service={service} />
          </div>
          <aside className="lg:col-span-4">
            <div className="card sticky top-24 p-6">
              <h2 className="font-display text-xl font-medium text-ink">Ingin tahu lebih lanjut?</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Admin GROWTHEDUH siap membantu menjelaskan layanan, jadwal, dan informasi biaya.
              </p>
              <WhatsAppButton href={waUrl} label="Chat admin" fullWidth className="mt-5" />
            </div>
          </aside>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-page">
          <EmergencyNotice text={settings.emergency_info} />
        </div>
      </section>

      {others.length > 0 && (
        <section className="border-t border-line bg-white py-16 sm:py-20" aria-labelledby="layanan-lain">
          <div className="container-page">
            <h2 id="layanan-lain" className="heading-display text-2xl sm:text-3xl">
              Layanan lainnya
            </h2>
            <div data-stagger="" className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
