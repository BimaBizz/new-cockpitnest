# 02. Content API

> Sumber: `docs-main/core/api/content/index.md`

## Endpoint Utama

| Endpoint | Keterangan |
|----------|-----------|
| `GET /content/items/{model}` | Ambil list item (koleksi) |
| `GET /content/item/{model}` | Ambil satu item (singleton) |
| `GET /content/item/{model}/{id}` | Ambil item by ID |
| `POST /content/item/{model}` | Buat atau update item |
| `DELETE /content/item/{model}/{id}` | Hapus item |
| `GET /content/tree/{model}` | Ambil konten nested/tree |
| `GET /content/items` | Batch request banyak model |

## Penggunaan via `lib/cockpit.ts`

```typescript
// Ambil list item koleksi
const posts = await cockpit.getItems('posts', {
  filter: { _state: 1 },       // hanya yang published
  sort: { _created: -1 },      // terbaru dulu
  limit: 10,
  skip: 0,
  populate: 1,                 // populate field referensi
  locale: 'id',                // opsional: lokalisasi
})

// Ambil singleton (satu item, misal: halaman "tentang kami")
const about = await cockpit.getSingleton('about')

// Ambil item by ID
const post = await cockpit.getItem('posts', '2fd457c3376537fb3d0001e2')
```

## Filter (MongoDB Syntax)

```typescript
// Filter sederhana
filter: { category: 'berita' }

// Filter dengan operator
filter: { _created: { $gt: 1700000000 } }

// Filter OR
filter: { $or: [{ status: 'active' }, { featured: true }] }
```

## Proyeksi Field

```typescript
// Hanya ambil field tertentu (hemat bandwidth)
fields: { title: 1, slug: 1, image: 1 }
```

## Pagination

```typescript
// Halaman 2, 10 item per halaman
limit: 10,
skip: 10,   // (halaman - 1) * limit
```

## Batch Request (Banyak Model Sekaligus)

```typescript
// Ambil faq dan articles dalam satu request
const url = `${COCKPIT_API_URL}/content/items?models=${encodeURIComponent(
  JSON.stringify({ faq: {}, articles: { sort: { _created: -1 }, limit: 5 } })
)}`
```

## Caching di Next.js App Router

```typescript
// Server Component — cache 1 jam
const data = await fetch(url, {
  headers: { 'api-key': process.env.COCKPIT_API_KEY! },
  next: { revalidate: 3600 },
})

// Revalidasi on-demand (via webhook)
import { revalidatePath } from 'next/cache'
revalidatePath('/blog')
```
