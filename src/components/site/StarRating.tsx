import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ value, size = 16, className }: { value: number; size?: number; className?: string }) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`Rating ${value} dari 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = rounded >= i ? 1 : rounded >= i - 0.5 ? 0.5 : 0;
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-line" fill="currentColor" strokeWidth={0} aria-hidden />
            {fill > 0 && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: fill === 1 ? "100%" : "50%" }}>
                <Star size={size} className="text-bud" fill="currentColor" strokeWidth={0} aria-hidden />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
