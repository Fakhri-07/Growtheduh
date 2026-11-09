import { ChevronDown } from "lucide-react";
import type { Faq } from "@/lib/types";

/** Accessible accordion using native <details>/<summary> — works without JS. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;
  return (
    <div data-stagger className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
      {faqs.map((faq) => (
        <details key={faq.id} className="faq-item group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left font-medium text-ink transition-colors hover:bg-canvas [&::-webkit-details-marker]:hidden">
            <span>{faq.question}</span>
            <ChevronDown
              size={20}
              aria-hidden
              className="shrink-0 text-brand transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <div className="px-6 pb-6 text-[15px] leading-relaxed whitespace-pre-line text-muted">{faq.answer}</div>
        </details>
      ))}
    </div>
  );
}
