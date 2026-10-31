"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import LottieFill from "@/components/LottieFill";
import { audioSources } from "@/lib/config";
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

  // Putar musik begitu halaman dibuka. Browser memblokir suara otomatis tanpa interaksi,
  // jadi bila ditolak, musik dimulai pada interaksi pertama (klik, sentuh, atau tombol keyboard).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const events = ["click", "touchend", "keydown"] as const;
    const stop = () => events.forEach((name) => window.removeEventListener(name, start));

    function start(event?: Event) {
      // Tombol musik mengatur dirinya sendiri; jangan ikut memutar saat tombol itu ditekan.
      if (event?.target instanceof Element && event.target.closest(".music")) return;
      audio!.play().then(stop, () => {});
    }

    events.forEach((name) => window.addEventListener(name, start));
    start(); // coba langsung saat halaman dibuka
    return stop;
  }, []);

  // Setelah halaman selesai dimuat dan browser senggang, unduh lagu diam-diam supaya langsung bunyi
  // saat tombol ditekan (dengan preload="none" unduhan baru mulai saat itu, dan di data seluler
  // bisa tertunda beberapa detik). Dilewati bila mode hemat data atau koneksi 2G.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
      .connection;
    if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? "")) return;

    let cancelled = false;
    const preload = () => {
      // Jangan ganggu lagu yang sudah diputar atau sudah termuat.
      if (cancelled || !audio.paused || audio.readyState > 0) return;
      audio.preload = "auto";
      audio.load();
    };
    const schedule = () => {
      if ("requestIdleCallback" in window) window.requestIdleCallback(preload, { timeout: 4000 });
      else setTimeout(preload, 1500);
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
    };
  }, []);

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

      <audio ref={audioRef} loop preload="none" onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)}>
        {audioSources.map((src) => (
          <source key={src} src={src} type="audio/mpeg" />
        ))}
      </audio>
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
    </div>
  );
}
