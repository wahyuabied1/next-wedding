import Image from "next/image";

/* Ornamen undangan: rangkaian bunga/rumput (gambar), bingkai oval renda, pembatas.
   Bingkai dan pembatas adalah SVG buatan sendiri. */

const FLORA = {
  hang: { src: "/flora/hang.webp", width: 469, height: 793 }, // menggantung dari atas
  mound: { src: "/flora/mound.webp", width: 629, height: 657 }, // gundukan besar dari bawah
  "mound-small": { src: "/flora/mound-small.webp", width: 500, height: 412 }, // gundukan kecil dari bawah
} as const;

export type FloraVariant = keyof typeof FLORA;

/** Rangkaian bunga dan rumput dekoratif. Balik horizontal dengan `flip`. */
export function Flora({
  variant,
  className = "",
  flip = false,
  priority = false,
}: {
  variant: FloraVariant;
  className?: string;
  flip?: boolean;
  priority?: boolean;
}) {
  const f = FLORA[variant];
  return (
    <Image
      className={`flora${flip ? " flip" : ""} ${className}`}
      src={f.src}
      alt=""
      width={f.width}
      height={f.height}
      sizes="(max-width: 500px) 50vw, 250px"
      priority={priority}
      aria-hidden="true"
    />
  );
}

/* ---------- bingkai oval renda ---------- */

const CX = 150;
const CY = 200;
const r1 = (n: number) => Math.round(n * 10) / 10;

function ring(n: number, rx: number, ry: number, phase = 0) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + phase;
    return { x: r1(CX + Math.cos(a) * rx), y: r1(CY + Math.sin(a) * ry) };
  });
}

const SCALLOPS = ring(64, 137, 187);
const HOLES = ring(52, 126, 176, 0.06);

function LaceDefs({ id, hole }: { id: string; hole?: { rx: number; ry: number } }) {
  return (
    <defs>
      <linearGradient id={`${id}-paper`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f6efdd" />
        <stop offset="1" stopColor="#e4d9c0" />
      </linearGradient>
      <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="300" height="400">
        <g fill="#fff">
          {SCALLOPS.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="8.6" />
          ))}
          <ellipse cx={CX} cy={CY} rx="138" ry="188" />
        </g>
        <g fill="#000">
          {HOLES.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2.5" />
          ))}
          {hole && <ellipse cx={CX} cy={CY} rx={hole.rx} ry={hole.ry} />}
        </g>
      </mask>
    </defs>
  );
}

/** Foto berbentuk oval dengan bingkai renda dan garis emas. */
export function PhotoOval({
  id,
  src,
  width,
  height,
  alt,
  sizes,
  className = "",
  priority,
}: {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`photo-oval ${className}`}>
      <Image className="photo-oval-img" src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} />
      <svg className="photo-oval-ring" viewBox="0 0 300 400" aria-hidden="true">
        <LaceDefs id={id} hole={{ rx: 112, ry: 156 }} />
        <rect width="300" height="400" fill={`url(#${id}-paper)`} mask={`url(#${id}-mask)`} />
        <ellipse cx={CX} cy={CY} rx="118" ry="162" fill="none" stroke="#c9a45a" strokeWidth="1.4" />
        <g stroke="#d9b868" strokeWidth="1.2" strokeLinecap="round">
          <path d="M22 70v16M14 78h16" />
          <path d="M278 330v16M270 338h16" />
        </g>
      </svg>
    </div>
  );
}

/** Garis pembatas dengan belah ketupat di tengah. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <svg className={`divider ${className}`} viewBox="0 0 240 20" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round">
        <path d="M6 10h92M142 10h92" />
        <path d="M120 3l7 7-7 7-7-7z" fill="currentColor" />
      </g>
      <g fill="currentColor">
        <circle cx="104" cy="10" r="1.6" />
        <circle cx="136" cy="10" r="1.6" />
      </g>
    </svg>
  );
}
