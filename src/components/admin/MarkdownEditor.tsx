"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Heading2, Heading3, Italic, Link, List, ListOrdered, TextQuote } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { name: string; defaultValue?: string; label?: string };

type Tool = { label: string; icon: React.ReactNode; apply: (sel: string) => { text: string; block?: boolean } };

const TOOLS: Tool[] = [
  { label: "Tebal", icon: <span className="text-sm font-bold">B</span>, apply: (s) => ({ text: `**${s || "teks tebal"}**` }) },
  { label: "Miring", icon: <Italic size={16} />, apply: (s) => ({ text: `*${s || "teks miring"}*` }) },
  { label: "Subjudul", icon: <Heading2 size={16} />, apply: (s) => ({ text: `## ${s || "Subjudul"}`, block: true }) },
  { label: "Sub-subjudul", icon: <Heading3 size={16} />, apply: (s) => ({ text: `### ${s || "Sub-subjudul"}`, block: true }) },
  {
    label: "Daftar poin",
    icon: <List size={16} />,
    apply: (s) => ({ text: (s || "Poin").split("\n").map((l) => `- ${l}`).join("\n"), block: true }),
  },
  {
    label: "Daftar bernomor",
    icon: <ListOrdered size={16} />,
    apply: (s) => ({ text: (s || "Poin").split("\n").map((l, i) => `${i + 1}. ${l}`).join("\n"), block: true }),
  },
  {
    label: "Kutipan",
    icon: <TextQuote size={16} />,
    apply: (s) => ({ text: (s || "Kutipan").split("\n").map((l) => `> ${l}`).join("\n"), block: true }),
  },
  { label: "Tautan", icon: <Link size={16} />, apply: (s) => ({ text: `[${s || "teks tautan"}](https://)` }) },
];

/** Lightweight Markdown editor with toolbar and live preview. */
export function MarkdownEditor({ name, defaultValue = "", label = "Konten" }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const ref = useRef<HTMLTextAreaElement>(null);

  function applyTool(tool: Tool) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const selected = value.slice(start, end);
    const { text, block } = tool.apply(selected);
    const before = value.slice(0, start);
    const prefix = block && before && !before.endsWith("\n\n") ? (before.endsWith("\n") ? "\n" : "\n\n") : "";
    const next = `${before}${prefix}${text}${value.slice(end)}`;
    setValue(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + prefix.length + text.length;
      el.setSelectionRange(pos, pos);
    });
  }

  const words = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={`md-${name}`} className="label mb-0">
          {label}
        </label>
        <div role="tablist" className="flex rounded-full bg-canvas p-1 text-xs font-semibold">
          {(["write", "preview"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn("rounded-full px-3 py-1", tab === t ? "bg-white text-ink shadow-sm" : "text-muted")}
            >
              {t === "write" ? "Tulis" : "Pratinjau"}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
        {tab === "write" && (
          <div className="flex flex-wrap gap-0.5 border-b border-line bg-canvas px-2 py-1.5" role="toolbar" aria-label="Format teks">
            {TOOLS.map((tool) => (
              <button
                key={tool.label}
                type="button"
                title={tool.label}
                aria-label={tool.label}
                onClick={() => applyTool(tool)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink/70 hover:bg-white hover:text-ink"
              >
                {tool.icon}
              </button>
            ))}
          </div>
        )}
        <textarea
          ref={ref}
          id={`md-${name}`}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={20}
          className={cn(
            "block w-full resize-y px-4 py-3 font-mono text-sm leading-relaxed text-ink outline-none",
            tab === "preview" && "hidden",
          )}
          placeholder="Tulis artikel dengan format Markdown…"
        />
        {tab === "preview" && (
          <div className="prose-growth prose-base min-h-[480px] px-5 py-4">
            {value.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <p className="text-muted">Belum ada konten.</p>
            )}
          </div>
        )}
      </div>
      <p className="hint">
        Format Markdown: **tebal**, *miring*, ## subjudul, - daftar, &gt; kutipan. {words} kata · ±
        {Math.max(1, Math.round(words / 200))} menit baca.
      </p>
    </div>
  );
}
