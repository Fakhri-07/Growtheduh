export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Splits a "one item per line" text field into trimmed, non-empty items. */
export function lines(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : dateFormatter.format(d);
}

/** ISO timestamp -> "YYYY-MM-DDTHH:mm" in Asia/Jakarta, for <input type="datetime-local">. */
export function toJakartaInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const local = new Date(d.getTime() + 7 * 60 * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

/** "YYYY-MM-DDTHH:mm" entered in Asia/Jakarta (UTC+7) -> ISO timestamp. */
export function fromJakartaInput(value: string | null | undefined): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const d = new Date(`${value}:00+07:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** Publication state of an article relative to the current time. */
export function publicationState(status: string, publishedAt: string | null): "draft" | "scheduled" | "live" {
  if (status !== "published") return "draft";
  return publishedAt && new Date(publishedAt).getTime() > Date.now() ? "scheduled" : "live";
}

export function readingMinutes(markdown: string): number {
  const words = markdown.replace(/[#>*_`~[\]()!-]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

/** Strips basic Markdown syntax for excerpts and meta descriptions. */
export function plainText(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
