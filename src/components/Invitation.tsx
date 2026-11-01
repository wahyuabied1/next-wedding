"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Flora } from "@/components/Ornaments";
import { audioSources } from "@/lib/config";
import { useGuestName } from "@/lib/useGuestName";

// Lama animasi amplop terbuka sebelum scroll dibuka dan halaman bergeser ke isi undangan.
const OPEN_MS = 1300;
// Lama halaman meluncur dari cover ke isi undangan (scroll halus bawaan browser hanya ~0,5 detik dan tidak bisa diatur).
const SCROLL_MS = 2600;

/** Scroll halus berdurasi tetap (ease in-out). Berhenti bila pengguna menyentuh atau memutar roda. Mengembalikan pembatal. */
function glideTo(target: number, ms: number) {
  const from = window.scrollY;
  const distance = target - from;
  if (!distance || ms <= 0) {
    window.scrollTo({ top: target, behavior: "instant" });
    return () => {};
  }
  const begin = performance.now();
  let frame = 0;
  const cancel = () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("wheel", cancel);
    window.removeEventListener("touchstart", cancel);
    window.removeEventListener("keydown", cancel);
  };
  const step = (now: number) => {
    const t = Math.min(1, (now - begin) / ms);
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    window.scrollTo({ top: from + distance * eased, behavior: "instant" });
    if (t < 1) frame = requestAnimationFrame(step);
    else cancel();
  };
  window.addEventListener("wheel", cancel, { passive: true });
  window.addEventListener("touchstart", cancel, { passive: true });
  window.addEventListener("keydown", cancel);
  frame = requestAnimationFrame(step);
  return cancel;
}

/** Cover amplop + tombol musik. Isi undangan (server component) dikirim lewat `children`. */
export default function Invitation({ children }: { children: ReactNode }) {
  const guest = useGuestName();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [opening, setOpening] = useState(false); // animasi amplop sedang berjalan
  const [opened, setOpened] = useState(false); // scroll sudah dibuka
  const [playing, setPlaying] = useState(false);

  // Scroll dikunci sampai undangan dibuka. Selama terkunci, halaman HARUS berada di cover (tempat
  // amplop). Browser bisa memulihkan posisi scroll lama saat refresh atau tombol kembali, dan itu
  // terjadi sebelum maupun sesudah hidrasi; tanpa penjagaan ini tamu terjebak di bawah dengan
  // scroll terkunci dan amplopnya tidak terlihat.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("locked", !opened);

    if (opened) {
      const target = document.getElementById("opening");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const stop = target
        ? glideTo(target.getBoundingClientRect().top + window.scrollY, reduce ? 0 : SCROLL_MS)
        : () => {};
      return () => {
        stop();
        root.classList.remove("locked");
      };
    }

    // Undangan selalu dimulai dari cover, jadi pemulihan posisi scroll oleh browser tidak berguna.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const toTop = () => {
      if (window.scrollY !== 0) window.scrollTo({ top: 0, behavior: "instant" });
    };
    toTop();
    window.addEventListener("scroll", toTop, { passive: true });
    window.addEventListener("pageshow", toTop); // kembali dari cache bfcache
    return () => {
      window.removeEventListener("scroll", toTop);
      window.removeEventListener("pageshow", toTop);
      root.classList.remove("locked");
    };
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
  // saat amplop diketuk (dengan preload="none" unduhan baru mulai saat itu, dan di data seluler
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
    if (opening) return;
    setOpening(true);
    // Harus dipanggil di dalam ketukan pengguna agar browser mengizinkan suara.
    audioRef.current
      ?.play()
      .then(() => setPlaying(true))
      .catch(() => {});
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => setOpened(true), reduce ? 0 : OPEN_MS);
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
      <section id="section-cover" className="cover curtain">
        <Flora variant="hang" className="flora-cover-tr" flip priority />
        <Flora variant="mound" className="flora-cover-bl" priority />
        <Flora variant="mound-small" className="flora-cover-br" flip priority />

        <div className="cover-top">
          <p className="eyebrow">THE WEDDING OF</p>
          <h1 className="script title">Fifi &amp; Abid</h1>
          <p className="eyebrow">WE INVITE YOU TO CELEBRATE OUR WEDDING</p>
        </div>

        <button type="button" className={`env${opening ? " open" : ""}`} onClick={open} aria-label="Buka undangan">
          <span className="env-back" />
          <span className="env-card">
            <span className="env-to">Kepada Yth.</span>
            <span className="env-guest">{guest || "Nama Tamu"}</span>
            <span className="env-note">You are cordially invited to our wedding.</span>
          </span>
          <span className="env-front-wrap">
            <span className="env-front" />
          </span>
          <span className="env-flap-wrap">
            <span className="env-flap" />
          </span>
          <span className="env-seal" aria-hidden="true">
            <span className="script">F&amp;A</span>
          </span>
        </button>

        <p className="cover-hint">Ketuk amplop untuk membuka undangan</p>
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
