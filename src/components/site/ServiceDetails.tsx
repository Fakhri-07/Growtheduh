import { Check, Clock, MapPin, Wallet } from "lucide-react";
import type { Service } from "@/lib/types";
import { lines } from "@/lib/utils";

/** Sub-services list plus optional admin-configured practical info. */
export function ServiceDetails({ service }: { service: Service }) {
  const items = lines(service.items);
  const facts = [
    service.price_info && { icon: Wallet, label: "Biaya", value: service.price_info },
    service.duration_info && { icon: Clock, label: "Durasi", value: service.duration_info },
    service.location_info && { icon: MapPin, label: "Lokasi", value: service.location_info },
  ].filter(Boolean) as { icon: typeof Wallet; label: string; value: string }[];

  return (
    <div className="space-y-6">
      {items.length > 0 && (
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 rounded-xl bg-canvas px-4 py-3 text-[15px] text-ink/85">
              <Check size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      )}
      {facts.length > 0 && (
        <dl className="grid gap-3 sm:grid-cols-3">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl border border-line p-4">
              <dt className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted uppercase">
                <Icon size={14} aria-hidden /> {label}
              </dt>
              <dd className="mt-1 text-sm font-medium whitespace-pre-line text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
