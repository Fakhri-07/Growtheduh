import type { SiteIconName } from "@/components/icons/SiteIcon";

export const NAV_LINKS: readonly { href: string; label: string; icon: SiteIconName }[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/tentang-kami", label: "Tentang Kami", icon: "about" },
  { href: "/layanan", label: "Layanan", icon: "services" },
  { href: "/tim", label: "Tim Profesional", icon: "team" },
  { href: "/artikel", label: "Artikel", icon: "articles" },
  { href: "/ulasan", label: "Ulasan", icon: "reviews" },
  { href: "/kontak", label: "Kontak", icon: "contact" },
];
