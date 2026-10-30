"use client";

import { useEffect, useState } from "react";

const DAY = 86_400_000;
const HOUR = 3_600_000;
const MINUTE = 60_000;

function split(ms: number) {
  return [
    ["Hari", Math.floor(ms / DAY)],
    ["Jam", Math.floor((ms % DAY) / HOUR)],
    ["Menit", Math.floor((ms % HOUR) / MINUTE)],
    ["Detik", Math.floor((ms % MINUTE) / 1000)],
  ] as const;
}

export default function Countdown({ target }: { target: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const left = now === null ? 0 : Math.max(0, new Date(target).getTime() - now);

  return (
    <div className="countdown" role="timer" aria-label="Hitung mundur menuju hari pernikahan">
      {split(left).map(([label, value]) => (
        <div className="countdown-box" key={label}>
          <span className="countdown-value">{now === null ? "--" : String(value).padStart(2, "0")}</span>
          <span className="countdown-label">{label}</span>
        </div>
      ))}
    </div>
  );
}
