# 09. Webhooks (Revalidasi & Integrasi)

> Sumber: `docs-main/pro/webhooks/introduction/index.md`

## Kegunaan Utama di Proyek Ini

- **Revalidasi ISR** — trigger `revalidatePath` atau `revalidateTag` saat konten berubah di Cockpit
- **Notifikasi** — kirim ke Slack/Discord saat ada konten baru
- **Search index** — update Detektivo index saat konten diperbarui

## Setup Webhook di Cockpit

1. Masuk ke **Settings → Webhooks**
2. Tambah webhook baru:
   - **URL**: `https://yoursite.com/api/revalidate`
   - **Method**: `POST`
   - **Events**: pilih event yang relevan (misal `content.item.save.posts`)
   - **Headers**: `x-revalidate-secret: ${REVALIDATION_SECRET}`

## Route Handler Revalidasi

```typescript
// app/api/revalidate/route.ts
import { NextRequest } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret')

  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const model = body?.model ?? ''

  // Revalidasi berdasarkan model yang berubah
  const pathMap: Record<string, string> = {
    posts: '/blog',
    pages: '/',
    products: '/produk',
  }

  if (pathMap[model]) {
    revalidatePath(pathMap[model])
  }

  // Atau gunakan tag
  revalidateTag(`cockpit-${model}`)

  return Response.json({ revalidated: true, model })
}
```

## Env Vars yang Dibutuhkan

```bash
REVALIDATION_SECRET=random-string-yang-aman
```

## Event yang Tersedia

| Event | Kapan |
|-------|-------|
| `content.item.save.{model}` | Saat item dibuat/diupdate |
| `content.item.delete.{model}` | Saat item dihapus |
| `content.item.publish.{model}` | Saat item dipublish |

## Best Practices

- Simpan URL webhook dan token di `.env` Cockpit, jangan hardcode
- Gunakan `HTTPS` untuk endpoint webhook
- Test dulu dengan [webhook.site](https://webhook.site) sebelum ke production
- Log webhook yang gagal di Cockpit → Settings → Webhooks → Logs
