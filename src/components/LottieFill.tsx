"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentType, type CSSProperties } from "react";

type PlayerProps = { src: string; loop?: boolean; autoplay?: boolean; className?: string; style?: CSSProperties };

// Mesin lottie membutuhkan `document`, jadi hanya dimuat di browser.
const Player = dynamic(() => import("lottie-react").then((m) => m.LottieSvg as unknown as ComponentType<PlayerProps>), {
  ssr: false,
});

// Rasio (lebar / tinggi) tiap file di /public/lottie, supaya kotaknya punya tinggi sebelum animasi dimuat.
const RATIO: Record<string, string> = {
  "bunga-1-2": "800 / 800",
  "bunga-2-2": "1080 / 1080",
  "bunga-3-2": "1080 / 1080",
  merak: "1080 / 1080",
  "merak-1": "450 / 1200",
  "gerbang-5-1": "270 / 480",
  "Outline-Divider-11": "973 / 153",
};

type Props = { src: string; className?: string; loop?: boolean };

/** Memutar animasi Lottie, dimuat hanya saat mendekati layar. */
export default function LottieFill({ src, className, loop = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const name = src.split("/").pop()?.replace(/\.json$/, "") ?? "";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={{ aspectRatio: RATIO[name] ?? "1 / 1" }} aria-hidden="true">
      {near && <Player src={src} loop={loop} autoplay style={{ width: "100%", height: "100%" }} />}
    </div>
  );
}
