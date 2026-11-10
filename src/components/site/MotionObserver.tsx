"use client";

import { useEffect } from "react";

const SELECTOR = "[data-reveal]:not([data-inview]), [data-stagger]:not([data-inview])";

/**
 * Drives scroll-reveal animations and the header "scrolled" state.
 *
 * Server components only add `data-reveal` / `data-stagger` attributes; this
 * one observer marks them `data-inview` when they enter the viewport. Content
 * is only hidden after this script runs (html[data-motion]), and anything
 * already on screen at that moment is shown instantly, so nothing flickers.
 */
export function MotionObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      if (window.scrollY > 8) root.setAttribute("data-scrolled", "");
      else root.removeAttribute("data-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (reduce || !("IntersectionObserver" in window)) {
      return () => window.removeEventListener("scroll", onScroll);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.inview = "true";
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const inViewport = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };

    // Later content (streamed sections, client navigations) animates in.
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches(SELECTOR)) io.observe(node);
          node.querySelectorAll(SELECTOR).forEach((el) => io.observe(el));
        });
      }
    });

    // Start once the browser is idle, i.e. after React has hydrated the page,
    // so the attributes we add never conflict with hydration. Nothing is hidden
    // before this point (html[data-motion] is not set yet), so there is no flicker.
    const start = () => {
      // First pass: whatever is visible right now stays visible (no replay).
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (inViewport(el)) el.dataset.inview = "instant";
        else io.observe(el);
      });
      root.setAttribute("data-motion", "");
      mo.observe(document.body, { childList: true, subtree: true });
    };
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 1200 })
      : window.setTimeout(start, 400);

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      mo.disconnect();
      root.removeAttribute("data-motion");
    };
  }, []);

  return null;
}
