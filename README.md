# Undangan Pernikahan Fifi & Abid

Next.js 16 (App Router) · Lottie · Upstash Redis.

Link tamu: `https://abidfifi.live/?to=Nama+Tamu`

## Struktur

| Path | Isi |
|---|---|
| `src/lib/config.ts` | **Semua konten**: nama, orang tua, tanggal, lokasi, rekening, urutan galeri |
| `src/app/page.tsx` | Susunan section undangan |
| `src/components/` | Cover + musik, hitung mundur, galeri, RSVP, hadiah, Lottie |
| `src/app/api/rsvp/route.ts` | API komentar/RSVP (GET, POST, DELETE) |
| `src/lib/rsvp-store.ts` | Penyimpanan (Upstash Redis; memori saat lokal) |
| `public/` | Foto, latar, animasi Lottie, musik |
| `assets-scrape/` | Salinan mentah aset dari situs lama (tidak ikut deploy) |

## Mengganti / menambah foto

1. Taruh file di `public/photos/` dengan format apa pun: `.jpg` `.jpeg` `.png` `.webp` `.avif` `.gif` (huruf besar/kecil bebas).
2. Di `src/lib/config.ts` tulis **nama file tanpa ekstensi**, mis. `"photo-4"` (bukan `photo-4.jpeg`).
3. Jalankan ulang `npm run dev` (atau `npm run photos`). Ukuran foto dibaca otomatis, tidak perlu menulis lebar/tinggi.

Bila ada dua file bernama sama (mis. `photo-4.webp` dan `photo-4.jpeg`) atau file rusak, skrip berhenti dengan pesan yang jelas.
Format iPhone `.heic` tidak bisa ditampilkan browser; ekspor dulu ke `.jpg`.

## Jalankan lokal

```bash
npm install
npm run dev        # http://localhost:3000/?to=Nama+Tamu
```

Tanpa Redis, komentar disimpan di memori (hilang saat server restart). Itu hanya untuk development.

> Tanpa Redis terpasang di production, `/api/rsvp` mengembalikan 503 (komentar tidak diterima) agar tidak ada data yang hilang diam-diam.

## Moderasi komentar

Atur env `ADMIN_TOKEN` (string acak panjang) di server. Ambil `id` dari `GET /api/rsvp`, lalu:

```bash
curl -X DELETE "https://abidfifi.live/api/rsvp?id=<ID>" -H "Authorization: Bearer $ADMIN_TOKEN"
```

## Catatan

- Halaman diberi `noindex` (undangan pribadi). Hapus `robots` di `src/app/layout.tsx` bila ingin muncul di Google.
- Hitung mundur menuju Akad Nikah (`countdownTarget` di `config.ts`).
- Musik: `public/audio/song.mp3` adalah cover sebuah lagu (hak cipta pihak lain). Ganti dengan musik bebas royalti bila perlu.
- Animasi Lottie dan ornamen berasal dari template vendor undangan lama; pastikan lisensinya mengizinkan penggunaan ulang.
