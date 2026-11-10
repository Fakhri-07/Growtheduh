import type { ArticleCategory, Faq, Service, SiteSettings, TeamMember } from "@/lib/types";

/**
 * Approved initial brand content (source: GROWTHEDUH brand brief/booklet).
 *
 * Used ONLY as a fallback while Supabase is not configured (local development)
 * and mirrored in supabase/seed.sql. Once the database is connected, every
 * value below is managed from the admin dashboard.
 *
 * Fields that GROWTHEDUH has not supplied (biography, education, prices,
 * address, business hours, …) are intentionally left empty — never invented.
 */

export const DEFAULT_SETTINGS: SiteSettings = {
  brand_name: "GROWTHEDUH",
  tagline: "Tempat Bertumbuh, Memahami Diri, dan Menemukan Solusi Bersama.",
  logo_url: null,
  // Consultation WhatsApp number confirmed by GROWTHEDUH.
  whatsapp_number: "089524141255",
  whatsapp_message:
    "Halo GROWTHEDUH, saya ingin bertanya mengenai layanan konsultasi psikologi. Boleh saya mendapatkan informasi lebih lanjut?",
  email: "growtheduh@gmail.com",
  instagram_url: "https://www.instagram.com/growtheduh",
  tiktok_url: "https://www.tiktok.com/@growtheduh_offi",
  linkedin_url: null,
  address: null,
  maps_url: null,
  business_hours: null,
  hero_headline: "Tempat Bertumbuh, Memahami Diri, dan Menemukan Solusi Bersama.",
  hero_description:
    "GROWTHEDUH hadir sebagai platform pengembangan diri dan layanan psikologis yang membantu individu bertumbuh, memahami diri, serta menemukan solusi terbaik dalam menghadapi berbagai tantangan kehidupan.",
  about_intro:
    "GROWTHEDUH hadir sebagai platform pengembangan diri dan layanan psikologis yang membantu individu bertumbuh, memahami diri, serta menemukan solusi terbaik dalam menghadapi berbagai tantangan kehidupan.",
  brand_story: null,
  vision:
    "Membangun budaya peduli kesehatan mental melalui edukasi dan layanan psikologi yang inklusif dan berbasis ilmu.",
  mission: null,
  values_text: null,
  footer_description:
    "Platform pengembangan diri dan layanan psikologis untuk membantu Anda bertumbuh, memahami diri, dan menemukan solusi bersama.",
  emergency_info:
    "Jika Anda atau orang di sekitar Anda berada dalam kondisi darurat atau memiliki pikiran untuk menyakiti diri sendiri, segera hubungi layanan darurat 112, datangi IGD rumah sakit terdekat, atau hubungi layanan kesehatan jiwa resmi di wilayah Anda. Website ini bukan layanan krisis.",
};

export const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "default-tri-wisda",
    slug: "tri-wisda",
    full_name: "Tri Wisda, S.Psi., M.Psi.",
    // Confirmed by GROWTHEDUH.
    professional_title: "Psikolog (Kekhususan Klinis Anak)",
    portrait_url: "/images/tri-wisda.jpg",
    short_bio: null,
    biography: null,
    education: null,
    experience: null,
    specializations: null,
    qualifications: null,
    linkedin_url: null,
    profile_url: null,
    is_featured: true,
    is_published: true,
    sort_order: 1,
  },
];

export const DEFAULT_SERVICES: Service[] = [
  {
    id: "default-konseling-profesional",
    slug: "konseling-profesional",
    title: "Konseling Profesional",
    summary:
      "Ruang aman untuk bercerita dan memahami diri, mulai dari tumbuh kembang anak hingga tantangan remaja dan dewasa.",
    description:
      "Layanan konseling yang mendampingi individu dalam memahami permasalahan yang sedang dihadapi dan menemukan langkah yang sesuai untuk bertumbuh.",
    items:
      "Konseling tumbuh kembang anak / ABK\nKonseling remaja dan dewasa\nKonseling pendidikan dan karir\nPendampingan kesehatan mental dan pengembangan diri",
    icon: "message-circle-heart",
    image_url: null,
    whatsapp_message:
      "Halo GROWTHEDUH, saya ingin bertanya mengenai layanan Konseling Profesional. Boleh saya mendapatkan informasi lebih lanjut?",
    price_info: null,
    duration_info: null,
    location_info: null,
    is_published: true,
    sort_order: 1,
  },
  {
    id: "default-konseling-pernikahan-keluarga",
    slug: "konseling-pernikahan-dan-keluarga",
    title: "Konseling Pernikahan dan Keluarga",
    summary:
      "Pendampingan bagi pasangan dan keluarga untuk membangun komunikasi serta hubungan yang lebih sehat.",
    description:
      "Layanan pendampingan yang membantu pasangan dan keluarga memahami dinamika hubungan, memperbaiki komunikasi, dan menata pola pengasuhan.",
    items:
      "Pendampingan pasangan dan keluarga\nKomunikasi dan pengasuhan\nMembangun hubungan yang lebih sehat",
    icon: "users",
    image_url: null,
    whatsapp_message:
      "Halo GROWTHEDUH, saya ingin bertanya mengenai layanan Konseling Pernikahan dan Keluarga. Boleh saya mendapatkan informasi lebih lanjut?",
    price_info: null,
    duration_info: null,
    location_info: null,
    is_published: true,
    sort_order: 2,
  },
  {
    id: "default-pendampingan-abk",
    slug: "pendampingan-anak-berkebutuhan-khusus",
    title: "Pendampingan Anak Berkebutuhan Khusus",
    summary:
      "Asesmen dan pendampingan untuk memahami potensi serta kebutuhan perkembangan setiap anak.",
    description:
      "Layanan pendampingan bagi anak berkebutuhan khusus (ABK) dan keluarganya untuk memahami potensi serta kebutuhan perkembangan anak.",
    items:
      "Asesmen dan pendampingan\nMemahami potensi dan kebutuhan perkembangan\nLayanan shadow teacher (sesuai ketersediaan)",
    icon: "sprout",
    image_url: null,
    whatsapp_message:
      "Halo GROWTHEDUH, saya ingin bertanya mengenai layanan Pendampingan Anak Berkebutuhan Khusus. Boleh saya mendapatkan informasi lebih lanjut?",
    price_info: null,
    duration_info: null,
    location_info: null,
    is_published: true,
    sort_order: 3,
  },
  {
    id: "default-asesmen-psikologi",
    slug: "layanan-asesmen-psikologi",
    title: "Layanan Asesmen Psikologi",
    summary:
      "Asesmen untuk mengenali kondisi, minat, bakat, dan kesiapan sebagai dasar langkah selanjutnya.",
    description:
      "Layanan asesmen psikologi untuk membantu memperoleh gambaran yang lebih jelas mengenai kondisi, potensi, dan kebutuhan individu.",
    items:
      "Asesmen ABK\nSkrining tumbuh kembang anak\nMinat bakat dan pengembangan diri\nTes kesiapan sekolah TK dan SD",
    icon: "clipboard-check",
    image_url: null,
    whatsapp_message:
      "Halo GROWTHEDUH, saya ingin bertanya mengenai Layanan Asesmen Psikologi. Boleh saya mendapatkan informasi lebih lanjut?",
    price_info: null,
    duration_info: null,
    location_info: null,
    is_published: true,
    sort_order: 4,
  },
  {
    id: "default-online-offline",
    slug: "konseling-online-dan-offline",
    title: "Konseling Online dan Offline",
    summary:
      "Pilihan sesi konseling secara daring maupun tatap muka sesuai kebutuhan dan kenyamanan Anda.",
    description:
      "Layanan konseling dapat dilakukan secara online maupun offline. Silakan hubungi admin untuk informasi ketersediaan jadwal dan format sesi.",
    items: null,
    icon: "monitor-smartphone",
    image_url: null,
    whatsapp_message:
      "Halo GROWTHEDUH, saya ingin bertanya mengenai Konseling Online dan Offline. Boleh saya mendapatkan informasi lebih lanjut?",
    price_info: null,
    duration_info: null,
    location_info: null,
    is_published: true,
    sort_order: 5,
  },
  {
    id: "default-layanan-hrd",
    slug: "layanan-hrd",
    title: "Layanan HRD",
    summary:
      "Dukungan psikologi untuk kebutuhan organisasi dan pengembangan sumber daya manusia.",
    description:
      "Layanan psikologi untuk mendukung kebutuhan organisasi terkait sumber daya manusia. Detail cakupan layanan dapat ditanyakan langsung kepada admin.",
    items: null,
    icon: "briefcase",
    image_url: null,
    whatsapp_message:
      "Halo GROWTHEDUH, saya ingin bertanya mengenai Layanan HRD. Boleh saya mendapatkan informasi lebih lanjut?",
    price_info: null,
    duration_info: null,
    location_info: null,
    is_published: true,
    sort_order: 6,
  },
];

export const DEFAULT_CATEGORIES: ArticleCategory[] = [
  ["Kesehatan Mental", "kesehatan-mental"],
  ["Tumbuh Kembang Anak", "tumbuh-kembang-anak"],
  ["Parenting", "parenting"],
  ["Pengembangan Diri", "pengembangan-diri"],
  ["Hubungan dan Keluarga", "hubungan-dan-keluarga"],
  ["Pendidikan dan Karir", "pendidikan-dan-karir"],
].map(([name, slug], i) => ({
  id: `default-cat-${slug}`,
  name,
  slug,
  description: null,
  sort_order: i + 1,
}));

export const DEFAULT_FAQS: Faq[] = [
  {
    id: "default-faq-1",
    question: "Bagaimana cara memulai konsultasi dengan GROWTHEDUH?",
    answer:
      "Silakan hubungi admin GROWTHEDUH melalui tombol WhatsApp di website ini. Admin akan membantu menjelaskan layanan yang sesuai dengan kebutuhan Anda serta informasi jadwal yang tersedia.",
    is_published: true,
    sort_order: 1,
  },
  {
    id: "default-faq-2",
    question: "Apakah layanan tersedia secara online dan offline?",
    answer:
      "Ya. GROWTHEDUH menyediakan pilihan konseling secara online maupun offline. Ketersediaan format sesi dapat ditanyakan langsung kepada admin.",
    is_published: true,
    sort_order: 2,
  },
  {
    id: "default-faq-3",
    question: "Apakah cerita dan data saya dijaga kerahasiaannya?",
    answer:
      "GROWTHEDUH menjunjung tinggi kerahasiaan. Informasi yang Anda sampaikan dalam sesi layanan tidak dipublikasikan. Mohon tidak menuliskan informasi pribadi atau kondisi kesehatan secara detail di formulir publik seperti ulasan.",
    is_published: true,
    sort_order: 3,
  },
  {
    id: "default-faq-4",
    question: "Berapa biaya layanan di GROWTHEDUH?",
    answer:
      "Informasi biaya bergantung pada jenis layanan yang dibutuhkan. Silakan hubungi admin melalui WhatsApp untuk mendapatkan informasi terbaru.",
    is_published: true,
    sort_order: 4,
  },
  {
    id: "default-faq-5",
    question: "Apakah artikel di website ini dapat menggantikan konsultasi?",
    answer:
      "Tidak. Artikel di website ini bersifat edukatif dan tidak menggantikan konsultasi dengan tenaga profesional. Untuk kebutuhan yang spesifik, silakan berkonsultasi secara langsung.",
    is_published: true,
    sort_order: 5,
  },
];
