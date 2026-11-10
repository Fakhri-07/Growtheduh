import type { Metadata } from "next";
import { ActionForm } from "@/components/admin/ActionForm";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { FormSection, LINES_HINT, TextArea, TextField } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/ImageField";
import { saveSettings } from "@/lib/admin/actions";
import { adminSettings } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Pengaturan" };

// Session-gated admin page: rendered at request time (see admin/layout.tsx).
export const instant = false;

export default async function SettingsPage() {
  const s = await adminSettings();
  return (
    <>
      <AdminHeader title="Pengaturan Situs" description="Identitas brand, kontak, konten beranda, dan footer." />
      <ActionForm action={saveSettings} submitLabel="Simpan pengaturan">
        <FormSection title="Identitas brand">
          <TextField name="brand_name" label="Nama brand" defaultValue={s.brand_name} required maxLength={80} />
          <TextField name="tagline" label="Tagline" defaultValue={s.tagline} maxLength={200} />
          <ImageField
            name="logo"
            label="Logo (opsional)"
            currentUrl={s.logo_url}
            aspect="wide"
            hint="Kosongkan untuk memakai logo resmi bawaan. Disarankan PNG transparan."
            className="sm:col-span-2"
          />
        </FormSection>

        <FormSection title="Kontak & media sosial" description="Nomor WhatsApp dipakai oleh semua tombol WhatsApp di website.">
          <TextField
            name="whatsapp_number"
            label="Nomor WhatsApp admin"
            defaultValue={s.whatsapp_number}
            placeholder="0895xxxxxxxx"
            hint="Format 08xx atau 628xx. Pastikan nomor sudah diverifikasi sebelum produksi."
          />
          <TextField name="email" label="Email" type="email" defaultValue={s.email} />
          <TextArea
            name="whatsapp_message"
            label="Pesan WhatsApp bawaan"
            defaultValue={s.whatsapp_message}
            rows={3}
            maxLength={500}
            className="sm:col-span-2"
            hint="Pesan otomatis saat pengunjung menekan tombol WhatsApp umum. Tiap layanan dapat memiliki pesan sendiri."
          />
          <TextField name="instagram_url" label="URL Instagram" defaultValue={s.instagram_url} placeholder="https://www.instagram.com/…" />
          <TextField name="tiktok_url" label="URL TikTok" defaultValue={s.tiktok_url} placeholder="https://www.tiktok.com/@…" />
          <TextField name="linkedin_url" label="URL LinkedIn" defaultValue={s.linkedin_url} placeholder="https://www.linkedin.com/…" />
          <TextField name="maps_url" label="Tautan Google Maps (opsional)" defaultValue={s.maps_url} />
          <TextArea name="address" label="Alamat / lokasi" defaultValue={s.address} rows={3} hint="Kosongkan bila belum ada lokasi resmi." />
          <TextArea name="business_hours" label="Jam layanan" defaultValue={s.business_hours} rows={3} placeholder="Senin–Jumat, 09.00–17.00 WIB" />
        </FormSection>

        <FormSection title="Beranda">
          <TextField name="hero_headline" label="Judul utama (hero)" defaultValue={s.hero_headline} maxLength={200} className="sm:col-span-2" />
          <TextArea name="hero_description" label="Deskripsi hero" defaultValue={s.hero_description} rows={3} maxLength={600} className="sm:col-span-2" />
        </FormSection>

        <FormSection title="Tentang kami">
          <TextArea name="about_intro" label="Pengantar" defaultValue={s.about_intro} rows={4} className="sm:col-span-2" />
          <TextArea name="brand_story" label="Cerita brand" defaultValue={s.brand_story} rows={6} className="sm:col-span-2" />
          <TextArea name="vision" label="Visi" defaultValue={s.vision} rows={3} className="sm:col-span-2" />
          <TextArea name="mission" label="Misi" defaultValue={s.mission} rows={5} hint={LINES_HINT} />
          <TextArea name="values_text" label="Nilai-nilai" defaultValue={s.values_text} rows={5} hint={LINES_HINT} />
        </FormSection>

        <FormSection title="Footer & informasi darurat">
          <TextArea name="footer_description" label="Deskripsi footer" defaultValue={s.footer_description} rows={3} maxLength={400} />
          <TextArea
            name="emergency_info"
            label="Informasi darurat"
            defaultValue={s.emergency_info}
            rows={4}
            hint="Ditampilkan di beranda, kontak, dan halaman layanan."
          />
        </FormSection>
      </ActionForm>
    </>
  );
}
