# 08. Personi (Personalisasi Konten)

> Sumber: `docs-main/pro/personi/api/index.md`

## Cara Kerja

Tambahkan query param `personi` ke request konten untuk mendapatkan konten yang dipersonalisasi.  
Tanpa param ini, API mengembalikan raw variant structure.

## Parameter

| Parameter | Keterangan |
|-----------|-----------|
| `?personi=tag1,tag2` | Audience tags (comma-separated) |
| `?personi_vars[name]=John` | Variable untuk placeholder |
| `?tz_offset=+07:00` | Timezone untuk scheduled content |

## Contoh

```typescript
// Fetch konten untuk user yang sudah login sebagai "member"
const page = await fetch(
  `${process.env.COCKPIT_API_URL}/content/item/homepage?personi=member`,
  { headers: { 'api-key': process.env.COCKPIT_API_KEY! } }
)

// Dengan variable untuk placeholder {{ name }}
const page = await fetch(
  `${process.env.COCKPIT_API_URL}/content/item/homepage?` +
  new URLSearchParams({ personi: 'member', 'personi_vars[name]': userName }),
  { headers: { 'api-key': process.env.COCKPIT_API_KEY! } }
)
```

## Placeholder Syntax di Konten Cockpit

```
{{ name }}              → diganti nilai dari personi_vars[name]
{{ name:Pengunjung }}   → dengan fallback jika variabel tidak ada
{{ user.city }}         → nested dot notation
```

## Penggunaan di Middleware Next.js

```typescript
// middleware.ts — kirim audience berdasarkan session
export function middleware(request: NextRequest) {
  const audience = getUserAudience(request) // 'member', 'premium', dll.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('X-Personi-Audience', audience)
  return NextResponse.next({ request: { headers: requestHeaders } })
}
```
