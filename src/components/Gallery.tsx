"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/photos";

const INITIAL_COUNT = 9;
const COLUMNS = 3;
const LEAVE_MS = 380; // lama foto tambahan memudar sebelum dilepas saat "Tampilkan lebih sedikit"

type ThumbProps = {
  photo: Photo;
  label: string;
  extra: boolean; // foto tambahan (muncul setelah "Lihat semua")
  delay: number;
  leaving: boolean;
  onOpen: () => void;
};

/** Foto kecil di galeri. Foto tambahan memudar masuk bergiliran, dan gambarnya baru tampil setelah selesai dimuat. */
function Thumb({ photo, label, extra, delay, leaving, onOpen }: ThumbProps) {
  const [ready, setReady] = useState(!extra);
  return (
    <button
      type="button"
      className={`gallery-item${extra ? " gallery-extra" : ""}${leaving ? " leaving" : ""}${ready ? "" : " waiting"}`}
      style={extra ? { animationDelay: `${delay}ms` } : undefined}
      onClick={onOpen}
      aria-label={`Buka foto ${label}`}
    >
      <Image
        src={photo.src}
        alt={`Foto prewedding ${label}`}
        width={photo.width}
        height={photo.height}
        sizes="(max-width: 500px) 33vw, 160px"
        loading={extra ? "eager" : "lazy"}
        onLoad={() => setReady(true)}
      />
    </button>
  );
}

export default function Gallery({ photos: gallery }: { photos: Photo[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [leaving, setLeaving] = useState(false); // foto tambahan sedang memudar keluar
  const gridRef = useRef<HTMLDivElement>(null);
  const visible = expanded ? gallery : gallery.slice(0, INITIAL_COUNT);
  const hidden = gallery.length - visible.length;

  // Foto dibagi ke 3 kolom secara bergantian (kiri, tengah, kanan, lalu baris berikutnya),
  // jadi urutan baca kiri ke kanan dan foto yang sudah tampil tidak bergeser saat ditambah.
  const columns = [0, 1, 2].map((col) =>
    visible.map((photo, index) => ({ photo, index })).filter(({ index }) => index % COLUMNS === col),
  );

  const toggle = () => {
    if (leaving) return;
    if (!expanded) {
      setExpanded(true);
      return;
    }
    // Menciut: foto tambahan memudar sambil halaman meluncur ke awal galeri, baru dilepas.
    // Tanpa ini halaman memendek mendadak dan tamu terlempar ke bagian lain.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setExpanded(false);
      return;
    }
    setLeaving(true);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      setExpanded(false);
      setLeaving(false);
    }, LEAVE_MS + 120);
  };

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
      <div className="gallery" ref={gridRef}>
        {columns.map((column, col) => (
          <div className="gallery-col" key={col}>
            {column.map(({ photo, index }) => (
              <Thumb
                key={photo.src}
                photo={photo}
                label={String(index + 1)}
                extra={index >= INITIAL_COUNT}
                delay={((index - INITIAL_COUNT) % 9) * 70}
                leaving={leaving}
                onOpen={() => setActive(index)}
              />
            ))}
          </div>
        ))}
      </div>

      {gallery.length > INITIAL_COUNT && (
        <button
          type="button"
          className="btn wide gallery-more"
          onClick={toggle}
          aria-expanded={expanded}
          disabled={leaving}
        >
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
