import type { Metadata } from "next";

// The admin area is per-session and always rendered at request time, so it is
// opted out of instant-navigation / static-shell validation.
export const instant = false;

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin GROWTHEDUH" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-canvas">{children}</div>;
}
