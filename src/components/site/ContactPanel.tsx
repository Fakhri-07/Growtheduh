import { SiteIcon } from "@/components/icons/SiteIcon";
import { InstagramIcon, TikTokIcon } from "@/components/icons/BrandIcons";
import { socialItems } from "@/components/site/SocialLinks";
import { LeafAccent } from "@/components/site/ui";
import type { SiteSettings } from "@/lib/types";

/** Contact block: invitation panel + contact channels (Instagram, TikTok, Email, Lokasi). */
export function ContactPanel({ settings }: { settings: SiteSettings }) {
  const socials = socialItems(settings);
  const instagram = socials.find((s) => s.label === "Instagram");
  const tiktok = socials.find((s) => s.label === "TikTok");

  const details = [
    instagram ? { icon: <InstagramIcon size={20} />, label: "Instagram", value: instagram.handle, href: instagram.href } : null,
    tiktok ? { icon: <TikTokIcon size={20} />, label: "TikTok", value: tiktok.handle, href: tiktok.href } : null,
    settings.email
      ? { icon: <SiteIcon name="contact" size={20} />, label: "Email", value: settings.email, href: `mailto:${settings.email}` }
      : null,
    {
      icon: <SiteIcon name="location" size={20} />,
      label: "Lokasi",
      value: settings.address || "Layanan online & offline",
      href: settings.maps_url || null,
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href: string | null }[];

  return (
    <div data-reveal="" className="grid overflow-hidden rounded-3xl border border-line bg-white shadow-soft lg:grid-cols-12">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-dark p-8 text-white sm:p-10 lg:col-span-5">
        <LeafAccent className="absolute top-6 right-6 text-leaf/40" size={36} rotate={-20} />
        <div aria-hidden className="anim-breathe absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-leaf/25 blur-3xl" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
          <SiteIcon name="send" size={24} />
        </div>
        <h2 id="kontak" className="relative mt-8 font-display text-3xl leading-tight">
          Mari Bertumbuh Bersama!
        </h2>
        <p className="relative mt-3 max-w-sm text-sm leading-relaxed text-white/75">
          Ikuti dan hubungi {settings.brand_name} melalui kanal berikut untuk informasi layanan dan edukasi seputar
          psikologi.
        </p>
      </div>

      <ul data-stagger="" className="grid content-center gap-3 p-6 sm:grid-cols-2 sm:p-8 lg:col-span-7">
        {details.map((d) => {
          const inner = (
            <>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand transition duration-300 group-hover:bg-brand group-hover:text-white">
                {d.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-medium text-muted">{d.label}</span>
                <span className="block text-sm font-medium text-ink [overflow-wrap:anywhere]">{d.value}</span>
              </span>
            </>
          );
          const cls =
            "group flex items-center gap-3 rounded-2xl border border-line p-4 transition duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-soft";
          return (
            <li key={d.label}>
              {d.href ? (
                <a
                  href={d.href}
                  {...(d.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={cls}
                >
                  {inner}
                </a>
              ) : (
                <div className={cls}>{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
