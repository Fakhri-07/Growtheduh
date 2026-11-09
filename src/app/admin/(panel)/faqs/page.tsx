import type { Metadata } from "next";
import { ArrowDown, ArrowUp, Trash } from "lucide-react";
import { ActionForm } from "@/components/admin/ActionForm";
import { AdminHeader, StatusBadge } from "@/components/admin/AdminHeader";
import { ActionButton } from "@/components/admin/ConfirmButton";
import { Checkbox, TextArea, TextField } from "@/components/admin/fields";
import { EmptyState } from "@/components/site/ui";
import { deleteFaq, moveItem, saveFaq } from "@/lib/admin/actions";
import { adminFaqs } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "FAQ" };

// Session-gated admin page: rendered at request time (see admin/layout.tsx).
export const instant = false;

export default async function FaqsAdminPage() {
  const faqs = await adminFaqs();
  return (
    <>
      <AdminHeader title="FAQ" description="Pertanyaan yang sering diajukan, tampil di beranda dan halaman kontak." />

      <section className="card p-5 sm:p-6" aria-labelledby="tambah-faq">
        <h2 id="tambah-faq" className="font-semibold text-ink">
          Tambah FAQ
        </h2>
        <ActionForm action={saveFaq} submitLabel="Tambah FAQ" resetOnSuccess className="mt-4">
          <TextField name="question" label="Pertanyaan" required maxLength={300} />
          <TextArea name="answer" label="Jawaban" required rows={4} maxLength={3000} />
          <Checkbox name="is_published" label="Tampilkan di website" defaultChecked />
        </ActionForm>
      </section>

      {faqs.length === 0 ? (
        <EmptyState className="mt-6" title="Belum ada FAQ" />
      ) : (
        <ul className="mt-6 space-y-3">
          {faqs.map((f, i) => (
            <li key={f.id} className="card flex items-start gap-2 p-4">
              <div className="flex shrink-0 flex-col">
                <ActionButton
                  action={moveItem.bind(null, "faqs", f.id, "up")}
                  title="Naikkan urutan"
                  className={`btn-ghost h-8 w-8 p-0 ${i === 0 ? "invisible" : ""}`}
                >
                  <ArrowUp size={16} aria-hidden />
                </ActionButton>
                <ActionButton
                  action={moveItem.bind(null, "faqs", f.id, "down")}
                  title="Turunkan urutan"
                  className={`btn-ghost h-8 w-8 p-0 ${i === faqs.length - 1 ? "invisible" : ""}`}
                >
                  <ArrowDown size={16} aria-hidden />
                </ActionButton>
              </div>
              <details className="min-w-0 flex-1">
                <summary className="flex cursor-pointer list-none items-start gap-3 py-1.5 [&::-webkit-details-marker]:hidden">
                  <span className="flex-1 font-medium text-ink">{f.question}</span>
                  {!f.is_published && <StatusBadge tone="gray">Disembunyikan</StatusBadge>}
                  <span className="btn-outline shrink-0 px-3 py-1.5">Ubah</span>
                </summary>
                <ActionForm
                  action={saveFaq}
                  className="mt-4 border-t border-line pt-4"
                  footer={
                    <ActionButton
                      action={deleteFaq.bind(null, f.id)}
                      confirm="Hapus FAQ ini?"
                      className="btn-danger"
                    >
                      <Trash size={16} aria-hidden /> Hapus
                    </ActionButton>
                  }
                >
                  <input type="hidden" name="id" value={f.id} />
                  <input type="hidden" name="sort_order" value={f.sort_order} />
                  <TextField name="question" label="Pertanyaan" defaultValue={f.question} required maxLength={300} />
                  <TextArea name="answer" label="Jawaban" defaultValue={f.answer} required rows={4} maxLength={3000} />
                  <Checkbox name="is_published" label="Tampilkan di website" defaultChecked={f.is_published} />
                </ActionForm>
              </details>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
