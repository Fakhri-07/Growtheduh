"use client";

import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";
import { signIn } from "@/lib/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, null);
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className="input" />
      </div>
      <div>
        <label htmlFor="password" className="label">
          Kata sandi
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="current-password"
          className="input"
        />
      </div>
      {state && !state.ok && (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-danger">
          {state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full py-3">
        {pending && <LoaderCircle size={16} className="animate-spin" aria-hidden />}
        {pending ? "Memproses…" : "Masuk"}
      </button>
    </form>
  );
}
