"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Photo } from "@/lib/photos";

const INITIAL_COUNT = 9;
const COLUMNS = 3;

export default function Gallery({ photos: gallery }: { photos: Photo[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? gallery : gallery.slice(0, INITIAL_COUNT);
  const hidden = gallery.length - visible.length;

  // Foto dibagi ke 3 kolom secara bergantian (kiri, tengah, kanan, lalu baris berikutnya),
  // jadi urutan baca kiri ke kanan dan foto yang sudah tampil tidak bergeser saat ditambah.
  const columns = [0, 1, 2].map((col) =>
    visible.map((photo, index) => ({ photo, index })).filter(({ index }) => index % COLUMNS === col),
  );

  const step = useCallback(
    (dir: 1 | -1) => {
      setActive((i) => (i === null ? i : (i + dir + gallery.length) % gallery.length));
    },
    [gallery.length],
  );

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
        {columns.map((column, col) => (
          <div className="gallery-col" key={col}>
            {column.map(({ photo, index }) => (
              <button
                key={photo.src}
                type="button"
                className="gallery-item"
                onClick={() => setActive(index)}
                aria-label={`Buka foto ${index + 1}`}
              >
                <Image
                  src={photo.src}
                  alt={`Foto prewedding ${index + 1}`}
                  width={photo.width}
                  height={photo.height}
                  sizes="(max-width: 500px) 33vw, 160px"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        ))}
      </div>

      {gallery.length > INITIAL_COUNT && (
        <button type="button" className="btn-white wide gallery-more" onClick={() => setExpanded((e) => !e)} aria-expanded={expanded}>
          {expanded ? "Tampilkan lebih sedikit" : `Lihat semua (${hidden} foto lagi)`}
        </button>
      )}

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
