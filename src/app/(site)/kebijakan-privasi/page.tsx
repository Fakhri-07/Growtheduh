import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { getSiteSettings } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi website GROWTHEDUH: data apa yang dikumpulkan, bagaimana digunakan, dan hak Anda.",
  alternates: { canonical: "/kebijakan-privasi" },
};

// NOTE for GROWTHEDUH: this policy describes how the website is built. Please
// have it reviewed by your legal adviser (e.g. against UU No. 27/2022 PDP)
// before launch, and update it if your data practices change.
export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const contact = settings.email ?? "admin GROWTHEDUH";

  return (
    <LegalPage
      title="Kebijakan Privasi"
      updated="9 November 2026"
      intro={`${settings.brand_name} menghargai privasi Anda. Halaman ini menjelaskan data yang dikumpulkan melalui website ini dan bagaimana data tersebut digunakan.`}
    >
      <h2>1. Ruang lingkup</h2>
      <p>
        Kebijakan ini berlaku untuk website {settings.brand_name}. Website ini adalah platform informasi mengenai
        layanan, profil profesional, dan artikel edukatif. Website ini <strong>tidak</strong> digunakan untuk menyimpan
        catatan konseling, hasil asesmen, maupun diagnosis klien.
      </p>

      <h2>2. Data yang kami kumpulkan</h2>
      <ul>
        <li>
          <strong>Formulir ulasan:</strong> nama tampilan atau nama samaran, rating, isi ulasan, layanan yang digunakan
          (opsional), pernyataan bahwa Anda pernah menggunakan layanan (opsional), dan persetujuan publikasi. Kami tidak
          meminta nama lengkap, nomor telepon, alamat email, maupun informasi kesehatan pada formulir ini.
        </li>
        <li>
          <strong>Komunikasi WhatsApp dan email:</strong> ketika Anda menghubungi kami melalui WhatsApp atau email,
          percakapan tersebut berlangsung di platform pihak ketiga dan tunduk pada kebijakan privasi masing-masing
          platform.
        </li>
        <li>
          <strong>Data teknis:</strong> penyedia hosting dapat mencatat data teknis standar (misalnya alamat IP dan
          jenis peramban) untuk keperluan keamanan dan operasional.
        </li>
      </ul>

      <h2>3. Penggunaan data</h2>
      <p>
        Data ulasan digunakan untuk ditinjau dan, jika disetujui, ditampilkan secara publik dengan nama tampilan yang
        Anda pilih. Ulasan yang tidak disetujui tidak akan dipublikasikan. Kami tidak menjual data Anda kepada pihak
        lain.
      </p>

      <h2>4. Informasi sensitif</h2>
      <p>
        Mohon tidak menuliskan informasi pribadi atau kondisi kesehatan secara detail pada formulir publik. Jika ulasan
        memuat informasi yang dapat mengidentifikasi seseorang atau informasi sensitif, kami berhak tidak menampilkan
        atau menghapusnya.
      </p>

      <h2>5. Cookie</h2>
      <p>
        Website publik tidak menggunakan cookie pelacakan iklan. Cookie teknis digunakan untuk login area admin dan
        untuk mencegah pengiriman ulasan berulang dalam waktu singkat.
      </p>

      <h2>6. Penyimpanan dan keamanan</h2>
      <p>
        Data disimpan pada layanan basis data pihak ketiga (Supabase) dengan pembatasan akses. Hanya admin
        {` ${settings.brand_name}`} yang berwenang dapat meninjau ulasan yang belum dipublikasikan.
      </p>

      <h2>7. Hak Anda</h2>
      <p>
        Anda dapat meminta agar ulasan yang pernah Anda kirim diperbaiki atau dihapus dengan menghubungi kami melalui{" "}
        {settings.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : contact}. Sertakan informasi yang
        cukup agar kami dapat menemukan ulasan tersebut.
      </p>

      <h2>8. Perubahan kebijakan</h2>
      <p>Kebijakan ini dapat diperbarui sewaktu-waktu. Tanggal pembaruan terakhir tercantum di bagian atas halaman.</p>
    </LegalPage>
  );
}
