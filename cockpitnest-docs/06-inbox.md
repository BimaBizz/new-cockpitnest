# 06. Inbox (Form Submission)

> Sumber: `docs-main/pro/inbox/api/index.md`

## Endpoint

```
POST /api/inbox/submit/{token}
```

Token didapat dari halaman form di Cockpit admin.

## Contoh Submit Form

```typescript
// app/actions/submitForm.ts (Server Action)
'use server'

export async function submitContactForm(formData: FormData) {
  const token = process.env.COCKPIT_INBOX_TOKEN_CONTACT!

  const res = await fetch(
    `${process.env.COCKPIT_API_URL}/inbox/submit/${token}`,
    {
      method: 'POST',
      body: formData, // kirim sebagai multipart/form-data
    }
  )

  if (!res.ok) throw new Error('Gagal mengirim pesan')
  return res.json()
}
```

```tsx
// components/ContactForm.tsx
'use client'
import { submitContactForm } from '@/app/actions/submitForm'

export function ContactForm() {
  return (
    <form action={submitContactForm}>
      <input name="data[name]" placeholder="Nama" required />
      <input name="data[email]" type="email" placeholder="Email" required />
      <textarea name="data[message]" placeholder="Pesan" required />
      <button type="submit">Kirim</button>
    </form>
  )
}
```

## Nama Field

Semua field data harus diawali `data[...]`:

```
data[name]=John
data[email]=john@example.com
data[message]=Hello!
```

## Response Sukses

```json
{
  "success": true,
  "record": {
    "_id": "submission-id",
    "data": { "name": "John", "email": "john@example.com" },
    "spam": false,
    "_created": 1700000000
  }
}
```

## Error Umum

| Status | Penyebab |
|--------|---------|
| 404 | Token tidak valid |
| 412 | Tidak ada field `data[...]` yang dikirim |
| 412 | Domain tidak diizinkan |

## Upload File

```typescript
const form = new FormData()
form.append('data[name]', 'John')
form.append('data[resume]', file) // File object

await fetch(`/api/inbox/submit/${token}`, { method: 'POST', body: form })
```

## Env Vars yang Dibutuhkan

```bash
COCKPIT_INBOX_TOKEN_CONTACT=xxx   # token per form dari Cockpit admin
COCKPIT_INBOX_TOKEN_NEWSLETTER=xxx
```
