"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Scroll-snap carousel with previous/next buttons (works with touch, mouse and keyboard). */
export function Carousel({ children, label }: { children: ReactNode; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = track.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scroll = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.9, behavior: "smooth" });

  const btn =
    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink shadow-soft transition hover:border-brand hover:bg-brand hover:text-white disabled:pointer-events-none disabled:opacity-35";

  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label={label}>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => scroll(-1)} disabled={!canPrev} className={cn(btn, "hidden sm:inline-flex")} aria-label="Sebelumnya">
          <ArrowLeft size={18} aria-hidden />
        </button>
        <div
          ref={track}
          className="-my-4 flex min-w-0 flex-1 snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {Children.map(children, (child) => (
            <div className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-10px)] xl:w-[calc(33.333%-14px)]">{child}</div>
          ))}
        </div>
        <button type="button" onClick={() => scroll(1)} disabled={!canNext} className={cn(btn, "hidden sm:inline-flex")} aria-label="Berikutnya">
          <ArrowRight size={18} aria-hidden />
        </button>
      </div>
    </div>
  );
}
