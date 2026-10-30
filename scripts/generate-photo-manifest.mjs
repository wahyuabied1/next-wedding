// Membaca semua foto di public/photos dan menulis src/lib/photos.manifest.json
// (nama tanpa ekstensi -> path + ukuran asli). Dijalankan otomatis sebelum `npm run dev` dan `npm run build`.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { imageSize } from "image-size";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "public", "photos");
const out = path.join(root, "src", "lib", "photos.manifest.json");

const SUPPORTED = new Set([".webp", ".jpg", ".jpeg", ".png", ".avif", ".gif"]);
const manifest = {};
const owners = {};
const problems = [];

for (const file of readdirSync(dir).sort()) {
  if (file.startsWith(".")) continue;
  const ext = path.extname(file).toLowerCase();
  const base = file.slice(0, file.length - ext.length);

  if (!SUPPORTED.has(ext)) {
    console.warn(`[photos] dilewati: ${file} (format "${ext || "?"}" tidak didukung browser; ubah ke .jpg/.png/.webp)`);
    continue;
  }

  const key = base.toLowerCase();
  if (owners[key]) {
    problems.push(`Ada dua file untuk foto "${base}": ${owners[key]} dan ${file}. Hapus salah satunya.`);
    continue;
  }
  owners[key] = file;

  try {
    const size = imageSize(readFileSync(path.join(dir, file)));
    // Foto dari ponsel sering memakai rotasi EXIF (5-8) yang menukar lebar dan tinggi.
    const rotated = (size.orientation ?? 1) >= 5;
    manifest[key] = {
      src: `/photos/${file}`,
      width: rotated ? size.height : size.width,
      height: rotated ? size.width : size.height,
    };
  } catch {
    problems.push(`File ${file} bukan gambar yang valid (rusak atau ekstensi tidak sesuai isinya).`);
  }
}

if (problems.length) {
  console.error(["[photos] gagal:", ...problems.map((p) => `  - ${p}`)].join("\n"));
  process.exit(1);
}

writeFileSync(out, JSON.stringify(manifest, null, 2) + "\n");
console.log(`[photos] ${Object.keys(manifest).length} foto -> src/lib/photos.manifest.json`);
