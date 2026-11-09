/**
 * WhatsApp link helpers. The phone number and default message come from a
 * single source: the `site_settings` row (falling back to DEFAULT_SETTINGS).
 */

/** Normalises Indonesian numbers to international format without "+". */
export function normalizeWhatsAppNumber(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  else if (digits.startsWith("8")) digits = `62${digits}`;
  // E.164: 8–15 digits.
  if (!/^\d{8,15}$/.test(digits)) return null;
  return digits;
}

/** Returns a wa.me URL, or null when the number is missing/invalid. */
export function buildWhatsAppUrl(
  rawNumber: string | null | undefined,
  message?: string | null,
): string | null {
  const number = normalizeWhatsAppNumber(rawNumber);
  if (!number) return null;
  const text = message?.trim();
  return text
    ? `https://wa.me/${number}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${number}`;
}

export function serviceWhatsAppMessage(serviceTitle: string): string {
  return `Halo GROWTHEDUH, saya ingin bertanya mengenai layanan ${serviceTitle}. Boleh saya mendapatkan informasi lebih lanjut?`;
}
