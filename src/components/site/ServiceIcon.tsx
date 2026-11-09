import {
  Brain,
  Briefcase,
  ClipboardCheck,
  Compass,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Leaf,
  MessageCircleHeart,
  MonitorSmartphone,
  Puzzle,
  Sprout,
  Users,
  type LucideIcon,
} from "lucide-react";

/** Icons an admin can choose for a service (stored by key in services.icon). */
export const SERVICE_ICONS: Record<string, { label: string; Icon: LucideIcon }> = {
  "message-circle-heart": { label: "Percakapan", Icon: MessageCircleHeart },
  users: { label: "Keluarga / Kelompok", Icon: Users },
  sprout: { label: "Tumbuh kembang", Icon: Sprout },
  "clipboard-check": { label: "Asesmen", Icon: ClipboardCheck },
  "monitor-smartphone": { label: "Online / Offline", Icon: MonitorSmartphone },
  briefcase: { label: "Organisasi / HRD", Icon: Briefcase },
  "heart-handshake": { label: "Pendampingan", Icon: HeartHandshake },
  "hand-heart": { label: "Kepedulian", Icon: HandHeart },
  brain: { label: "Psikologi", Icon: Brain },
  "graduation-cap": { label: "Pendidikan", Icon: GraduationCap },
  compass: { label: "Karir / Arah", Icon: Compass },
  puzzle: { label: "Kebutuhan khusus", Icon: Puzzle },
  leaf: { label: "Pengembangan diri", Icon: Leaf },
};

export function ServiceIcon({ name, size = 22 }: { name: string | null; size?: number }) {
  const Icon = (name && SERVICE_ICONS[name]?.Icon) || Leaf;
  return <Icon size={size} aria-hidden strokeWidth={1.75} />;
}
