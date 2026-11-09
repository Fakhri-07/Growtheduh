import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { getSiteUrl } from "@/lib/env";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "opsz"],
});

const DEFAULT_TITLE = "GROWTHEDUH | Layanan Psikologi dan Pengembangan Diri";
const DEFAULT_DESCRIPTION =
  "GROWTHEDUH menyediakan layanan psikologi, konseling, asesmen, dan edukasi pengembangan diri dengan pendekatan profesional, hangat, dan empatik.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: DEFAULT_TITLE, template: "%s | GROWTHEDUH" },
  description: DEFAULT_DESCRIPTION,
  applicationName: "GROWTHEDUH",
  keywords: [
    "psikologi",
    "konseling",
    "asesmen psikologi",
    "tumbuh kembang anak",
    "anak berkebutuhan khusus",
    "konseling keluarga",
    "pengembangan diri",
    "kesehatan mental",
    "GROWTHEDUH",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "GROWTHEDUH",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: "/images/og-default.png", width: 1200, height: 630, alt: "GROWTHEDUH" }],
  },
  twitter: { card: "summary_large_image", title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#2f6b4f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${jakarta.variable} ${fraunces.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
