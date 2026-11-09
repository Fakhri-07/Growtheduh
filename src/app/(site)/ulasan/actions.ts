"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { createPublicClient } from "@/lib/supabase/public";
import type { ActionState } from "@/lib/types";

const ReviewSchema = z.object({
  display_name: z
    .string()
    .trim()
    .min(2, "Nama tampilan minimal 2 karakter.")
    .max(60, "Nama tampilan maksimal 60 karakter."),
  rating: z.coerce.number().int().min(1, "Pilih rating 1–5.").max(5, "Pilih rating 1–5."),
  content: z
    .string()
    .trim()
    .min(10, "Ulasan minimal 10 karakter.")
    .max(1500, "Ulasan maksimal 1500 karakter."),
  service_category: z.string().trim().max(120).optional().transform((v) => v || null),
  claims_client: z.literal("on").optional(),
  consent: z.literal("on", { error: "Anda perlu menyetujui publikasi ulasan." }),
  // Honeypot: real users never fill this hidden field.
  website: z.string().max(0).optional(),
});

const THROTTLE_COOKIE = "gd_review_sent";

export async function submitTestimonial(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = ReviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Data ulasan tidak valid." };
  }
  if (parsed.data.website) {
    // Silently accept bot submissions without storing them.
    return { ok: true, message: "Terima kasih! Ulasan Anda akan ditinjau oleh tim sebelum ditampilkan." };
  }

  const cookieStore = await cookies();
  if (cookieStore.get(THROTTLE_COOKIE)) {
    return { ok: false, message: "Anda baru saja mengirim ulasan. Silakan coba lagi beberapa menit lagi." };
  }

  const supabase = createPublicClient();
  if (!supabase) {
    return {
      ok: false,
      message: "Fitur ulasan belum aktif karena database belum dikonfigurasi. Silakan coba lagi nanti.",
    };
  }

  // Status/verification are NOT sent: the database defaults to "pending" and
  // RLS + column grants prevent visitors from setting them.
  const { error } = await supabase.from("testimonials").insert({
    display_name: parsed.data.display_name,
    rating: parsed.data.rating,
    content: parsed.data.content,
    service_category: parsed.data.service_category,
    claims_client: parsed.data.claims_client === "on",
    consent_publication: true,
  });

  if (error) {
    console.error("[ulasan] insert failed:", error.message);
    return { ok: false, message: "Maaf, ulasan gagal dikirim. Silakan coba lagi." };
  }

  cookieStore.set(THROTTLE_COOKIE, "1", { maxAge: 300, httpOnly: true, sameSite: "lax", path: "/" });
  return { ok: true, message: "Terima kasih! Ulasan Anda akan ditinjau oleh tim GROWTHEDUH sebelum ditampilkan." };
}
