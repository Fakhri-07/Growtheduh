import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { cn } from "@/lib/utils";

type Props = {
  /** Pre-built wa.me URL (see buildWhatsAppUrl). null = number not configured. */
  href: string | null;
  label?: string;
  variant?: "primary" | "outline" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
  fullWidth?: boolean;
};

const variants = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  outline: "border border-brand/30 bg-surface text-brand-dark hover:border-brand hover:bg-brand-soft",
  light: "bg-white text-brand-dark hover:bg-brand-soft",
} as const;

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
} as const;

/**
 * Reusable WhatsApp CTA. Renders a safe, non-clickable placeholder when the
 * number is missing/invalid instead of producing a broken wa.me link.
 */
export function WhatsAppButton({
  href,
  label = "Konsultasi via WhatsApp",
  variant = "primary",
  size = "md",
  className,
  fullWidth,
}: Props) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200",
    sizes[size],
    fullWidth && "w-full",
    className,
  );

  if (!href) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[WhatsApp] Nomor WhatsApp belum dikonfigurasi atau tidak valid. Atur di Admin > Pengaturan.",
      );
    }
    return (
      <span
        className={cn(classes, "cursor-not-allowed border border-dashed border-line bg-canvas text-muted")}
        title="Nomor WhatsApp belum dikonfigurasi"
        aria-disabled="true"
      >
        <WhatsAppIcon size={18} />
        WhatsApp belum tersedia
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(classes, variants[variant])}
      aria-label={`${label} (membuka WhatsApp di tab baru)`}
    >
      <WhatsAppIcon size={size === "lg" ? 20 : 18} />
      {label}
    </a>
  );
}
