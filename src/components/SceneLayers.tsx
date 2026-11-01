import Image from "next/image";

/* Lapisan gambar bertumpuk pada kanvas berukuran tetap (500 lebar). Posisi dan lebar dalam persen. */

export type Layer = {
  name: string;
  x: number;
  y: number;
  w: number;
  px: [number, number]; // ukuran asli berkas (untuk rasio)
  animated?: boolean;
  flip?: boolean;
  clip?: string; // bagian gambar yang ditampilkan (CSS clip-path)
};

// bentuk bagian dalam amplop terbuka (puncak di tengah, sisi miring turun ke kiri dan kanan)
export const ENV_CLIP =
  "polygon(49.68% 26.88%, 51.01% 26.94%, 52.25% 27.27%, 73% 36.17%, 88.5% 43.17%, 100% 48.78%, 99.91% 48.83%, 99.95% 73.19%, 99.77% 73.32%, 0.23% 73.32%, 0.09% 73.27%, 0% 73.16%, 0.05% 48.81%, 6.21% 45.94%, 20.01% 39.81%, 31.74% 34.48%, 46.23% 28.18%, 47.88% 27.35%, 48.99% 26.99%)";

/** Kanvas: minimal 420px dan diratakan di tengah, jadi di layar sempit hanya tepi dekorasi yang terpotong. */
export function Layers({ layers }: { layers: Layer[] }) {
  return layers.map((l, i) => (
    <Image
      key={`${l.name}-${i}`}
      className="layer"
      style={{
        left: `${l.x}%`,
        top: `${l.y}%`,
        width: `${l.w}%`,
        clipPath: l.clip,
        transform: l.flip ? "scaleX(-1)" : undefined,
      }}
      src={`/open/${l.name}.webp`}
      alt=""
      width={l.px[0]}
      height={l.px[1]}
      sizes="(max-width: 500px) 70vw, 340px"
      unoptimized={l.animated}
      aria-hidden="true"
    />
  ));
}
