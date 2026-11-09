"use client";

import { useTransition, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Button that runs a server action (optionally after a confirm dialog) and
 * shows a pending state. Errors are surfaced with an alert.
 */
export function ActionButton({
  action,
  confirm,
  children,
  className,
  title,
}: {
  action: () => Promise<void>;
  confirm?: string;
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={pending}
      className={cn("inline-flex items-center justify-center gap-1.5", className)}
      onClick={() => {
        if (confirm && !window.confirm(confirm)) return;
        startTransition(async () => {
          try {
            await action();
          } catch (err) {
            // redirect() inside an action is delivered as a navigation, not an error.
            if (err && typeof err === "object" && "digest" in err) throw err;
            window.alert(err instanceof Error ? err.message : "Terjadi kesalahan.");
          }
        });
      }}
    >
      {pending ? <LoaderCircle size={16} className="animate-spin" aria-hidden /> : children}
    </button>
  );
}
