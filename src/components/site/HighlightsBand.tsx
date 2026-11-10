import { SiteIcon, type SiteIconName } from "@/components/icons/SiteIcon";

export type Highlight = { icon: SiteIconName; value: string; label: string };

/**
 * Gradient band of key facts. Only real, verifiable values are passed in
 * (service count, formats, review rating) — never invented statistics.
 */
export function HighlightsBand({ items }: { items: Highlight[] }) {
  return (
    <section
      aria-label="Sorotan GROWTHEDUH"
      data-reveal=""
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand via-[#3b7d5a] to-brand-dark px-6 py-8 text-white shadow-lift sm:px-10"
    >
      <div aria-hidden className="anim-breathe absolute -top-16 left-1/3 h-40 w-40 rounded-full bg-leaf/25 blur-3xl" />
      <div aria-hidden className="anim-breathe absolute -right-10 -bottom-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      <dl data-stagger="" className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/15">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3.5 lg:px-5 lg:first:pl-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
              <SiteIcon name={item.icon} size={22} />
            </div>
            <div className="min-w-0">
              <dt className="sr-only">{item.label}</dt>
              <dd className="font-display text-xl leading-tight xl:text-2xl">{item.value}</dd>
              <dd className="text-sm text-white/75">{item.label}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
