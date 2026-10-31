// Membuat gambar pratinjau tautan (og:image) 1200x630 dari satu foto di public/photos.
//
//   npm run og                # memakai photo-000
//   node scripts/generate-og-image.mjs photo-12
//
// Foto potret ditaruh utuh di tengah dengan latar dari foto yang sama (diburamkan), supaya tidak
// terpotong di WhatsApp/Facebook. Ukuran dijaga di bawah 300 KB (batas WhatsApp).
// Catatan: skrip ini memakai `sharp` yang ikut terpasang bersama Next.js.
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const name = (process.argv[2] ?? "photo-000").toLowerCase();
const manifest = JSON.parse(readFileSync(path.join(root, "src/lib/photos.manifest.json"), "utf8"));
const photo = manifest[name];
if (!photo) {
  console.error(`[og] foto "${name}" tidak ada di public/photos (jalankan npm run photos lebih dulu).`);
  process.exit(1);
}

const W = 1200;
const H = 630;
const MAX_BYTES = 290 * 1024;
const input = path.join(root, "public", photo.src);
const out = path.join(root, "public", "og-image.jpg");

const background = await sharp(input)
  .resize(W, H, { fit: "cover", position: "centre" })
  .blur(32)
  .modulate({ brightness: 0.5 })
  .toBuffer();
const foreground = await sharp(input)
  .resize({ height: H - 48, fit: "inside" })
  .toBuffer();

let quality = 86;
let size = Infinity;
while (quality >= 55) {
  await sharp(background)
    .composite([{ input: foreground, gravity: "centre" }])
    .jpeg({ quality, mozjpeg: true })
    .toFile(out);
  size = statSync(out).size;
  if (size <= MAX_BYTES) break;
  quality -= 5;
}

console.log(`[og] ${name} -> public/og-image.jpg  ${W}x${H}, kualitas ${quality}, ${Math.round(size / 1024)} KB`);
if (size > MAX_BYTES) console.warn("[og] PERINGATAN: masih di atas 290 KB.");
