# 03. Assets (Gambar & File)

> Sumber: `docs-main/core/api/assets/index.md`

## Endpoint

| Endpoint | Keterangan |
|----------|-----------|
| `GET /assets/{id}` | Ambil metadata asset |
| `GET /assets/image/{id}` | Ambil / generate thumbnail gambar |

## Menampilkan Gambar dengan Transformasi

```typescript
// lib/cockpit.ts
getImageUrl(id: string, options: ImageOptions = {}): string {
  const { w, h, q = 80, m = 'thumbnail', o = 1 } = options
  const params = new URLSearchParams({ m, q: String(q), o: String(o) })
  if (w) params.append('w', String(w))
  if (h) params.append('h', String(h))
  return `${process.env.NEXT_PUBLIC_COCKPIT_URL}/api/assets/image/${id}?${params}`
}
```

## Mode Resize

| Mode | Keterangan |
|------|-----------|
| `thumbnail` | Crop ke ukuran tepat |
| `bestFit` | Fit dalam bounding box, tidak crop |
| `resize` | Resize paksa |
| `fitToWidth` | Fit ke lebar, tinggi proporsional |
| `fitToHeight` | Fit ke tinggi, lebar proporsional |

## Contoh di Komponen

```tsx
// components/CockpitImage.tsx
interface Props {
  assetId: string
  width?: number
  height?: number
  alt: string
}

export function CockpitImage({ assetId, width, height, alt }: Props) {
  const src = cockpit.getImageUrl(assetId, { w: width, h: height, m: 'bestFit' })
  return <img src={src} width={width} height={height} alt={alt} loading="lazy" />
}
```

## Format Output

```typescript
// Ubah format ke WebP
?mime=webp

// Contoh lengkap: WebP, lebar 800px, kualitas 85
/api/assets/image/{id}?w=800&q=85&mime=webp&o=1
```

> `o=1` artinya return binary gambar langsung (untuk tag `<img src>`).  
> `o=0` atau tanpa `o` return JSON metadata.
