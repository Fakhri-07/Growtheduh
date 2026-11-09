import Link from "next/link";
import { SmartImage } from "@/components/site/SmartImage";
import { cn } from "@/lib/utils";

const DEFAULT_LOGO = "/images/logo-growtheduh.png";

type Props = {
  logoUrl?: string | null;
  brandName?: string;
  className?: string;
  /** Height in px; width follows the logo's aspect ratio. */
  height?: number;
  priority?: boolean;
};

/** Official GROWTHEDUH logo (cropped, transparent version of the supplied file). */
export function Logo({ logoUrl, brandName = "GROWTHEDUH", className, height = 48, priority }: Props) {
  const width = Math.round(height * (656 / 376));
  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 items-center", className)}
      aria-label={`${brandName} — kembali ke beranda`}
    >
      <SmartImage
        src={logoUrl || DEFAULT_LOGO}
        alt={`Logo ${brandName}`}
        width={width}
        height={height}
        priority={priority}
        className="h-auto w-auto object-contain"
        style={{ height, width: "auto" }}
      />
    </Link>
  );
}
