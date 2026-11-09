import { LeafAccent } from "@/components/site/ui";

/**
 * Slow, continuous ribbon of service names. The list is rendered twice so the
 * loop is seamless; the duplicate copy is hidden from assistive technology.
 * Pauses on hover; static (no movement) when reduced motion is preferred.
 */
export function ServiceMarquee({ items }: { items: string[] }) {
  // Pad short lists so one copy is always wider than large screens.
  const list = items.length < 8 ? [...items, ...items] : items;
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {list.map((item, i) => (
        <li key={`${item}-${i}`} className="flex items-center gap-6 px-6 whitespace-nowrap">
          <span className="font-display text-xl text-white/90 sm:text-2xl">{item}</span>
          <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" className="text-leaf" fill="currentColor">
            <path d="M12 2c.6 4.6 2.9 7.4 8 8-5.1.6-7.4 3.4-8 8-.6-4.6-2.9-7.4-8-8 5.1-.6 7.4-3.4 8-8Z" />
          </svg>
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="Daftar layanan" className="marquee relative overflow-hidden bg-brand-dark py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-brand-dark to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-brand-dark to-transparent" />
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
      <LeafAccent className="absolute top-1 right-[30%] hidden text-white/10 md:block" size={18} />
    </section>
  );
}
