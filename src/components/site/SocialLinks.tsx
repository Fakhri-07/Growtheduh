import { Mail } from "lucide-react";
import { InstagramIcon, LinkedInIcon, TikTokIcon } from "@/components/icons/BrandIcons";
import type { SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

export function socialItems(settings: SiteSettings) {
  return [
    settings.instagram_url && {
      href: settings.instagram_url,
      label: "Instagram",
      handle: handleFromUrl(settings.instagram_url),
      Icon: InstagramIcon,
    },
    settings.tiktok_url && {
      href: settings.tiktok_url,
      label: "TikTok",
      handle: handleFromUrl(settings.tiktok_url),
      Icon: TikTokIcon,
    },
    settings.linkedin_url && {
      href: settings.linkedin_url,
      label: "LinkedIn",
      handle: handleFromUrl(settings.linkedin_url),
      Icon: LinkedInIcon,
    },
  ].filter(Boolean) as { href: string; label: string; handle: string; Icon: typeof InstagramIcon }[];
}

function handleFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname.split("/").filter(Boolean).pop() ?? "";
    return path.startsWith("@") ? path : `@${path}`;
  } catch {
    return url;
  }
}

export function SocialLinks({
  settings,
  className,
  tone = "light",
}: {
  settings: SiteSettings;
  className?: string;
  tone?: "light" | "dark";
}) {
  const items = socialItems(settings);
  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {items.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} GROWTHEDUH (tab baru)`}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors",
              tone === "light"
                ? "border border-line bg-white text-brand-dark hover:border-brand hover:bg-brand-soft"
                : "bg-white/10 text-white hover:bg-white/20",
            )}
          >
            <Icon size={18} />
          </a>
        </li>
      ))}
      {settings.email && (
        <li>
          <a
            href={`mailto:${settings.email}`}
            aria-label={`Kirim email ke ${settings.email}`}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors",
              tone === "light"
                ? "border border-line bg-white text-brand-dark hover:border-brand hover:bg-brand-soft"
                : "bg-white/10 text-white hover:bg-white/20",
            )}
          >
            <Mail size={18} aria-hidden />
          </a>
        </li>
      )}
    </ul>
  );
}
