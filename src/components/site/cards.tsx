import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock, Quote, UserRound } from "lucide-react";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { SmartImage } from "@/components/site/SmartImage";
import { StarRating } from "@/components/site/StarRating";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import type { Article, Service, TeamMember, Testimonial } from "@/lib/types";
import { cn, formatDate, readingMinutes } from "@/lib/utils";

export function ServiceCard({ service, waUrl }: { service: Service; waUrl?: string | null }) {
  return (
    <article className="card group relative flex h-full flex-col items-center overflow-hidden p-7 text-center transition duration-300 hover:-translate-y-1.5 hover:border-brand/25 hover:shadow-lift">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-brand-soft opacity-0 blur-2xl transition duration-500 group-hover:opacity-100"
      />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-leaf to-brand text-white shadow-[0_10px_24px_-10px_rgb(47_107_79/0.7)] ring-8 ring-brand-soft transition duration-300 group-hover:scale-110 group-hover:-rotate-6">
        <ServiceIcon name={service.icon} size={26} />
      </div>
      <h3 className="relative mt-6 font-display text-xl leading-snug font-medium text-ink">
        <Link href={`/layanan/${service.slug}`} className="after:absolute after:inset-0 focus:outline-none">
          {service.title}
        </Link>
      </h3>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{service.summary}</p>
      <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={`/layanan/${service.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark"
        >
          Selengkapnya <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
        </Link>
        {waUrl !== undefined && <WhatsAppButton href={waUrl} label="Tanya via WhatsApp" variant="outline" size="sm" />}
      </div>
    </article>
  );
}

export function ArticleCard({ article, priority }: { article: Article; priority?: boolean }) {
  const category = article.categories[0];
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition duration-300 hover:-translate-y-1.5 hover:shadow-lift">
      <div className="relative m-3 mb-0 aspect-[16/10] overflow-hidden rounded-xl bg-brand-soft">
        {article.featured_image_url ? (
          <SmartImage
            src={article.featured_image_url}
            alt={article.featured_image_alt || article.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <ArticleImageFallback />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          {category && (
            <span className="rounded-md border border-brand/20 bg-brand-soft/70 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-brand-dark uppercase">{category.name}</span>
          )}
          <time dateTime={article.published_at ?? undefined}>{formatDate(article.published_at)}</time>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} aria-hidden /> {readingMinutes(article.content)} menit baca
          </span>
        </div>
        <h3 className="mt-3 font-display text-xl leading-snug font-medium text-ink">
          <Link href={`/artikel/${article.slug}`} className="after:absolute after:inset-0 focus:outline-none">
            {article.title}
          </Link>
        </h3>
        {article.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{article.excerpt}</p>}
      </div>
    </article>
  );
}

export function ArticleImageFallback({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,var(--brand-soft),#ffffff_70%)]",
        className,
      )}
    >
      <SmartImage src="/images/leaf-mark.png" alt="" width={64} height={64} className="opacity-40" />
    </div>
  );
}

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="card group relative flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:shadow-lift">
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-soft">
        {member.portrait_url ? (
          <SmartImage
            src={member.portrait_url}
            alt={`Foto ${member.full_name}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand/50">
            <UserRound size={64} aria-hidden />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-medium text-ink">
          <Link href={`/tim/${member.slug}`} className="after:absolute after:inset-0 focus:outline-none">
            {member.full_name}
          </Link>
        </h3>
        {member.professional_title && <p className="mt-1 text-sm font-medium text-brand">{member.professional_title}</p>}
        {member.short_bio && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{member.short_bio}</p>}
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
          Lihat profil <ArrowRight size={16} aria-hidden />
        </span>
      </div>
    </article>
  );
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="card flex h-full flex-col p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="flex items-center justify-between gap-3">
        <StarRating value={testimonial.rating} />
        <Quote size={22} className="text-sand" aria-hidden />
      </div>
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed whitespace-pre-line text-ink/85">
        “{testimonial.content}”
      </blockquote>
      <figcaption className="mt-5 border-t border-line pt-4">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
          {testimonial.display_name}
          {testimonial.is_verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand-dark">
              <BadgeCheck size={12} aria-hidden /> Klien terverifikasi
            </span>
          )}
        </p>
        <p className="mt-0.5 text-xs text-muted">
          {[testimonial.service_category, formatDate(testimonial.created_at)].filter(Boolean).join(" · ")}
        </p>
      </figcaption>
    </figure>
  );
}
