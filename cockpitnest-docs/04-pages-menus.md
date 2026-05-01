# 04. Pages & Menus

> Sumber: `docs-main/pro/pages/api/index.md`

## Endpoint

| Endpoint | Keterangan |
|----------|-----------|
| `GET /pages/menus` | Semua menu |
| `GET /pages/menu/{name}` | Satu menu by nama |
| `GET /pages/pages` | Semua halaman |
| `GET /pages/page?route=/slug` | Halaman by slug |
| `GET /pages/page/{id}` | Halaman by ID |
| `GET /pages/routes` | Semua route (ringan, tanpa konten) |
| `GET /pages/settings` | Pengaturan pages (SEO, dsb.) |
| `GET /pages/sitemap` | Sitemap lengkap |

## Fetch Menu Navigasi

```typescript
// lib/cockpit.ts
async getMenu(name: string) {
  return this.request(`/pages/menu/${name}`)
}

// Penggunaan di layout
const mainMenu = await cockpit.getMenu('main')
```

## Fetch Halaman by Slug (Dynamic Routes)

```typescript
// app/[...slug]/page.tsx
export default async function Page({ params }: { params: { slug: string[] } }) {
  const route = '/' + params.slug.join('/')
  const page = await cockpit.request(`/pages/page?route=${encodeURIComponent(route)}`)

  if (!page) notFound()
  return <PageRenderer page={page} />
}
```

## Generate Static Routes

```typescript
// app/[...slug]/page.tsx
export async function generateStaticParams() {
  const routes = await cockpit.request('/pages/routes')
  // routes: [{ route: '/home', slug: 'home', type: '...' }, ...]
  return routes.map((r: any) => ({
    slug: r.route.replace(/^\//, '').split('/')
  }))
}
```

## Fetch Semua Halaman (dengan filter & pagination)

```typescript
const pages = await cockpit.request('/pages/pages', {
  params: {
    filter: JSON.stringify({ _state: 1 }),
    limit: 20,
    skip: 0,
  }
})
```

## Sitemap untuk Next.js

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await cockpit.request('/pages/sitemap')
  return data.map((item: any) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}${item.route}`,
    lastModified: new Date(item._modified * 1000),
  }))
}
```
