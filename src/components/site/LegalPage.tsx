import type { ReactNode } from "react";
import { PageHeader } from "@/components/site/ui";

export function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <PageHeader eyebrow="Informasi" title={title} description={intro} />
      <section className="py-12 sm:py-16">
        <div className="container-page max-w-3xl">
          <p className="text-sm text-muted">Terakhir diperbarui: {updated}</p>
          <div className="prose-growth prose-base mt-6 sm:prose-lg">{children}</div>
        </div>
      </section>
    </>
  );
}
