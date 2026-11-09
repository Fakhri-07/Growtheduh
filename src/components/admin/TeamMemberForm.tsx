import { ActionForm } from "@/components/admin/ActionForm";
import { Checkbox, FormSection, LINES_HINT, TextArea, TextField } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/ImageField";
import { saveTeamMember } from "@/lib/admin/actions";
import type { TeamMember } from "@/lib/types";

export function TeamMemberForm({
  member,
  mode = "team",
}: {
  member?: TeamMember | null;
  /** "profile" locks the member as the featured main profile. */
  mode?: "team" | "profile";
}) {
  return (
    <ActionForm action={saveTeamMember} submitLabel={member ? "Simpan perubahan" : "Tambah profil"}>
      {member && <input type="hidden" name="id" value={member.id} />}
      <input type="hidden" name="return_to" value={mode} />

      <div className="rounded-xl border border-sand bg-sand-soft/60 px-4 py-3 text-sm text-ink/80">
        Isi hanya informasi yang sudah dikonfirmasi. Jangan mencantumkan nomor registrasi, lisensi, atau sertifikasi
        yang belum diverifikasi, dan jangan menyebut seseorang sebagai psikolog kecuali sudah dikonfirmasi.
      </div>

      <FormSection title="Identitas">
        <TextField name="full_name" label="Nama lengkap & gelar" defaultValue={member?.full_name} required maxLength={120} />
        <TextField
          name="professional_title"
          label="Jabatan / peran profesional"
          defaultValue={member?.professional_title}
          maxLength={160}
          placeholder="contoh: Konselor"
        />
        <TextField
          name="slug"
          label="Slug URL"
          defaultValue={member?.slug}
          hint="Otomatis dari nama jika dikosongkan. Contoh: tri-wisda"
        />
        <TextField name="sort_order" label="Urutan" type="number" defaultValue={member?.sort_order ?? 0} />
        <ImageField
          name="portrait"
          label="Foto profil"
          currentUrl={member?.portrait_url}
          aspect="portrait"
          className="sm:col-span-2"
        />
      </FormSection>

      <FormSection title="Profil">
        <TextArea name="short_bio" label="Bio singkat" defaultValue={member?.short_bio} rows={3} maxLength={400} className="sm:col-span-2" />
        <TextArea name="biography" label="Biografi" defaultValue={member?.biography} rows={8} className="sm:col-span-2" />
        <TextArea name="education" label="Pendidikan" defaultValue={member?.education} rows={4} hint={LINES_HINT} />
        <TextArea name="experience" label="Pengalaman" defaultValue={member?.experience} rows={4} hint={LINES_HINT} />
        <TextArea name="specializations" label="Bidang keahlian" defaultValue={member?.specializations} rows={4} hint={LINES_HINT} />
        <TextArea
          name="qualifications"
          label="Kualifikasi profesional"
          defaultValue={member?.qualifications}
          rows={4}
          hint={`${LINES_HINT} Hanya yang sudah terverifikasi.`}
        />
      </FormSection>

      <FormSection title="Tautan">
        <TextField name="linkedin_url" label="URL LinkedIn" defaultValue={member?.linkedin_url} placeholder="https://www.linkedin.com/in/…" />
        <TextField name="profile_url" label="Profil profesional lain" defaultValue={member?.profile_url} placeholder="https://…" />
      </FormSection>

      <div className="grid gap-3 sm:grid-cols-2">
        <Checkbox name="is_published" label="Tampilkan di website" defaultChecked={member?.is_published ?? true} />
        {mode === "profile" ? (
          <input type="hidden" name="is_featured" value="on" />
        ) : (
          <Checkbox
            name="is_featured"
            label="Jadikan profil utama"
            hint="Ditampilkan di hero beranda. Hanya satu profil utama."
            defaultChecked={member?.is_featured ?? false}
          />
        )}
      </div>
    </ActionForm>
  );
}
