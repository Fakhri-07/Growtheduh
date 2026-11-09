import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { isSupabaseConfigured } from "@/lib/env";
import { createSessionClient } from "@/lib/supabase/server";

export type AdminUser = { id: string; email: string | null };

/**
 * Data Access Layer: verifies the session with Supabase Auth (getUser hits
 * the Auth server, so a forged cookie is rejected) and checks admin_roles.
 * Every admin page, admin query and admin server action goes through this.
 * Deduplicated per request with React `cache`.
 */
export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: role } = await supabase
    .from("admin_roles")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!role) return null;

  return { id: user.id, email: user.email ?? null };
});

/** Redirects to the login page unless the visitor is an authorised admin. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");
  return admin;
}

/** For server actions: returns a session client only for verified admins. */
export async function adminClient() {
  const admin = await getAdminUser();
  if (!admin) throw new UnauthorizedError();
  return { admin, supabase: await createSessionClient() };
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Sesi berakhir atau Anda tidak memiliki akses admin. Silakan masuk kembali.");
  }
}
