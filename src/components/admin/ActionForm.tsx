"use client";

import { startTransition, useActionState, useEffect, useRef, type ReactNode } from "react";
import { CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import type { ActionState } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  children: ReactNode;
  submitLabel?: string;
  className?: string;
  /** Clear the form after a successful submit (e.g. "add" forms). */
  resetOnSuccess?: boolean;
  footer?: ReactNode;
};

/**
 * Form bound to a server action, with pending state and success/error feedback.
 * Submits via onSubmit (not the `action` prop) so React does not reset the
 * admin's input when the server rejects it.
 */
export function ActionForm({ action, children, submitLabel = "Simpan", className, resetOnSuccess, footer }: Props) {
  const [state, formAction, pending] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);

  return (
    <form
      ref={ref}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => formAction(formData));
      }}
      className={cn("space-y-6", className)}
      encType="multipart/form-data"
    >
      {children}
      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending && <LoaderCircle size={16} className="animate-spin" aria-hidden />}
          {pending ? "Menyimpan…" : submitLabel}
        </button>
        {footer}
        {state && !pending && (
          <p
            role={state.ok ? "status" : "alert"}
            className={cn("inline-flex items-center gap-1.5 text-sm font-medium", state.ok ? "text-brand" : "text-danger")}
          >
            {state.ok ? <CircleCheck size={16} aria-hidden /> : <CircleX size={16} aria-hidden />}
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
