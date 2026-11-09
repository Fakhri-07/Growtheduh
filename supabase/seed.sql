-- =============================================================================
-- GROWTHEDUH — initial data (approved brand information only)
-- Safe to re-run: uses ON CONFLICT.
--
-- Not seeded on purpose: testimonials (must come from real clients), published
-- articles, biographies, education, credentials, prices, addresses.
-- =============================================================================

insert into public.site_settings (
  id, brand_name, tagline, whatsapp_number, whatsapp_message, email,
  instagram_url, tiktok_url, linkedin_url,
  hero_headline, hero_description, about_intro, vision,
  footer_description, emergency_info
) values (
  1,
  'GROWTHEDUH',
  'Tempat Bertumbuh, Memahami Diri, dan Menemukan Solusi Bersama.',
  '085111351501', -- from brand booklet: VERIFY before production
  'Halo GROWTHEDUH, saya ingin bertanya mengenai layanan konsultasi psikologi. Boleh saya mendapatkan informasi lebih lanjut?',
  'growtheduh@gmail.com',
  'https://www.instagram.com/growtheduh',
  'https://www.tiktok.com/@growtheduh_offi',
  null, -- LinkedIn "Growtheduh": add the exact page URL in Admin > Pengaturan
  'Tempat Bertumbuh, Memahami Diri, dan Menemukan Solusi Bersama.',
  'GROWTHEDUH hadir sebagai platform pengembangan diri dan layanan psikologis yang membantu individu bertumbuh, memahami diri, serta menemukan solusi terbaik dalam menghadapi berbagai tantangan kehidupan.',
  'GROWTHEDUH hadir sebagai platform pengembangan diri dan layanan psikologis yang membantu individu bertumbuh, memahami diri, serta menemukan solusi terbaik dalam menghadapi berbagai tantangan kehidupan.',
  'Membangun budaya peduli kesehatan mental melalui edukasi dan layanan psikologi yang inklusif dan berbasis ilmu.',
  'Platform pengembangan diri dan layanan psikologis untuk membantu Anda bertumbuh, memahami diri, dan menemukan solusi bersama.',
  'Jika Anda atau orang di sekitar Anda berada dalam kondisi darurat atau memiliki pikiran untuk menyakiti diri sendiri, segera hubungi layanan darurat 112, datangi IGD rumah sakit terdekat, atau hubungi layanan kesehatan jiwa resmi di wilayah Anda. Website ini bukan layanan krisis.'
) on conflict (id) do nothing;

-- Main professional profile. Portrait is served from /public until an admin
-- uploads one to Supabase Storage. Biography/education/etc. left empty.
insert into public.team_members (slug, full_name, portrait_url, is_featured, is_published, sort_order)
values ('tri-wisda', 'Tri Wisda, S.Psi., M.Psi.', '/images/tri-wisda.jpg', true, true, 1)
on conflict (slug) do nothing;

insert into public.services (slug, title, summary, description, items, icon, whatsapp_message, sort_order) values
(
  'konseling-profesional', 'Konseling Profesional',
  'Ruang aman untuk bercerita dan memahami diri, mulai dari tumbuh kembang anak hingga tantangan remaja dan dewasa.',
  'Layanan konseling yang mendampingi individu dalam memahami permasalahan yang sedang dihadapi dan menemukan langkah yang sesuai untuk bertumbuh.',
  E'Konseling tumbuh kembang anak / ABK\nKonseling remaja dan dewasa\nKonseling pendidikan dan karir\nPendampingan kesehatan mental dan pengembangan diri',
  'message-circle-heart',
  'Halo GROWTHEDUH, saya ingin bertanya mengenai layanan Konseling Profesional. Boleh saya mendapatkan informasi lebih lanjut?',
  1
),
(
  'konseling-pernikahan-dan-keluarga', 'Konseling Pernikahan dan Keluarga',
  'Pendampingan bagi pasangan dan keluarga untuk membangun komunikasi serta hubungan yang lebih sehat.',
  'Layanan pendampingan yang membantu pasangan dan keluarga memahami dinamika hubungan, memperbaiki komunikasi, dan menata pola pengasuhan.',
  E'Pendampingan pasangan dan keluarga\nKomunikasi dan pengasuhan\nMembangun hubungan yang lebih sehat',
  'users',
  'Halo GROWTHEDUH, saya ingin bertanya mengenai layanan Konseling Pernikahan dan Keluarga. Boleh saya mendapatkan informasi lebih lanjut?',
  2
),
(
  'pendampingan-anak-berkebutuhan-khusus', 'Pendampingan Anak Berkebutuhan Khusus',
  'Asesmen dan pendampingan untuk memahami potensi serta kebutuhan perkembangan setiap anak.',
  'Layanan pendampingan bagi anak berkebutuhan khusus (ABK) dan keluarganya untuk memahami potensi serta kebutuhan perkembangan anak.',
  E'Asesmen dan pendampingan\nMemahami potensi dan kebutuhan perkembangan\nLayanan shadow teacher (sesuai ketersediaan)',
  'sprout',
  'Halo GROWTHEDUH, saya ingin bertanya mengenai layanan Pendampingan Anak Berkebutuhan Khusus. Boleh saya mendapatkan informasi lebih lanjut?',
  3
),
(
  'layanan-asesmen-psikologi', 'Layanan Asesmen Psikologi',
  'Asesmen untuk mengenali kondisi, minat, bakat, dan kesiapan sebagai dasar langkah selanjutnya.',
  'Layanan asesmen psikologi untuk membantu memperoleh gambaran yang lebih jelas mengenai kondisi, potensi, dan kebutuhan individu.',
  E'Asesmen ABK\nSkrining tumbuh kembang anak\nMinat bakat dan pengembangan diri\nTes kesiapan sekolah TK dan SD',
  'clipboard-check',
  'Halo GROWTHEDUH, saya ingin bertanya mengenai Layanan Asesmen Psikologi. Boleh saya mendapatkan informasi lebih lanjut?',
  4
),
(
  'konseling-online-dan-offline', 'Konseling Online dan Offline',
  'Pilihan sesi konseling secara daring maupun tatap muka sesuai kebutuhan dan kenyamanan Anda.',
  'Layanan konseling dapat dilakukan secara online maupun offline. Silakan hubungi admin untuk informasi ketersediaan jadwal dan format sesi.',
  null,
  'monitor-smartphone',
  'Halo GROWTHEDUH, saya ingin bertanya mengenai Konseling Online dan Offline. Boleh saya mendapatkan informasi lebih lanjut?',
  5
),
(
  'layanan-hrd', 'Layanan HRD',
  'Dukungan psikologi untuk kebutuhan organisasi dan pengembangan sumber daya manusia.',
  'Layanan psikologi untuk mendukung kebutuhan organisasi terkait sumber daya manusia. Detail cakupan layanan dapat ditanyakan langsung kepada admin.',
  null,
  'briefcase',
  'Halo GROWTHEDUH, saya ingin bertanya mengenai Layanan HRD. Boleh saya mendapatkan informasi lebih lanjut?',
  6
)
on conflict (slug) do nothing;

insert into public.article_categories (name, slug, sort_order) values
  ('Kesehatan Mental', 'kesehatan-mental', 1),
  ('Tumbuh Kembang Anak', 'tumbuh-kembang-anak', 2),
  ('Parenting', 'parenting', 3),
  ('Pengembangan Diri', 'pengembangan-diri', 4),
  ('Hubungan dan Keluarga', 'hubungan-dan-keluarga', 5),
  ('Pendidikan dan Karir', 'pendidikan-dan-karir', 6)
on conflict (slug) do nothing;

insert into public.faqs (question, answer, sort_order)
select v.question, v.answer, v.sort_order
from (values
  ('Bagaimana cara memulai konsultasi dengan GROWTHEDUH?',
   'Silakan hubungi admin GROWTHEDUH melalui tombol WhatsApp di website ini. Admin akan membantu menjelaskan layanan yang sesuai dengan kebutuhan Anda serta informasi jadwal yang tersedia.', 1),
  ('Apakah layanan tersedia secara online dan offline?',
   'Ya. GROWTHEDUH menyediakan pilihan konseling secara online maupun offline. Ketersediaan format sesi dapat ditanyakan langsung kepada admin.', 2),
  ('Apakah cerita dan data saya dijaga kerahasiaannya?',
   'GROWTHEDUH menjunjung tinggi kerahasiaan. Informasi yang Anda sampaikan dalam sesi layanan tidak dipublikasikan. Mohon tidak menuliskan informasi pribadi atau kondisi kesehatan secara detail di formulir publik seperti ulasan.', 3),
  ('Berapa biaya layanan di GROWTHEDUH?',
   'Informasi biaya bergantung pada jenis layanan yang dibutuhkan. Silakan hubungi admin melalui WhatsApp untuk mendapatkan informasi terbaru.', 4),
  ('Apakah artikel di website ini dapat menggantikan konsultasi?',
   'Tidak. Artikel di website ini bersifat edukatif dan tidak menggantikan konsultasi dengan tenaga profesional. Untuk kebutuhan yang spesifik, silakan berkonsultasi secara langsung.', 5)
) as v(question, answer, sort_order)
where not exists (select 1 from public.faqs f where f.question = v.question);

-- A DRAFT formatting guide for admins (not public; delete when no longer needed).
insert into public.articles (slug, title, excerpt, content, status, author_name)
values (
  'contoh-panduan-format-artikel',
  '[CONTOH] Panduan Format Artikel',
  'Draf contoh untuk admin: cara menulis artikel dengan format Markdown. Jangan dipublikasikan.',
  E'Ini adalah **draf contoh** untuk membantu admin memahami format penulisan. Hapus artikel ini setelah tidak dibutuhkan.\n\n## Subjudul\n\nGunakan `##` untuk subjudul dan `###` untuk sub-subjudul.\n\n- Daftar poin menggunakan tanda minus\n- Teks **tebal** dan *miring*\n\n> Kutipan ditulis dengan tanda lebih besar (>).\n\n[Teks tautan](https://example.com)\n\nSemua artikel edukatif perlu ditinjau oleh tim GROWTHEDUH sebelum dipublikasikan.',
  'draft',
  'Tim GROWTHEDUH'
) on conflict (slug) do nothing;
