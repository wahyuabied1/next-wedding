"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import LottieFill from "@/components/LottieFill";
import { audioSrc } from "@/lib/config";
import { useGuestName } from "@/lib/useGuestName";

/** Cover + tombol musik. Isi undangan (server component) dikirim lewat `children`. */
export default function Invitation({ children }: { children: ReactNode }) {
  const guest = useGuestName();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Scroll dikunci sampai undangan dibuka.
  useEffect(() => {
    document.documentElement.classList.toggle("locked", !opened);
    if (opened) document.getElementById("opening")?.scrollIntoView({ behavior: "smooth" });
    return () => document.documentElement.classList.remove("locked");
  }, [opened]);

  const open = () => {
    setOpened(true);
    audioRef.current
      ?.play()
      .then(() => setPlaying(true))
      .catch(() => {});
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().then(() => setPlaying(true)).catch(() => {});
    else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="page">
      <section id="section-cover" className="cover">
        <LottieFill className="lt lt-cover-flower" src="/lottie/bunga-1-2.json" />
        <LottieFill className="lt lt-cover-peacock" src="/lottie/merak.json" />
        <LottieFill className="lt lt-cover-bottom" src="/lottie/bunga-2-2.json" />

        <div className="cover-top">
          <p className="eyebrow">THE WEDDING OF</p>
          <h1 className="script title">Fifi &amp; Abid</h1>
          <p className="eyebrow">WE INVITE YOU TO CELEBRATE OUR WEDDING</p>
        </div>

        <div className="cover-card">
          <p className="cover-to">Kepada Yth.</p>
          <p className="cover-guest">{guest || "Nama Tamu"}</p>
          <p className="cover-note">You are cordially invited to our wedding.</p>
          <button type="button" className="btn-white" onClick={open}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5v6.6l2.3-2.3 1.4 1.4L12 17.4 7.3 12.7l1.4-1.4L11 13.6V7h2z" />
            </svg>
            Buka Undangan
          </button>
        </div>
      </section>

      {children}

      <audio ref={audioRef} src={audioSrc} loop preload="none" onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} />
      {opened && (
        <button
          type="button"
          className={`music${playing ? " playing" : ""}`}
          onClick={toggleMusic}
          aria-label={playing ? "Jeda musik" : "Putar musik"}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
          </svg>
        </button>
      )}
    </div>
  );
}
