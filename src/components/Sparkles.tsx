/* Bintang kecil yang berkilau di atas rangkaian bunga. Posisi dalam persen dari kotak bunga; murni CSS. */

type Spark = { x: number; y: number; size: number; delay: number; dur?: number };

const GROUPS: Record<"tr" | "bl" | "br", Spark[]> = {
  tr: [
    { x: 58, y: 12, size: 24, delay: 0 },
    { x: 80, y: 21, size: 17, delay: 1.1 },
    { x: 42, y: 26, size: 19, delay: 2.0 },
    { x: 66, y: 34, size: 26, delay: 0.6 },
    { x: 84, y: 40, size: 15, delay: 2.4 },
    { x: 34, y: 46, size: 16, delay: 1.7 },
  ],
  bl: [
    { x: 24, y: 11, size: 24, delay: 0.4 },
    { x: 40, y: 21, size: 18, delay: 1.5 },
    { x: 12, y: 27, size: 17, delay: 2.2 },
    { x: 62, y: 50, size: 22, delay: 0.9 },
    { x: 78, y: 62, size: 16, delay: 1.9 },
  ],
  br: [
    { x: 40, y: 12, size: 22, delay: 1.2 },
    { x: 56, y: 20, size: 16, delay: 0.2 },
    { x: 28, y: 22, size: 17, delay: 1.9 },
    { x: 48, y: 31, size: 19, delay: 2.5 },
  ],
};

export default function Sparkles({ group }: { group: keyof typeof GROUPS }) {
  return (
    <div className={`sparkles sp-${group}`} aria-hidden="true">
      {GROUPS[group].map((s, i) => (
        <i
          key={i}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur ?? 3}s`,
          }}
        />
      ))}
    </div>
  );
}
