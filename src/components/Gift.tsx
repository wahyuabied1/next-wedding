"use client";

import Image from "next/image";
import { useState } from "react";
import { gift } from "@/lib/config";

export default function Gift() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (value: string, key: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(key);
        setTimeout(() => setCopied(null), 1800);
      })
      .catch(() => {});
  };

  const wa = `https://wa.me/${gift.whatsapp.phone}?text=${encodeURIComponent(gift.whatsapp.text)}`;

  return (
    <div className="gift">
      <button type="button" className="btn wide" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? "Tutup" : "Lihat Rekening"}
      </button>

      {open && (
        <div className="gift-panel">
          <div className="gift-card">
            <Image src={gift.bank.logo} alt="BCA" width={110} height={34} />
            <p className="gift-number">{gift.bank.number}</p>
            <p className="gift-holder">
              <small>Atas Nama</small>
              {gift.bank.holder}
            </p>
            <button type="button" className="copy" onClick={() => copy(gift.bank.number, "bank")} aria-label="Salin nomor rekening">
              {copied === "bank" ? "berhasil disalin" : <CopyIcon />}
            </button>
          </div>

          <div className="gift-card">
            <p className="gift-label">{gift.address.label}</p>
            <p className="gift-address">{gift.address.value}</p>
            <button type="button" className="copy" onClick={() => copy(gift.address.value, "addr")} aria-label="Salin alamat">
              {copied === "addr" ? "berhasil disalin" : <CopyIcon />}
            </button>
          </div>

          <a className="btn small" href={wa} target="_blank" rel="noopener noreferrer">
            Konfirmasi Hadiah
          </a>
        </div>
      )}
    </div>
  );
}

function CopyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 1H4a2 2 0 00-2 2v14h2V3h12V1zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z" />
    </svg>
  );
}
