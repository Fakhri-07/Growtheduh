import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { getSiteSettings } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Syarat Layanan",
  description: "Syarat penggunaan website GROWTHEDUH.",
  alternates: { canonical: "/syarat-layanan" },
};

// NOTE for GROWTHEDUH: please have these terms reviewed by your legal adviser.
export default async function TermsPage() {
  const settings = await getSiteSettings();
  const brand = settings.brand_name;

  return (
    <LegalPage
      title="Syarat Layanan"
      updated="9 November 2026"
      intro={`Dengan mengakses website ${brand}, Anda menyetujui syarat penggunaan berikut.`}
    >
      <h2>1. Sifat informasi</h2>
      <p>
        Seluruh konten di website ini, termasuk artikel, bersifat <strong>edukatif dan informatif</strong>. Konten
        tersebut tidak menggantikan konsultasi, asesmen, diagnosis, maupun penanganan oleh tenaga profesional.
      </p>

      <h2>2. Bukan layanan darurat</h2>
      <p>
        Website dan kanal komunikasi {brand} bukan layanan krisis. Jika Anda atau orang di sekitar Anda berada dalam
        kondisi darurat, segera hubungi <strong>112</strong>, datangi IGD rumah sakit terdekat, atau hubungi layanan
        kesehatan jiwa resmi di wilayah Anda.
      </p>

      <h2>3. Hasil layanan</h2>
      <p>
        Setiap proses konseling dan pendampingan bersifat individual. {brand} tidak menjanjikan atau menjamin hasil
        tertentu dari layanan yang diberikan.
      </p>

      <h2>4. Informasi layanan</h2>
      <p>
        Informasi mengenai jenis layanan, biaya, jadwal, dan lokasi dapat berubah. Informasi terbaru dapat diperoleh
        langsung melalui admin {brand}.
      </p>

      <h2>5. Ulasan pengguna</h2>
      <ul>
        <li>Ulasan harus berdasarkan pengalaman pribadi yang jujur dan tidak memuat informasi pribadi pihak lain.</li>
        <li>Ulasan tidak boleh mengandung ujaran kebencian, fitnah, promosi, atau konten yang melanggar hukum.</li>
        <li>{brand} berhak meninjau, menolak, atau menghapus ulasan yang tidak sesuai ketentuan.</li>
        <li>Label “klien terverifikasi” hanya diberikan setelah verifikasi oleh admin.</li>
      </ul>

      <h2>6. Hak kekayaan intelektual</h2>
      <p>
        Logo, nama, dan konten website ini merupakan milik {brand}. Konten artikel boleh dibagikan dengan mencantumkan
        tautan ke sumber aslinya.
      </p>

      <h2>7. Tautan pihak ketiga</h2>
      <p>
        Website ini memuat tautan ke platform pihak ketiga seperti WhatsApp, Instagram, TikTok, dan LinkedIn. Penggunaan
        platform tersebut tunduk pada ketentuan masing-masing.
      </p>

      <h2>8. Perubahan</h2>
      <p>Syarat ini dapat diperbarui sewaktu-waktu. Tanggal pembaruan terakhir tercantum di bagian atas halaman.</p>
    </LegalPage>
  );
}
