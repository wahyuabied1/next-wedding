"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useGuestName } from "@/lib/useGuestName";

type Item = {
  id: string;
  name: string;
  message: string;
  attendance: "hadir" | "tidak";
  guests: number;
  createdAt: number;
};

type Data = { items: Item[]; hadir: number; tidak: number; total: number };

const PAGE_SIZE = 10;

function timeAgo(from: number, now: number): string {
  const s = Math.max(0, Math.floor((now - from) / 1000));
  if (s < 60) return `${s} detik lalu`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  return `${d} hari, ${h % 24} jam lalu`;
}

export default function Rsvp() {
  const guest = useGuestName();
  const [data, setData] = useState<Data | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const [open, setOpen] = useState(true);
  const [shown, setShown] = useState(PAGE_SIZE);
  const [typedName, setTypedName] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState("");
  const [guests, setGuests] = useState("1");
  const [website, setWebsite] = useState(""); // honeypot
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const name = typedName ?? guest;

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/rsvp", { cache: "no-store", signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("load"))))
      .then(setData)
      .catch(() => {});
    const first = setTimeout(() => setNow(Date.now()), 0);
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => {
      controller.abort();
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!attendance) {
      setStatus({ ok: false, text: "Mohon konfirmasi kehadiran anda." });
      return;
    }
    setSending(true);
    setStatus(null);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, attendance, guests: Number(guests), website }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ ok: false, text: body.error ?? "Gagal mengirim, coba lagi." });
        return;
      }
      const item: Item | undefined = body.item;
      if (item) {
        setData((d) => ({
          items: [item, ...(d?.items ?? [])],
          hadir: (d?.hadir ?? 0) + (item.attendance === "hadir" ? 1 : 0),
          tidak: (d?.tidak ?? 0) + (item.attendance === "tidak" ? 1 : 0),
          total: (d?.total ?? 0) + 1,
        }));
        setNow(Date.now());
      }
      setMessage("");
      setStatus({ ok: true, text: "Terima kasih atas ucapan dan doanya!" });
    } catch {
      setStatus({ ok: false, text: "Koneksi bermasalah, coba lagi." });
    } finally {
      setSending(false);
    }
  }

  const total = data?.total ?? 0;
  const items = data?.items ?? [];
  const remaining = Math.max(0, items.length - shown);

  return (
    <div className="rsvp">
      <button type="button" className="rsvp-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {total} {total === 1 ? "Comment" : "Comments"}
      </button>

      {open && (
        <div className="rsvp-body">
          <div className="rsvp-counts">
            <div className="count hadir">
              <strong>{data?.hadir ?? 0}</strong>
              <span>Hadir</span>
            </div>
            <div className="count tidak">
              <strong>{data?.tidak ?? 0}</strong>
              <span>Tidak Hadir</span>
            </div>
          </div>

          <form onSubmit={submit} className="rsvp-form" noValidate>
            <input
              type="text"
              name="name"
              placeholder="Nama"
              maxLength={60}
              autoComplete="name"
              value={name}
              onChange={(e) => setTypedName(e.target.value)}
            />
            <textarea
              name="message"
              placeholder="Ucapan"
              maxLength={500}
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <select name="attendance" value={attendance} onChange={(e) => setAttendance(e.target.value)} aria-label="Konfirmasi Kehadiran">
              <option value="">Konfirmasi Kehadiran</option>
              <option value="hadir">Hadir</option>
              <option value="tidak">Tidak Hadir</option>
            </select>
            {attendance === "hadir" && (
              <select name="guests" value={guests} onChange={(e) => setGuests(e.target.value)} aria-label="Jumlah tamu" className="guests">
                <option value="1">1 Orang</option>
                <option value="2">2 Orang</option>
              </select>
            )}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hp"
            />
            <button type="submit" className="btn small" disabled={sending}>
              {sending ? "Mengirim…" : "Kirim"}
            </button>
            {status && (
              <p className={`rsvp-status ${status.ok ? "ok" : "err"}`} role="status">
                {status.text}
              </p>
            )}
          </form>

          <ul className="rsvp-list">
            {items.slice(0, shown).map((item) => (
              <li key={item.id}>
                <svg className="ring" width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
                  <circle cx="11" cy="19" r="8" fill="none" stroke="#e0a23a" strokeWidth="2.5" />
                  <circle cx="21" cy="19" r="8" fill="none" stroke="#f3c969" strokeWidth="2.5" />
                  <path d="M16 3l3 4-3 3-3-3z" fill="#9bd7e8" />
                </svg>
                <div>
                  <p className="rsvp-name">
                    {item.name}
                    <span className={`badge ${item.attendance}`} aria-label={item.attendance === "hadir" ? "Hadir" : "Tidak hadir"}>
                      {item.attendance === "hadir" ? "✓" : "✕"}
                    </span>
                  </p>
                  {item.message && <p className="rsvp-msg">{item.message}</p>}
                  <p className="rsvp-time">{now !== null ? timeAgo(item.createdAt, now) : ""}</p>
                </div>
              </li>
            ))}
          </ul>

          {remaining > 0 && (
            <button type="button" className="load-more" onClick={() => setShown((n) => n + PAGE_SIZE)}>
              Muat lebih banyak ({remaining} lagi)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
