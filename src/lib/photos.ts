import manifest from "./photos.manifest.json";

// Manifest dibuat oleh scripts/generate-photo-manifest.mjs (otomatis sebelum `npm run dev` / `npm run build`)
// dari isi public/photos, jadi tidak ada akses file saat halaman dirender.

export type Photo = { src: string; width: number; height: number };

const photos = manifest as Record<string, Photo>;
const EXTENSIONS = /\.(webp|jpe?g|png|avif|gif)$/i;
const keyOf = (name: string) => name.replace(EXTENSIONS, "").toLowerCase();

/** Semua foto di public/photos (urut nama, angka diurutkan secara numerik), kecuali yang dikecualikan. */
export function getAllPhotos(exclude: string[] = []): Photo[] {
  const skip = new Set(exclude.map(keyOf));
  return Object.keys(photos)
    .filter((key) => !skip.has(key))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
    .map((key) => photos[key]);
}

/**
 * Cari foto di public/photos berdasarkan nama TANPA ekstensi, mis. "photo-4".
 * Ekstensi apa pun (.jpg .jpeg .png .webp .avif .gif, huruf besar/kecil) dikenali,
 * dan ukuran aslinya sudah terbaca di manifest, jadi tidak perlu menulis width/height.
 */
export function getPhoto(name: string): Photo {
  const photo = photos[keyOf(name)];
  if (!photo) {
    throw new Error(
      `Foto "${name}" tidak ada di public/photos. Taruh filenya di sana (.jpg .jpeg .png .webp .avif .gif) lalu jalankan ulang \`npm run dev\` atau \`npm run photos\`.`,
    );
  }
  return photo;
}
