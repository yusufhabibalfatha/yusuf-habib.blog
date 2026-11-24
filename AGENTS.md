# Panduan Proyek: yusuf-habib.blog

## Ringkasan Proyek
- **Situs:** Website personal & blog SEO `https://yusuf-habib.blog/` (HTML statis + Tailwind CSS v4, tanpa framework SSG).
- **Build & Deploy:** `npm run build` menghasilkan `public/assets/css/output.css` dan `public/sitemap.xml` (keduanya di-gitignore dan dibangun otomatis oleh GitHub Actions saat push ke `main`).
- **Arsitektur Visual:** Tema **Vintage Scholar & Historical Gothic** (`src/input.css`). **Default wajib Light Mode** (`Ancient Parchment` `#F7F4EB`); mode gelap (`.dark`) hanya aktif jika user menekan tombol toggle (`localStorage.getItem("theme") === "dark"`).

## Profil Penulis (Untuk Sudut Pandang E-E-A-T)
- **Nama & Gelar:** Yusuf Habib Alfatha, S.Kom., Gr.
- **Pendidikan:** Alumni Sistem Informasi, Universitas Brawijaya.
- **Domisili:** Kota Tarakan.
- **Profesi:** Guru Informatika (SMP) dan Pendidikan Pancasila (SMA) di **SMP & SMA Budi Utomo Boarding School Tarakan**, sekaligus pengembang sistem web operasional sekolah dan komunitas.
- **Studi Kasus Nyata:** Lihat `public/proyek/index.html` (absensi siswa per mata pelajaran dengan ringkasan WhatsApp, presensi guru berbasis lokasi GPS, manajemen SPP, dll.) dan `public/kontak/index.html` untuk kanal kontak resmi.

## Aturan Ketat
1. **Kunci Indeks Google:** Pertahankan `<meta name="robots" content="noindex, nofollow" />` pada seluruh halaman baru serta `Disallow: /` di `public/robots.txt` sampai user secara eksplisit meminta membuka indeks.
2. **Privasi & Keamanan Data:**
   - Semua contoh nama siswa, nama guru, NISN, dan NIP pada artikel, gambar pratinjau, dan file unduhan wajib **100% fiktif**.
   - Jangan mencantumkan nominal honor/tarif proyek, keluhan internal sekolah, atau tautan aktif (`<a href>`) ke domain internal operasional sekolah (tulis sebagai teks biasa `<code>` jika perlu menyebutnya).
3. **Gaya Bahasa:** Gunakan Bahasa Indonesia natural sesama guru ("Bapak/Ibu"), spesifik, langsung ke pokok masalah, tanpa pola tulisan AI ("bukan X, melainkan Y", daftar negasi tiga kali beruntun, pembuka klise, atau tanda seru berlebihan).
4. **Schema Markup:** Gunakan `BlogPosting` dan `BreadcrumbList` untuk artikel blog. Jangan menambahkan `FAQPage` atau `HowTo` untuk mengejar rich result Google.
5. **Git Push:** Hanya jalankan `git push` ketika user memintanya.

## Workflow Artikel Blog (Otomatis di Chat Baru)
Setiap kali user memberikan **keyword artikel blog baru**, meminta **riset kompetitor Google**, meminta **draf PDF hitam-putih berkode revisi dikirim via Tailscale**, memberi **revisi berkode**, atau meminta **publish artikel ke blog**, **wajib baca dan ikuti prosedur lengkap pada skill `blog-article-workflow`**:
- `.agents/skills/blog-article-workflow/SKILL.md`
