# 01. Autentikasi Cockpit CMS

> Sumber: `docs-main/core/api/authentication/index.md`

## Setup

Tambahkan ke `.env.local`:

```bash
COCKPIT_API_URL=https://your-cockpit.tld/api
COCKPIT_API_KEY=USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Cara Kerja

Setiap request ke Cockpit API wajib menyertakan header `api-key`:

```typescript
// lib/cockpit.ts — sudah menangani ini secara otomatis
headers: {
  'api-key': process.env.COCKPIT_API_KEY!,
  'Content-Type': 'application/json',
}
```

## Jenis API Key

| Jenis | Keterangan |
|-------|-----------|
| User API Key | Dari profil user di `/system/users/user` |
| Custom API Key | Dari `/system/api` — tidak terikat ke user tertentu |
| Public API | Tanpa API key, akses dibatasi oleh Role |

## Public API (Tanpa Auth)

Untuk endpoint yang boleh diakses tanpa API key:
1. Buat Role khusus (misal: `public`) di `/system/users/roles`
2. Set role tersebut di `/system/api` → Public API
3. Panggil endpoint tanpa header `api-key`

> ⚠️ Hati-hati: public API yang salah konfigurasi bisa mengekspos data sensitif.

## Membuat API Key Baru

1. Login ke Cockpit → profil user → bagian **API Key**
2. Klik **Refresh** untuk generate token baru
3. Copy ke `.env.local`

## Invalidasi Token

Klik **Refresh** di profil user — token lama langsung tidak berlaku.
