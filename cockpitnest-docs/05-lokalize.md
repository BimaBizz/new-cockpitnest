# 05. Lokalize (Terjemahan / i18n)

> Sumber: `docs-main/pro/lokalize/api/index.md`

## Endpoint

| Endpoint | Keterangan |
|----------|-----------|
| `GET /lokalize/project/{name}` | Semua terjemahan (semua locale) |
| `GET /lokalize/project/{name}/{locale}` | Terjemahan untuk satu locale |

## Struktur Response

```json
// GET /lokalize/project/website/id
{
  "nav.home": "Beranda",
  "nav.about": "Tentang Kami",
  "button.submit": "Kirim"
}
```

## Integrasi di Next.js App Router

```typescript
// lib/translations.ts
export async function getTranslations(locale: string) {
  const res = await fetch(
    `${process.env.COCKPIT_API_URL}/lokalize/project/website/${locale}`,
    {
      headers: { 'api-key': process.env.COCKPIT_API_KEY! },
      next: { revalidate: 3600 },
    }
  )
  if (!res.ok) return {}
  return res.json() as Promise<Record<string, string>>
}
```

## Helper `t()` Sederhana

```typescript
// lib/t.ts
export function createT(translations: Record<string, string>) {
  return (key: string, fallback = key): string =>
    translations[key] ?? fallback
}

// Penggunaan
const t = createT(translations)
t('nav.home')                // "Beranda"
t('nav.contact', 'Kontak')  // fallback jika key tidak ada
```

## Locale di next.config.ts

```typescript
i18n: {
  locales: ['id', 'en'],
  defaultLocale: 'id',
}
```
