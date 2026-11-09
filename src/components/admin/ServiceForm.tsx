import { ActionForm } from "@/components/admin/ActionForm";
import { Checkbox, FormSection, LINES_HINT, Select, TextArea, TextField } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/ImageField";
import { SERVICE_ICONS } from "@/components/site/ServiceIcon";
import { saveService } from "@/lib/admin/actions";
import type { Service } from "@/lib/types";

export function ServiceForm({ service }: { service?: Service | null }) {
  return (
    <ActionForm action={saveService} submitLabel={service ? "Simpan perubahan" : "Tambah layanan"}>
      {service && <input type="hidden" name="id" value={service.id} />}

      <FormSection title="Informasi utama">
        <TextField name="title" label="Nama layanan" defaultValue={service?.title} required maxLength={120} />
        <TextField name="slug" label="Slug URL" defaultValue={service?.slug} hint="Otomatis dari nama jika dikosongkan." />
        <TextArea
          name="summary"
          label="Ringkasan (untuk kartu)"
          defaultValue={service?.summary}
          required
          rows={2}
          maxLength={400}
          className="sm:col-span-2"
        />
        <TextArea name="description" label="Deskripsi lengkap" defaultValue={service?.description} rows={6} className="sm:col-span-2" />
        <TextArea
          name="items"
          label="Rincian / sub-layanan"
          defaultValue={service?.items}
          rows={5}
          hint={LINES_HINT}
          className="sm:col-span-2"
        />
        <Select
          name="icon"
          label="Ikon"
          defaultValue={service?.icon ?? "leaf"}
          options={Object.entries(SERVICE_ICONS).map(([value, { label }]) => ({ value, label }))}
        />
        <TextField name="sort_order" label="Urutan" type="number" defaultValue={service?.sort_order ?? 0} />
        <ImageField name="image" label="Ilustrasi (opsional)" currentUrl={service?.image_url} className="sm:col-span-2" />
      </FormSection>

      <FormSection
        title="Informasi praktis (opsional)"
        description="Isi hanya jika sudah dikonfirmasi oleh GROWTHEDUH. Kosongkan untuk menyembunyikan."
      >
        <TextField name="price_info" label="Biaya" defaultValue={service?.price_info} />
        <TextField name="duration_info" label="Durasi" defaultValue={service?.duration_info} />
        <TextField name="location_info" label="Lokasi / format" defaultValue={service?.location_info} className="sm:col-span-2" />
      </FormSection>

      <FormSection title="WhatsApp">
        <TextArea
          name="whatsapp_message"
          label="Pesan WhatsApp khusus layanan"
          defaultValue={service?.whatsapp_message}
          rows={3}
          maxLength={500}
          className="sm:col-span-2"
          hint="Kosongkan untuk memakai pesan otomatis yang menyebut nama layanan."
        />
      </FormSection>

      <Checkbox name="is_published" label="Tampilkan di website" defaultChecked={service?.is_published ?? true} />
    </ActionForm>
  );
}
