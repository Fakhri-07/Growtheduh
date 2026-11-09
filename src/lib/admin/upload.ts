import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { STORAGE_BUCKET } from "@/lib/env";

const MAX_BYTES = 4 * 1024 * 1024;
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export class UploadError extends Error {}

/**
 * Handles an <ImageField> submission:
 *  - new file uploaded  -> upload to Storage, return its public URL
 *  - "remove" ticked    -> return null
 *  - otherwise          -> keep the current URL
 */
export async function resolveImageField(
  supabase: SupabaseClient,
  formData: FormData,
  field: string,
  folder: string,
): Promise<string | null> {
  const current = (formData.get(`${field}_current`) as string | null) || null;
  const remove = formData.get(`${field}_remove`) === "on";
  const file = formData.get(`${field}_file`);

  if (file instanceof File && file.size > 0) {
    const ext = TYPES[file.type];
    if (!ext) throw new UploadError("Format gambar harus JPG, PNG, WebP, atau AVIF.");
    if (file.size > MAX_BYTES) throw new UploadError("Ukuran gambar maksimal 4 MB.");

    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });
    if (error) throw new UploadError(`Gagal mengunggah gambar: ${error.message}`);
    await removeStoredImage(supabase, current);
    return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
  }

  if (remove) {
    await removeStoredImage(supabase, current);
    return null;
  }
  return current;
}

/** Deletes a file from our bucket (ignores local /public paths and foreign URLs). */
export async function removeStoredImage(supabase: SupabaseClient, url: string | null) {
  if (!url) return;
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = decodeURIComponent(url.slice(idx + marker.length));
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  if (error) console.warn("[upload] could not remove old image:", error.message);
}
