import { BookOpen, HeartHandshake, Lock, MonitorSmartphone, ShieldCheck, type LucideIcon } from "lucide-react";

/** "Why choose GROWTHEDUH" points, as listed in the brand brief. */
export const APPROACH: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: ShieldCheck,
    title: "Layanan Profesional",
    text: "Layanan psikologi yang dijalankan secara profesional dan bertanggung jawab.",
  },
  {
    icon: HeartHandshake,
    title: "Pendekatan Empatik",
    text: "Kami mendengarkan dengan hangat dan tanpa menghakimi, sehingga Anda merasa aman untuk bercerita.",
  },
  {
    icon: Lock,
    title: "Kerahasiaan Terjaga",
    text: "Cerita dan informasi pribadi Anda diperlakukan dengan penuh kerahasiaan.",
  },
  {
    icon: MonitorSmartphone,
    title: "Online & Offline",
    text: "Fleksibel memilih sesi daring maupun tatap muka sesuai kebutuhan dan kenyamanan Anda.",
  },
  {
    icon: BookOpen,
    title: "Edukasi Berbasis Ilmu",
    text: "Konten edukasi disusun dengan merujuk pada ilmu psikologi dan ditinjau oleh tim GROWTHEDUH.",
  },
];
