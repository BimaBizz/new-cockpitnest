# AGENT.md — Panduan AI untuk Proyek Next.js + Cockpit CMS

> File ini adalah sumber kebenaran utama untuk semua AI agent yang bekerja di repositori ini.
> Baca **seluruhnya** sebelum menulis atau mengubah kode apapun.

---

<!-- BEGIN:nextjs-agent-rules -->
## ⚠️ Peringatan Kritis: Versi Next.js Ini Mungkin Berbeda

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data.  
**Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.**

Jangan berasumsi bahwa kamu tahu cara kerja Next.js versi ini hanya dari data pelatihan.  
Selalu verifikasi dari dokumentasi lokal atau `package.json` terlebih dahulu.
<!-- END:nextjs-agent-rules -->

---

<!-- BEGIN:cockpit-agent-rules -->
## 📖 Aturan Cockpit CMS — Wajib Dibaca Sebelum Mulai

Proyek ini menggunakan **Cockpit CMS** sebagai headless backend.  
Sebelum menulis kode apapun yang menyentuh konten, asset, autentikasi, atau fitur CMS:

### 1. Baca Dokumentasi API dari `docs-main/`

Folder `docs-main/` berisi dokumentasi resmi Cockpit CMS untuk proyek ini.  
Struktur dokumentasinya:

```
docs-main/
├── core/
│   ├── api/
│   │   ├── content/       → API untuk mengambil & menyimpan konten
│   │   ├── assets/        → API untuk gambar & file
│   │   └── authentication/ → API key, public API, OIDC
│   └── concepts/
│       ├── fields/        → Tipe field yang tersedia
│       ├── localization/  → Cara kerja multi-bahasa
│       └── roles-permissions/ → Sistem izin
├── pro/
│   ├── pages/api/         → API untuk Pages & Menus
│   ├── lokalize/api/      → API untuk terjemahan (i18n)
│   ├── inbox/api/         → API untuk form submission
│   ├── detektivo/api/     → API untuk full-text search
│   ├── personi/api/       → API untuk personalisasi konten
│   └── webhooks/          → Konfigurasi webhook
└── guides/
    └── cockpit-with-nextjs.md → Panduan integrasi Next.js
```

**Urutan baca yang disarankan:**
1. `docs-main/core/api/authentication/index.md` — pahami autentikasi dulu
2. `docs-main/core/api/content/index.md` — API konten utama
3. Bagian fitur yang relevan dengan task kamu

### 2. Baca Dokumentasi Fitur di `cockpitnest-docs/`

Folder `cockpitnest-docs/` berisi panduan spesifik cara mengelola aplikasi **ini** dengan Cockpit.  
Selalu cek folder ini sebelum mengimplementasi fitur baru:

```
cockpitnest-docs/
├── 01-authentication.md    → Setup API key & env vars
├── 02-content-api.md       → Fetch konten dari koleksi & singleton
├── 03-assets.md            → Gambar & file
├── 04-pages-menus.md       → Halaman & navigasi
├── 05-lokalize.md          → Terjemahan & i18n
├── 06-inbox.md             → Form submission
├── 07-detektivo.md         → Full-text search
├── 08-personi.md           → Personalisasi konten
└── 09-webhooks.md          → Revalidasi & integrasi eksternal
```

**Jika dokumentasi untuk fitur yang kamu butuhkan belum ada** di `cockpitnest-docs/`:
- Buat file baru dengan format yang konsisten (lihat file yang sudah ada)
- Tulis singkat, fokus pada cara penggunaan di proyek ini
- Tambahkan contoh kode TypeScript yang siap pakai

### 3. Aturan Wajib untuk Kode Cockpit

```bash
# Selalu gunakan env vars, JANGAN hardcode URL atau API key
COCKPIT_API_URL=...
COCKPIT_API_KEY=...

# Gunakan lib/cockpit.ts sebagai satu-satunya titik akses ke Cockpit API
# Jangan memanggil Cockpit API langsung dari komponen
```

- **Gunakan `lib/cockpit.ts`** sebagai wrapper tunggal untuk semua panggilan API
- **Jangan** hardcode URL Cockpit atau API key di manapun selain `.env.local`
- **Gunakan `next: { revalidate: N }`** untuk caching di Server Components
- **Gunakan filter MongoDB syntax** untuk query konten: `filter={field: 'value'}`
- **Gunakan `populate: 1`** jika field berisi referensi ke konten lain
<!-- END:cockpit-agent-rules -->

---

## 🗂️ Struktur Proyek

```
.
├── app/                    # App Router
├── components/             # Komponen reusable
├── lib/
│   └── cockpit.ts          # ← Semua Cockpit API calls wajib lewat sini
├── public/
├── docs-main/              # ← Dokumentasi resmi Cockpit CMS (jangan edit)
├── cockpitnest-docs/       # ← Panduan spesifik proyek ini
├── .env.local              # API keys (JANGAN di-commit)
└── AGENT.md                # File ini
```

---

## 🔧 Perintah Umum

```bash
npm run dev       # Development
npm run build     # Build production
npm run lint      # Lint check
npx tsc --noEmit  # Type check
```

---

## 🚫 Larangan Keras

1. **Jangan** hardcode `COCKPIT_API_URL` atau `COCKPIT_API_KEY` di kode
2. **Jangan** memanggil Cockpit API langsung dari komponen — gunakan `lib/cockpit.ts`
3. **Jangan** berasumsi tentang struktur konten — cek `docs-main/core/concepts/content/`
4. **Jangan** abaikan deprecation notice dari Next.js
5. **Jangan** commit file `.env.local`
6. **Jangan** membuat file di `cockpitnest-docs/` tanpa mengikuti format yang ada

---

## ✅ Checklist Sebelum Selesai

- [ ] Sudah baca dokumentasi di `docs-main/` yang relevan
- [ ] Sudah cek atau buat file di `cockpitnest-docs/` yang sesuai
- [ ] Tidak ada API key atau URL yang ter-hardcode
- [ ] Semua Cockpit API calls melalui `lib/cockpit.ts`
- [ ] Tidak ada error TypeScript (`npx tsc --noEmit`)
- [ ] Tidak ada `console.log` debug yang tertinggal

---

*Diperbarui: lihat git log untuk riwayat perubahan.*
