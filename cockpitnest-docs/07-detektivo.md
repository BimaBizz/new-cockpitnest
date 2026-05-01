# 07. Detektivo (Full-Text Search)

> Sumber: `docs-main/pro/detektivo/api/index.md`

## Endpoint

```
GET /api/detektivo/search/{index}?q={query}
```

## Parameter

| Parameter | Tipe | Keterangan |
|-----------|------|-----------|
| `q` | string | Query pencarian (wajib) |
| `limit` | int | Jumlah hasil (default: 50) |
| `offset` | int | Skip untuk pagination |

## Contoh Penggunaan

```typescript
// lib/search.ts
export async function searchContent(index: string, query: string, page = 1) {
  const limit = 10
  const offset = (page - 1) * limit

  const res = await fetch(
    `${process.env.COCKPIT_API_URL}/detektivo/search/${index}?` +
    new URLSearchParams({ q: query, limit: String(limit), offset: String(offset) }),
    {
      headers: { 'api-key': process.env.COCKPIT_API_KEY! },
      next: { revalidate: 60 },
    }
  )

  return res.json() as Promise<SearchResult>
}

interface SearchResult {
  hits: Array<{ _id: string; _score: number; [key: string]: any }>
  total: number
  query: string
  limit: number
  offset: number
}
```

## Search Component (Client)

```tsx
// components/SearchBox.tsx
'use client'
import { useState, useEffect } from 'react'

export function SearchBox({ index }: { index: string }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    if (!query) { setResults([]); return }

    const timer = setTimeout(async () => {
      const res = await fetch(
        `/api/search?index=${index}&q=${encodeURIComponent(query)}`
      )
      const data = await res.json()
      setResults(data.hits)
    }, 300) // debounce 300ms

    return () => clearTimeout(timer)
  }, [query, index])

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari..." />
      <ul>
        {results.map(item => <li key={item._id}>{item.title}</li>)}
      </ul>
    </div>
  )
}
```

## Route Handler untuk Client-Side Search

```typescript
// app/api/search/route.ts
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const index = searchParams.get('index') ?? 'articles'
  const q = searchParams.get('q') ?? ''

  const res = await fetch(
    `${process.env.COCKPIT_API_URL}/detektivo/search/${index}?q=${encodeURIComponent(q)}`,
    { headers: { 'api-key': process.env.COCKPIT_API_KEY! } }
  )

  const data = await res.json()
  return Response.json(data)
}
```

> Index harus dikonfigurasi dulu di Cockpit admin → Detektivo.
