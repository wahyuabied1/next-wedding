// Semua konten undangan ada di sini. Ubah teks/tanggal/rekening cukup di file ini.

export const site = {
  url: "https://abidfifi.live",
  title: "The Wedding of Fifi & Abid",
  description:
    "Kami mengundang Bapak/Ibu/Saudara/i untuk hadir di pernikahan Fifi & Abid, Sabtu 28 November 2026 di Hall Muzdalifah Asrama Haji Surabaya.",
  ogImage: "/photos/photo-12.webp",
};

export const couple = {
  bride: {
    name: "Refiana Dwi Maghfiroh, S.M., M.M",
    parents: ["Putri Kedua dari", "Bpk. Pardiyono", "& Ibu Warsini"],
    photo: "/photos/photo-1.webp",
    width: 721,
    height: 1080,
  },
  groom: {
    name: "Wahyu Abid Arifiyanto, S.Tr.Kom.",
    parents: ["Putra Kedua dari", "Bpk. H. Supriyanto (Alm)", "& Ibu Hj. Eni Solikhatin, S.Pd"],
    photo: "/photos/photo-3.webp",
    width: 699,
    height: 1080,
  },
  together: { photo: "/photos/photo-4.webp", width: 720, height: 1080 },
  families: {
    bride: { label: "FIFI", parents: ["Bpk. Pardiyono", "Ibu Warsini"] },
    groom: { label: "ABID", parents: ["Bpk. H. Supriyanto (Alm)", "Ibu Hj. Eni Solikhatin, S.Pd"] },
  },
};

export const venue = {
  name: "Hall Muzdalifah Asrama Haji Surabaya",
  address: "Jl. Manyar Kertoadi, Klampis Ngasem, Kec. Sukolilo, Surabaya, Jawa Timur 60116",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=-7.2853015,112.7791851",
};

export type WeddingEvent = {
  key: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  start: string; // ISO dengan zona waktu
  end: string;
};

export const events: WeddingEvent[] = [
  {
    key: "akad",
    title: "Akad Nikah",
    dateLabel: "Sabtu, 28 November 2026",
    timeLabel: "15.00 WIB",
    start: "2026-11-28T15:00:00+07:00",
    end: "2026-11-28T16:30:00+07:00",
  },
  {
    key: "resepsi",
    title: "Resepsi",
    dateLabel: "Sabtu, 28 November 2026",
    timeLabel: "18.00 WIB",
    start: "2026-11-28T18:00:00+07:00",
    end: "2026-11-28T21:00:00+07:00",
  },
];

// Hitung mundur menuju acara pertama (Akad Nikah).
export const countdownTarget = events[0].start;

export function calendarUrl(event: WeddingEvent): string {
  const fmt = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.title} Fifi & Abid`,
    dates: `${fmt(event.start)}/${fmt(event.end)}`,
    details: `${event.title} Fifi & Abid. ${event.dateLabel}, ${event.timeLabel}.`,
    location: `${venue.name}, ${venue.address}`,
    ctz: "Asia/Jakarta",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export const gift = {
  bank: {
    logo: "/img/logo-bca.png",
    number: "6750850519",
    holder: "REFIANA DWI",
  },
  address: {
    label: "Alamat Kirim Kado",
    value: "Pandugo Baru G-20, Penjaringansari, Rungkut, Surabaya 60297",
  },
  whatsapp: {
    phone: "6287855937298",
    text: "Hallo, aku kirim hadiah nih untuk bulan madu. Selamat berbulan madu ya!",
  },
};

// Urutan foto galeri (lebar x tinggi asli, untuk next/image).
export const gallery: { src: string; width: number; height: number }[] = [
  [22, 604, 1080],
  [21, 720, 1080],
  [19, 720, 1080],
  [20, 720, 1080],
  [18, 720, 1080],
  [17, 720, 1080],
  [15, 720, 1080],
  [14, 720, 1080],
  [12, 693, 1080],
  [11, 720, 1080],
  [10, 720, 1080],
  [9, 720, 1080],
  [8, 720, 1080],
  [6, 720, 1080],
  [5, 708, 1080],
  [4, 720, 1080],
  [3, 699, 1080],
  [2, 608, 1080],
  [1, 721, 1080],
  [7, 1080, 720],
].map(([n, width, height]) => ({ src: `/photos/photo-${n}.webp`, width, height }));

export const audioSrc = "/audio/song.mp3";
