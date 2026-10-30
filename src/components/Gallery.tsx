"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { gallery } from "@/lib/config";

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  const step = useCallback((dir: 1 | -1) => {
    setActive((i) => (i === null ? i : (i + dir + gallery.length) % gallery.length));
  }, []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, step]);

  return (
    <>
      <div className="gallery">
        {gallery.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            className="gallery-item"
            onClick={() => setActive(i)}
            aria-label={`Buka foto ${i + 1}`}
          >
            <Image
              src={photo.src}
              alt={`Foto prewedding ${i + 1}`}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 500px) 33vw, 160px"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Galeri foto"
          onClick={() => setActive(null)}
        >
          <button type="button" className="lightbox-close" aria-label="Tutup" onClick={() => setActive(null)}>
            ×
          </button>
          <button
            type="button"
            className="lightbox-nav prev"
            aria-label="Foto sebelumnya"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
          >
            ‹
          </button>
          <Image
            src={gallery[active].src}
            alt={`Foto prewedding ${active + 1}`}
            width={gallery[active].width}
            height={gallery[active].height}
            sizes="100vw"
            priority
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="lightbox-nav next"
            aria-label="Foto berikutnya"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
