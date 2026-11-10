import {
  BookOpen,
  CircleCheck,
  HandHeart,
  House,
  Mail,
  MapPin,
  MessageSquareQuote,
  MonitorSmartphone,
  Send,
  Sparkles,
  Star,
  UserRound,
  Users,
  Baby,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

/**
 * Central icon registry for the site chrome (sidebar, hero, stats, contact).
 *
 * To use GROWTHEDUH's own icons later: put the SVG files in /public/icons and
 * replace the matching entry below (e.g. with a small component that renders
 * the SVG). Every place on the site that uses <SiteIcon name="…"> updates at once.
 * Service icons live in src/components/site/ServiceIcon.tsx.
 */
const ICONS = {
  home: House,
  about: UserRound,
  services: HandHeart,
  team: Users,
  articles: BookOpen,
  reviews: MessageSquareQuote,
  contact: Mail,
  send: Send,
  location: MapPin,
  sparkle: Sparkles,
  check: CircleCheck,
  format: MonitorSmartphone,
  ages: Baby,
  rating: Star,
  privacy: ShieldCheck,
} satisfies Record<string, LucideIcon>;

export type SiteIconName = keyof typeof ICONS;

export function SiteIcon({
  name,
  size = 20,
  className,
  strokeWidth = 1.75,
}: {
  name: SiteIconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = ICONS[name];
  return <Icon size={size} className={className} strokeWidth={strokeWidth} aria-hidden />;
}
