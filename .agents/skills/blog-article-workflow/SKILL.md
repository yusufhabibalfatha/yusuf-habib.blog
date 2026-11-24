---
name: blog-article-workflow
description: >-
  Workflow end-to-end untuk membuat artikel SEO di yusuf-habib.blog: riset halaman
  ranking Google (SERP) dan audit kompetitor, penyusunan draf artikel dalam PDF
  hitam-putih berkode revisi, pengiriman PDF ke iphone-xs via Tailscale Taildrop,
  penanganan revisi cepat berbasis kode, hingga publikasi HTML + aset Excel/Word/PDF/WebP
  dan push ke GitHub. Gunakan skill ini setiap kali user memberi keyword artikel blog baru,
  meminta analisis keyword, meminta kirim draf PDF ke Tailscale, mengirim kode revisi,
  atau meminta publish artikel untuk yusuf-habib.blog.
---

# Blog Article Workflow (`yusuf-habib.blog`)

Prosedur baku dari riset keyword hingga artikel terbit untuk `yusuf-habib.blog`.

## Tahap 1 — Riset SERP Google & Audit Kompetitor

Jalankan tahap ini setiap kali user memberikan keyword target baru.

1. **Cek artikel yang sudah ada** di `public/blog/` untuk memetakan klaster topik, mencegah *keyword cannibalization*, dan merencanakan *internal link* dua arah.
2. **Riset pencarian Google (`search_web`)** secara paralel (4–5 kueri):
   - Keyword utama persis dan variasinya.
   - Variasi niat unduhan (`excel word pdf download`).
   - Pengecualian situs dokumen terkunci (`-site:scribd.com -site:slideshare.net`) untuk melihat blog kompetitor aktual.
   - Konteks teknis/rumus Excel atau adaptasi jenjang (PAUD/SD/SMP/SMA/SMK/Madrasah).
3. **Audit halaman publik yang muncul di SERP:**
   - Resolve URL redirect hasil pencarian jika perlu, lalu periksa halaman publik yang tidak memakai anti-bot/CAPTCHA (jangan pernah mencoba melewati CAPTCHA atau paywall).
   - Catat fakta teramati: tahun artikel, kisaran jumlah kata, keberadaan file unduhan langsung vs redirect Google Drive/safelink/tanpa file, keberadaan iklan AdSense, dan mutu konten.
4. **Analisis *Split Intent* & *Information Gain*:**
   - Cek apakah keyword memiliki lebih dari satu makna di SERP. Jika ada *split intent* atau potensi bentrok dengan artikel yang sudah ada di `public/blog/`, tawarkan opsi pemisahan fokus yang jelas.
   - Tentukan nilai tambah nyata (*information gain*) yang tidak dimiliki kompetitor: unduhan 1-klik polos hitam-putih tanpa login, 2 paket format pelengkap, rumus Excel siap pakai yang akurat, serta sudut pandang lapangan nyata dari `public/proyek/index.html`.
5. **Sajikan ringkasan riset ke user** dalam tabel singkat:
   - Kondisi kompetitor di Google saat ini.
   - Posisi artikel di klaster blog & pencegahan kanibalisasi.
   - Pemetaan *search intent* & rencana paket file unduhan.
   - Usulan URL slug, Title Tag, H1, related keywords, dan alur artikel.
   - Tanyakan persetujuan konsep/opsi sebelum membuat draf PDF (kecuali user dari awal langsung meminta *"analisis sekaligus buat dan kirim pdf"*).

---

## Tahap 2 — Buat Draf PDF Hitam-Putih Berkode Revisi & Kirim via Tailscale

Jalankan setelah konsep disetujui (atau jika user langsung meminta draf PDF).

1. **Standar penulisan:**
   - Baca skill `copywriting` (aturan anti-AI-tells) jika belum dimuat di sesi aktif.
   - Tulis dengan sudut pandang guru aktif (`SMP & SMA Budi Utomo Boarding School Tarakan`), bahasa Indonesia natural ("Bapak/Ibu"), padat, konkret, tanpa pola "bukan X, melainkan Y", tanpa daftar negasi 3x, tanpa pembuka klise, dan tanpa tanda seru di paragraf isi.
   - Pastikan nomor baris dan huruf kolom rumus Excel di bagian `[T4]` persis sama dengan rancangan `.xlsx` yang akan dibuat di Tahap 4.
2. **Gunakan template HTML hitam-putih:**
   - Ambil kerangka CSS dan struktur dari [references/draft-pdf-template.html](./references/draft-pdf-template.html).
   - **Wajib murni hitam-putih / tanpa warna** (hanya `#000000`, `#222222`, `#444444`, `#ffffff`).
   - **Wajib beri kode kotak hitam unik di setiap bagian** agar user cukup menyebut kode saat merevisi:
     - `[M1]`–`[M5]`: URL, Title Tag, Meta Description, Keyword, Kategori/Schema/Robots.
     - `[H1]`, `[P1]`–`[P2]`, `[K1]` (kotak jembatan klaster), `[G1]` (rencana gambar WebP).
     - `[1.0]`–`[1.4]`, `[T1]`, `[T2]`: Paket 1 + mockup tabel, Paket 2 + mockup tabel, Google Sheets, Salin Tabel HTML 1-Klik.
     - `[2.0]`, `[T3]`: Tabel perbandingan format/dokumen.
     - `[3.0]`–`[3.2]`: Kelebihan (polos hemat tinta) & kekurangan (tanpa kop + cara menambah kop).
     - `[4.0]`, `[T4]`, `[4.1]`: Kode status, tabel rumus Excel otomatis, dan penyesuaian jenjang.
     - `[5.0]`–`[5.2]`: Catatan lapangan E-E-A-T nyata + tautan ke `/proyek/` dan `/kontak/`.
     - `[6.0]`, `[Q1]`–`[Q4]`: FAQ.
     - `[L1]`–`[L2]`: Daftar file aset unduhan & rencana internal link dua arah.
3. **Simpan file draf di folder scratch percakapan** (`<appDataDir>/brain/<conversation-id>/scratch/draft-<slug>.html` dan `.pdf`). Jangan simpan draf review ke dalam repo git.
4. **Render PDF & WAJIB inspeksi visual sebelum dikirim:**
   - Jalankan helper [scripts/render_and_send_pdf.py](./scripts/render_and_send_pdf.py):
     ```bash
     python3 .agents/skills/blog-article-workflow/scripts/render_and_send_pdf.py \
       --html "<scratch>/draft-<slug>.html" \
       --pdf "<scratch>/draft-<slug>.pdf"
     ```
   - Baca seluruh halaman PDF dengan `read_file`. Periksa:
     - Murni hitam-putih tanpa warna.
     - Tidak ada tabel yang terbelah di tengah baris (`tr`) atau terpisah dari judul `[T...]`.
     - Tidak ada heading yatim di bagian bawah halaman.
     - Tidak ada halaman terakhir yang hanya berisi 1 kotak kecil.
     - Nama file unduhan konsisten antara `[1.3]` dan `[L1]`.
   - Jika ada cacat tata letak, perbaiki HTML dan render ulang sebelum dikirim.
5. **Kirim ke iPhone XS via Tailscale Taildrop:**
   ```bash
   python3 .agents/skills/blog-article-workflow/scripts/render_and_send_pdf.py \
     --send "<scratch>/draft-<slug>.pdf" \
     --target iphone-xs
   ```
   - Jika `iphone-xs` terdeteksi **offline / timeout**, laporkan jelas ke user bahwa PDF sudah siap di Mac dan minta user menyalakan Tailscale di iPhone XS lalu membalas **"kirim ulang"**.
   - Sertakan ringkasan daftar kode (`[M1]`–`[L2]`) dan tautan `file://` PDF dalam jawaban ke user.

---

## Tahap 3 — Revisi Cepat Berbasis Kode

Jika user mengirim revisi (contoh: `"[H1] ganti jadi ..."`, `"[T1] tambah kolom ..."`, `"[Q3] hapus"`):

1. Ubah **hanya** bagian yang disebut kodenya (plus penyesuaian minimum agar konsisten, misalnya jika nama kolom atau baris berubah).
2. Render ulang PDF, inspeksi visual halaman yang berubah dengan `read_file`, lalu kirim ulang ke `iphone-xs` via Tailscale.

---

## Tahap 4 — Publikasi ke Web (`yusuf-habib.blog`) & Push GitHub

Jalankan **hanya** setelah user menyetujui draf (misalnya: *"oke publish dan push github"*).

1. **Produksi seluruh aset unduhan (100% data fiktif, polos hitam-putih):**
   - Simpan file unduhan di `public/assets/downloads/<folder-slug>/`:
     - `.docx` (OOXML valid, A4, `tblHeader` berulang, siap tambah kop di Header).
     - `.xlsx` (OOXML valid, 2 *sheet*: `Template Kosong` dan `Contoh Terisi`, **angka/waktu wajib memakai sel numerik `<v>` bukan teks**, rumus `COUNTIF`/`SUMIF`/`MAX`/`IF` dengan cached value, `freeze panes`, `Print_Titles`, zero fill color).
     - `.pdf` siap cetak (A4, header tabel berulang, legenda & blok pengesahan) dirender via Chrome headless.
   - Buat 1 gambar pratinjau visual `public/assets/images/blog/<slug>.webp` (lebar `1280px`, dikompres `cwebp -q 88`, margin rapi tanpa ruang kosong berlebih di bawah).
   - **Wajib inspeksi visual** gambar `.webp` dan seluruh `.pdf` dengan `read_file`.
2. **Buat halaman artikel `public/blog/<slug>/index.html`:**
   - Ikuti persis pola layout **Vintage Scholar**, masthead, navigasi, toggle tema (default Light Mode), tag iOS PWA (`manifest.webmanifest`, `apple-touch-icon.png`, `theme-color`), dan footer dari `public/blog/format-absen-guru-mata-pelajaran/index.html`.
   - Sertakan JSON-LD `@graph`: `BlogPosting` + `BreadcrumbList`.
   - Sertakan tombol interaktif **Salin Tabel ke Excel** (`ClipboardItem` HTML + fallback TSV) dan **Salin Kode HTML** dengan tab pemilih paket jika ada 2 paket tabel.
   - Pertahankan `<meta name="robots" content="noindex, nofollow" />` jika blog masih dalam mode kunci indeks.
3. **Perbarui indeks & internal link klaster:**
   - Tambahkan kartu artikel baru di posisi paling atas `public/blog/index.html`.
   - Tambahkan 1 tautan balik natural di artikel sebelumnya yang paling relevan dalam `public/blog/`.
4. **Build & validasi menyeluruh (wajib lulus semua sebelum commit):**
   - Jalankan `npm run build` (Tailwind CSS v4 + `scripts/sitemap.mjs`).
   - Validasi dengan Node/Python: JSON-LD valid (`JSON.parse`), sintaks inline `<script>` valid, seluruh referensi `/assets/...` ada di `public/`, ZIP & XML semua `.xlsx`/`.docx` valid, rumus & sel numerik Excel benar, tidak ada kebocoran data sensitif, dan status `robots` sesuai aturan.
5. **Commit & Push:**
   - `git add` hanya file terkait artikel & aset (jangan commit folder scratch atau file sementara).
   - `git commit -m "Tambah artikel <ringkasan judul> beserta aset unduhan"`.
   - `git push origin main` hanya jika user meminta push.
   - Laporkan daftar file dengan link `file://`, hash commit, dan URL live (`https://yusuf-habib.blog/blog/<slug>/`).
